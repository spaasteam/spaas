const Template = require('@spaas/main-app');
import * as fs from 'fs-extra'
import * as path from 'path'
const exec = require('child_process').exec
const ora = require('ora')

interface IndexOptions {
  configPath?: any, // 配置spaas.config.js路径
  argv?: any
}

export default class Index {
  public conf: IndexOptions
  public _argv: any

  constructor(options: IndexOptions) {
    this.conf = Object.assign({
      configPath: ''
    }, options)
    const argv = options.argv;
    this._argv = Array.from(argv)
    console.error(this._argv);
  }

  async init() {
    try {
      await this.cloneMainApp(Template.dir);
      this.runNuxtCommand();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 将主应用安装到子应用里面
   */
  async cloneMainApp(sourcePath) {
    const targetPath = path.join(process.cwd(), '.spaas');
    if (!fs.existsSync(targetPath)) {
      // 清除原来的.spaas目录
      fs.remove(targetPath);
    }
    return fs.copy(sourcePath, targetPath);
  }
  // 1、将对应的项目依赖拷贝到项目里面
  // 2、执行nuxt start config
  /**
   * 执行Nuxt命令
   */
  runNuxtCommand() {
    const command = this._argv.join(' ');
    const nuxtCommand = `npx nuxt ${command}`

    const child = exec(nuxtCommand)
    const spinner = ora('即将启动Nuxt...').start()
    child.stdout.on('data', function (data) {
      console.log(data)
      spinner.stop()
    })
    child.stderr.on('data', function (data) {
      console.log(data)
      spinner.stop()
    })
  }
}
