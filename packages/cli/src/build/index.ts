/**
 * 本地构建发布到OSS环境
 */
// TODO
/**
 * 在项目中执行spaas build dev/qa命令
 * 读取项目中的.spaas.dev/.spaas.qa配置的OSS信息（OSS_KEY、 OSS_SECRET、OSS_BUCKET、OSS_REGION ）
 * 拼接项目中固定的文件目录；
 * 生成publicPath, 写入到对应的.dev/.qa文件中;
 * 编译构建生成对应的文件；
 * 将文件拷贝到OSS；
 * 根据.spaas.dev/.spaas.qa文件夹中的配置konga
 */
import chalk from 'chalk'
import { promisify } from '../util/index';

const childProcess = require('child_process');
const OSS = require('ali-oss');

import {
  IBuildConfig,
  IBuildOptions,
  IOssConfig,
  ISPaaSBuildConfig,
  IBuildFunc,
  IConfigOutput
} from './index.d';

const fs = require('fs')
const path = require('path')
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat)

const OSS_DOMAIN_URL = 'https://spaas.oss-cn-beijing.aliyuncs.com';
const OSS_FRONT_END_BASE_DIR = '/frontEnd';

export default class Build implements IBuildFunc {
  public conf: IBuildConfig

  // public publicPath: string
  public uniqueProjectName: string

  // 构建出来的文件路径数组
  public distFilePath: string[] = []

  // ossClient
  public client

  // ossConfig
  public ossConfig: IOssConfig

  constructor(options:IBuildOptions) {
    const {
      configPath,
      debug,
      encoding,
      type
    } = options;
    this.conf = {
      type,
      configPath: configPath || `./.spaas.${type}.env`,
      debug: Boolean(debug),
      encoding: encoding || 'utf8'
    }
  }

  get publicPath(): string {
    return `${OSS_DOMAIN_URL}/${this.ossProjectBasePath}`
  }

  get ossProjectBasePath(): string {
    return `${OSS_FRONT_END_BASE_DIR}/${this.conf.type}/${this.uniqueProjectName}`
  }

  
  async run() {
    // 读取项目中的.spaas.dev/.spaas.qa配置的OSS信息（OSS_KEY、 OSS_SECRET、OSS_BUCKET、OSS_REGION ）
    // 在环境变量中写入public_path
    // 编译构建生成对应的文件；
    // 将文件拷贝到OSS；
    // 返回publicPath,并写入到对应的.spaas.dev/.spaas.qa文件中

    // 读取项目中的.spaas.dev/.spaas.qa配置的OSS信息（OSS_KEY、 OSS_SECRET、OSS_BUCKET、OSS_REGION ）
    const getConfig = this.readConfigFile()
    if(getConfig.error) return
    const { 
      UNIQUE_PROJECT_NAME,
      OSS_KEY,
      OSS_SECRET,
      OSS_BUCKET,
      OSS_REGION
     } = getConfig.parsed as ISPaaSBuildConfig
    this.uniqueProjectName = UNIQUE_PROJECT_NAME
    this.ossConfig = {
      OSS_KEY,
      OSS_SECRET,
      OSS_BUCKET,
      OSS_REGION
    };
    // 将publicPath写入到node环境变量中，并写入到对应的.spaas.dev/.spaas.qa文件中
    if(this.writePublicPath()) {
      // 编译构建生成对应的文件；
      const status = await this.buildProject();
      if(status) {
        // 将文件拷贝到OSS；
        await this.transportFileToOss();
      }
    }
  }

  parse (src: string | Buffer, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
    const NEWLINE = '\n'
    const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
    const RE_NEWLINES = /\\n/g
    const NEWLINES_MATCH = /\n|\r|\r\n/

    const debug = Boolean(options && options.debug)
    const obj = {}
  
    // convert Buffers before splitting into lines and processing
    src.toString().split(NEWLINES_MATCH).forEach((line, idx) => {
      // matching "KEY' and 'VAL' in 'KEY=VAL'
      const keyValueArr = line.match(RE_INI_KEY_VAL)
      // matched?
      if (keyValueArr !== null) {
        const key = keyValueArr[1]
        // default undefined or missing values to empty string
        let val = (keyValueArr[2] || '')
        const end = val.length - 1
        const isDoubleQuoted = val[0] === '"' && val[end] === '"'
        const isSingleQuoted = val[0] === "'" && val[end] === "'"
  
        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end)
  
          // if double quoted, expand newlines
          if (isDoubleQuoted) {
            val = val.replace(RE_NEWLINES, NEWLINE)
          }
        } else {
          // remove surrounding whitespace
          val = val.trim()
        }
  
        obj[key] = val
      } else if (debug) {
        console.log(`在匹配key-value的时候，在以下地方发送了错误：${idx + 1}字节: ${line}行`)
      }
    })
  
    return obj
  }
  /**
   * 根据配置文件路径读取oss配置信息
   * @param filePath 配置文件路径
   */
  readConfigFile(): IConfigOutput {
    const { debug, encoding, configPath } = this.conf;

    const spaasConfigPath = path.resolve(process.cwd(), configPath)
  
    try {
      // specifying an encoding returns a string instead of a buffer
      const parsed = this.parse(fs.readFileSync(spaasConfigPath, { encoding }), { debug })
      const mustHasKeys = ['OSS_KEY', 'OSS_SECRET', 'OSS_BUCKET', 'OSS_REGION', 'UNIQUE_PROJECT_NAME'];
      const notExitKeys: typeof mustHasKeys = [];
      for(const item of mustHasKeys) {
        if(!parsed[item]) {
          notExitKeys.push(item)
        }
      }
      if(notExitKeys.length) {
        console.log(chalk.red(`配置文件${spaasConfigPath}中缺少${notExitKeys.join(',')}的配置`))
        return {
          error: new Error()
        }
      }
      return { parsed } as { parsed: ISPaaSBuildConfig };
    } catch (e) {
      return { error: e }
    }
  }

  /**
   * 执行yarn build命令，生成dist文件夹
   */
  buildProject(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const child = childProcess.exec('yarn build');
        child.stdout.on('data', (data) => {
          console.log(data)
        })
        child.stderr.on('data', (data) => {
          console.log(chalk.yellow(data))
        })
        child.on('close', (code) => {
          if(code >= 1) {
            reject(false)
          } else {
            resolve(true);
          }
        });
      } catch(e) {
        reject(false)
      }
    })
  }

  /**
   * 将本地文件搬运到OSS上
   * @param sourcePath 本地的构建文件目录
   * @param ossConfig 发布需要用到的OSSConfig文件
   */
  async transportFileToOss(): Promise<boolean> {
    const distDir = path.resolve(process.cwd(), './dist');
    // 读取本地文件列表
    try {
      // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
      await this.readDirRecur(distDir);
    } catch(e) {
      console.error('error: %j', e);
    }

    // 遍历文件列表，上传到oss
    const {
      OSS_KEY,
      OSS_SECRET,
      OSS_BUCKET,
      OSS_REGION
    } = this.ossConfig;
    this.client = new OSS({
      region: OSS_REGION,
      accessKeyId: OSS_KEY,
      accessKeySecret: OSS_SECRET,
      bucket: OSS_BUCKET
    });
    
    const promiseArr: Promise<boolean>[] = []
    for(const item of this.distFilePath) {
      promiseArr.push(this.uploadFileOneByOne(item))
    }
    return Promise.all(promiseArr).then((res) => {
      console.log(res);
      return true
    })
  }

  uploadFileOneByOne(filePath: string): Promise<boolean> {
    const fileName = filePath.replace(`${process.cwd()}/dist`, '/frontEnd/qa')
    return this.client.multipartUpload(fileName, filePath).then(res => true).catch(e => {
      console.log(e);
      return false
    })
  }

  /**
   * 
   * @param fileDir string 
   */
  readDirRecur(fileDir: string): Promise<string[]> {
    return readdir(fileDir).then((files: Promise<any>[]) => {
      files = files.map((item) => {
        const fullPath = fileDir + '/' + item; 
        // @ts-ignore
        return stat(fullPath).then((stats: any) => {
            if (stats.isDirectory()) {
                return this.readDirRecur(fullPath);
            }else{
              /*not use ignore files*/
              if(item[0] !== '.'){
                this.distFilePath.push(fullPath);
                return fullPath;
              }
            }
          })
      });
      return Promise.all(files);
    });
  }

  /**
   * 将生成的publicPath写入到本地的配置文件夹
   */
  writePublicPath(): boolean {
    const envPath = path.resolve(process.cwd(), '.env')
    const publicPath = this.publicPath;
  
    try {
      const fileResult = fs.readFileSync(envPath, 'utf8');
      const fileResultStr = `${fileResult}\n`
      + `# PUBLIC_PATH\n`
      + `PUBLIC_PATH = ${publicPath}`;
      fs.writeFileSync(envPath, fileResultStr, {spaces: '\t'});
      return true
    } catch(e) {
      return false
    }
  }
}