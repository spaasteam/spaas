/**
 * 本地构建发布到OSS环境
 */
/**
 * 在项目中执行spaas build dev/qa命令
 * 读取项目中的.spaas.dev/.spaas.qa配置的OSS信息（BUILD_OSS_KEY、 BUILD_OSS_SECRET、BUILD_OSS_BUCKET、BUILD_OSS_REGION ）
 * 拼接项目中固定的文件目录；
 * 生成publicPath, 写入到对应的.dev/.qa文件中;
 * 编译构建生成对应的文件；
 * 删除原有的OSS文件 // TODO
 * 将文件拷贝到OSS临时文件夹 // TODO
 * 将原有文件夹重命名 // TODO
 * 将临时文件夹重命名为原有文件夹 // TODO
 * 删除原有的临时文件夹
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

export default class Build implements IBuildFunc {
  public conf: IBuildConfig

  // public publicPath: string
  public uniquePublicPath: string

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

  get ossProjectBasePath(): string {
    const reg = /^((https?:)?)\/\/(([a-zA-Z0-9_-])+(\.)?)*(\/*)/
    const ossFilePath = this.uniquePublicPath.replace(reg, '/');
    return ossFilePath.replace(/\/$/, '')
  }

  // 项目的缓存文件夹目录
  get ossProjectTempPath(): string {
    return `${this.ossProjectBasePath}_temp`
  }

  async run() {
    // 读取项目中的.spaas.dev/.spaas.qa配置的OSS信息（BUILD_OSS_KEY、 BUILD_OSS_SECRET、BUILD_OSS_BUCKET、BUILD_OSS_REGION ）
    // 在环境变量中写入public_path
    // 编译构建生成对应的文件；
    // 将文件拷贝到OSS；
    // 返回publicPath,并写入到对应的.spaas.dev/.spaas.qa文件中

    // 读取项目中的.spaas.dev/.spaas.qa配置的OSS信息（BUILD_OSS_KEY、 BUILD_OSS_SECRET、BUILD_OSS_BUCKET、BUILD_OSS_REGION ）
    const getConfig = this.readConfigFile()
    if(getConfig.error) return
    const { 
      PUBLIC_PATH,
      BUILD_OSS_KEY,
      BUILD_OSS_SECRET,
      BUILD_OSS_BUCKET,
      BUILD_OSS_REGION
     } = getConfig.parsed as ISPaaSBuildConfig
    // 校验PUBLIC_PATH的数据格式
    const reg = /^((https?:)?)\/\/(([a-zA-Z0-9_-])+(\.)?)*(\/((\.)?[a-zA-Z0-9_-])*)*$/i;
    if(!reg.test(PUBLIC_PATH)) {
      console.log(`${chalk.red('❌ ')}${chalk.grey(`PUBLIC_PATH格式不正确`)}`);
      process.exit(1);
    }

    this.uniquePublicPath = PUBLIC_PATH
    this.ossConfig = {
      BUILD_OSS_KEY,
      BUILD_OSS_SECRET,
      BUILD_OSS_BUCKET,
      BUILD_OSS_REGION
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
      const mustHasKeys = ['BUILD_OSS_KEY', 'BUILD_OSS_SECRET', 'BUILD_OSS_BUCKET', 'BUILD_OSS_REGION', 'PUBLIC_PATH'];
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
      BUILD_OSS_KEY,
      BUILD_OSS_SECRET,
      BUILD_OSS_BUCKET,
      BUILD_OSS_REGION
    } = this.ossConfig;
    this.client = new OSS({
      region: BUILD_OSS_REGION,
      accessKeyId: BUILD_OSS_KEY,
      accessKeySecret: BUILD_OSS_SECRET,
      bucket: BUILD_OSS_BUCKET
    });
    
    // TODO
    // 将原有的缓存文件去除
    // 上传文件到缓存文件夹
    // 将原有的正式文件删除
    // 将缓存文件夹重命名为正式文件夹
    // 将原有的缓存文件去除
    this.client.delete('object-name');

    const promiseArr: Promise<boolean>[] = []
    for(const item of this.distFilePath) {
      promiseArr.push(this.uploadFileOneByOne(item))
    }
    return Promise.all(promiseArr).then((res) => {
      return Boolean(res.filter(item => item === false).length)
    })
  }

  uploadFileOneByOne(filePath: string): Promise<boolean> {
    const fileName = filePath.replace(`${process.cwd()}/dist`, this.ossProjectBasePath)
    return this.client.multipartUpload(fileName, filePath).then(res => true).catch(e => {
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
    const publicPath = this.uniquePublicPath;
  
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