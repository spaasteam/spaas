
import chalk from 'chalk'
import * as inquirer from 'inquirer'
import ModuleGitUrl from '../util/moduleGitUrl';
import { existsSync } from 'fs';
import { join } from 'path';
import * as mkdirp from 'mkdirp';
import { homedir } from 'os';
import { parseGitUrl, gitClone } from '../util/index';
const ora = require('ora')
import * as assert from 'assert';
import * as fs from 'fs-extra'

const projectModuleDir = '.spaas_modules';

/**
 * 查询全局缓存modules文件夹，没有则创建
 */
export function makeSureSPaaSTempPathExist() {
  const userHome = homedir();
  const modulesTempPath = join(userHome, '.spaas/modules');
  if (!existsSync(modulesTempPath)) {
    mkdirp.sync(modulesTempPath);
  }
  return modulesTempPath;
}

interface ModuleOptions {
  moduleName: string,
  childName: string,
}

interface AskMethods {
  (conf: ModuleOptions, prompts: object[]): void
}

export default class Index {
  public conf: ModuleOptions

  constructor(options: ModuleOptions) {
    this.conf = options;
  }

  start() {
    // 判断moduleName/childName是否为undefined
    this.ask()
      .then(async (answers) => {
        this.conf = Object.assign(this.conf, answers)
        await this.downModule(this.conf)
      })
      .catch(err => console.log(chalk.red('模块下载失败 ', err)))
      .finally(() => {
        process.exit(1)
      })
  }

  ask() {
    const prompts: object[] = []
    const conf = this.conf

    this.askModuleName(conf, prompts)
    this.askChildName(conf, prompts)
    return inquirer.prompt(prompts)
  }

  askIfDeleteFile() {
    const prompts: object[] = []
    prompts.push({
      type: 'confirm',
      name: 'ifDelete',
      message: '已经存在同名模块，是否要覆盖原来模块？'
    })
    return inquirer.prompt(prompts);
  }

  askModuleName: AskMethods = function (conf, prompts) {
    if (typeof conf.moduleName as string | undefined !== 'string') {
      prompts.push({
        type: 'input',
        name: 'moduleName',
        message: '请输入安装的模块名！',
        validate(input) {
          if (!input) {
            return '模块名不能为空！'
          }
          return true
        }
      })
    }
  }

  askChildName: AskMethods = function (conf, prompts) {
    if (typeof conf.childName as string | undefined !== 'string') {
      prompts.push({
        type: 'input',
        name: 'childName',
        message: '请输入安装的子模块名（如果不输入则默认为安装整个模块）！'
      })
    }
  }

  downModule = async function (conf) {
    const { moduleName } = conf;
    // 获取对应的模块仓库地址
    const moduleRepsUrl = ModuleGitUrl[moduleName];
    if(!moduleRepsUrl) {
      console.log(chalk.red(`找不到${moduleName},请确定模块名是否正确！`));
      return;
    }
    // 1、处理url
    // 2、将对应的仓库下载下来
    // 3、查找对应的module
    // 4、根据moduleSrc将代码cp到对应项目
    // 1、处理url
    const ctx = parseGitUrl(moduleRepsUrl);
    // 2、将对应的仓库下载下来
    const spinner = ora(`⏬ clone git repo from ${ctx.repo}`).start();
    const moduleTempPath = makeSureSPaaSTempPathExist();
    try {
      await gitClone({
        ...ctx,
        moduleTempPath
      });
      spinner.succeed();
    } catch (e) {
      spinner.fail();
      throw new Error(e);
    }
    const templateTmpDirPath = join(moduleTempPath, ctx.id);
    const sourcePath = join(templateTmpDirPath, ctx.path)
    assert(existsSync(sourcePath), `${sourcePath} don't exists`);

    // 3、查找对应的module
    const modulePath = join(sourcePath, './main/index.js');
    if (!existsSync(modulePath)) {
      throw new Error(`在${sourcePath}下找不到'./main/index.js'文件`);
    }

    // 4、拷贝对应模块
    try {
      const { childName } = this.conf;

      const moduleSrc: object = require(modulePath);
      const targetPath = join(process.cwd(), `./${projectModuleDir}`, `./${moduleName}`);
      if (childName) {
        // 下载符合需求的模块
        const childModulePath = moduleSrc[childName]
        // 查询模块列表
        if (childModulePath) {
          // 4、根据moduleSrc将代码cp到对应项目
          const childTargetPath = join(targetPath, `./${childName}`);
          await this.downloadModuleByPath(childModulePath, childTargetPath).then(() => {
            console.log(chalk.green(`👏 对应的模块已经安装到${childTargetPath}下，快去进行使用吧`))
          }).catch(() => {
            console.log(chalk.red(`模块安装失败，请重试！`))
            throw new Error(`模块安装失败`);
          })

        } else {
          console.log(chalk.red(`找不到${moduleName},请确定模块名是否正确！`));
        }
      } else {
        // 下载全部模块
        const promiseAll: any = [];
        for (const i in moduleSrc) {
          promiseAll.push(this.downloadModuleByPath(moduleSrc[i], join(targetPath, `./${i}`)));
        }
        await Promise.all(promiseAll).then(() => {
          console.log(chalk.green(`👏 对应的模块已经安装到${targetPath}下，快去进行使用吧`))
        }).catch(() => {
          console.log(chalk.red(`模块安装失败，请重试！`))
          throw new Error(`模块安装失败`);
        })
      }
    } catch (e) {
      throw new Error(`读取 './main/index.js'失败，请确认该文件为node模块`);
    }
 }

  downloadModuleByPath = async function (sourcePath, targetPath): Promise<void> {
    // 1、查找原来是否存在该模块
    // 2、如果存在该模块，则提醒用户是否覆盖
    return new Promise((resolve, reject) => {
      const saveModule = (sourcePath, targetPath) => {
        fs.copy(sourcePath, targetPath).then(() => {
          resolve();
        }).catch(err => {
          reject(err);
        })
      };
      // 1、查找原来是否存在该模块
      if (fs.existsSync(targetPath)) {
        this.askIfDeleteFile().then(res => {
          const { ifDelete } = res;
          if (ifDelete) {
            fs.removeSync(targetPath);
            fs.mkdirSync(targetPath);
            saveModule(sourcePath, targetPath)
          } else {
            resolve();
          }
        })
      } else {
        fs.mkdirp(targetPath).then(() => {
          saveModule(sourcePath, targetPath)
        }).then(() => {
          throw new Error(`创建${targetPath}文件目录失败，请重试`);
        })
      }
    })

  }
}
