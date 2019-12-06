const Template = require('@spaas/main-app');
import * as fs from 'fs-extra'
import * as path from 'path'
import * as fg from 'fast-glob'
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
      this.createRouterFile();
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
    if (fs.existsSync(targetPath)) {
      // 清除原来的.spaas目录
      fs.removeSync(targetPath);
    }
    return fs.copySync(sourcePath, targetPath);
  }
  // 1、将对应的项目依赖拷贝到项目里面
  // 2、查找src文件夹下的所有router文件，生成对应的路由文件
  // 3、执行nuxt start config
  /**
   * 查找src文件夹下的所有router文件，生成对应的路由文件
   */
  createRouterFile() {
    const filePath = fg.sync(path.join(process.cwd(), '/src/**/route.js'), {
      deep: 2,
      onlyFiles: true
    });
    const routes = filePath.reduce((pre, cur: any) => {
      const file = require(cur).default;
      const reg = /(?<=\/src\/)(.*?)(?=\/route.js)/;
      const modulePath = cur.match(reg);
      const targetRoutes = file.map(info => {
        return {
          ...info,
          modulePath
        }
      })
      return pre.concat(targetRoutes)
    }, []);
    // 生成对应的JSON文件
    this.setRouteAction(routes);
  }

  setRouteAction = routeList => {
    const navPath = path.resolve(process.cwd(), './.spaas/const/route-info.json');

    const routerInfoJson = {};

    routeList.forEach(item => {
      const { path, title = '', appType, enable } = item;

      const routePath = path.startsWith('/') ? path : `/${path}`;

      // 路由匹配的是 : 不是 下划线
      routerInfoJson[routePath.replace(/_/g, ':')] = {
        title,
        appType,
        enable
      };
    })

    fs.writeFileSync(navPath, JSON.stringify(routerInfoJson, null, '   '), 'utf-8');
  }

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
