
import * as path from 'path'
import * as child_process from 'child_process'
import chalk from 'chalk'
import * as ora from 'ora'
import * as fs from 'fs-extra'

import { PRIVATE_NPM, UPDATE_PACKAGE_LIST } from '../util/constants'
import { shouldUseYarn } from '../util'

const exec = child_process.exec
const pkgPath = path.join(process.cwd(), 'package.json')

interface IndexOptions {
  pkgName?: any,
  dev?: boolean,
  ignoreWorkspaceRootCheck?: boolean,
  peer?: boolean,
  optional?: boolean,
  exact?: boolean,
  tilde?: boolean,
  audit?: boolean,
}

export default class Index {
  public conf: IndexOptions
  private useYarn: boolean = shouldUseYarn()

  constructor(options: IndexOptions) {
    this.conf = Object.assign({
      pkgName: ''
    }, options)
  }

  create(forceInstall?: boolean) {
    const pkgName = this.conf.pkgName
    if (pkgName) {
      this.installSinglePkg()
    } else {
      this.installAll(forceInstall)
    }
  }

  installSinglePkg() {
    const {
      pkgName,
      ignoreWorkspaceRootCheck,
      dev,
      peer,
      optional,
      exact,
      tilde,
      audit
    } = this.conf
    // 安装对应的依赖包
      const installSpinner = ora(`执行安装项目依赖 ${chalk.cyan.bold(pkgName)}, 需要一会儿...`).start()
      let registryUrl = ''
      if (UPDATE_PACKAGE_LIST.indexOf(pkgName) !== -1) {
        registryUrl = `--registry=${PRIVATE_NPM}`
      }
      let command
      if (this.useYarn) {
        command = `yarn add ${pkgName} ${registryUrl}`
        command += `${ignoreWorkspaceRootCheck ? ' -W': ''}`
        command += `${dev ? ' --dev' : ''}`
        command += `${peer ? ' --peer' : ''}`
        command += `${optional ? ' --optional' : ''} `
        command += `${exact ? ' --exact' : ''}`
        command += `${tilde ? ' --tilde' : ''}`
        command += `${audit ?' --audit' : ''}`
      } else {
        installSpinner.fail(chalk.red('请先安装Yarn，再重新安装该依赖！'))
        process.exit(1)
      }
      const child: any = exec(command)

      child.stdout.on('data', function(data) {
        installSpinner.stop()
        console.log(data)
      })
      child.stderr.on('data', function(data) {
        installSpinner.stop()
        console.log(data)
      })
      child.on('exit', function(code) {
        if (code) {
          installSpinner.fail(
            chalk.red(`安装项目依赖 ${chalk.cyan.bold(pkgName)}失败，请查看控制台报错信息或者重试！😂`)
          )
        } else {
          installSpinner.succeed(
            chalk.green(`安装项目依赖 ${chalk.cyan.bold(pkgName)}成功，可以愉快的工作了！🎉`)
          )
        }
      })
  }

  installAll(forceInstall?: boolean) {
    if (!fs.existsSync(pkgPath)) {
      console.log(chalk.red('找不到Package.json，请确定当前目录是项目根目录!'))
      process.exit(1)
    }
    const packageMap = require(pkgPath)
    const { dependencies, devDependencies } = packageMap
    let updataStr = ''
    Object.keys(dependencies).forEach(key => {
      if (UPDATE_PACKAGE_LIST.indexOf(key) !== -1) {
        updataStr += ` ${key}@${dependencies[key]}`
      }
    })
    Object.keys(devDependencies).forEach(key => {
      if (UPDATE_PACKAGE_LIST.indexOf(key) !== -1) {
        updataStr += ` ${key}@${devDependencies[key].replace('^', '')}`
      }
    })

    let command
    if (this.useYarn) {
      if (updataStr && forceInstall) {
        command = `yarn add ${updataStr} --registry=${PRIVATE_NPM} && yarn`
      } else {
        command = 'yarn'
      }
    } else {
      console.log()
      console.log(chalk.red('请先安装Yarn，再重新安装项目依赖！'))
      console.log()
    }

    const installSpinner = ora(`即将安装项目所有 SPaaS 相关依赖...`).start();
    const child: any = exec(command, { timeout: 300000 })

    child.stdout.on('data', function(data) {
      installSpinner.stop()
      console.log(data)
    })
    child.stderr.on('data', function(data) {
      installSpinner.stop()
      console.log(data)
    })
    child.on('exit', function(code) {
      if(code) {
        installSpinner.fail(
          chalk.red(`安装失败，请直接执行${chalk.gray(command)}进行安装`)
        )
      } else {
        installSpinner.succeed(chalk.green('项目相关依赖安装成功，可以愉快的工作了！🎉'))
      }
    })
  }

}
