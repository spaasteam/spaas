const Template = require('@spaas/main-app');
import * as fs from 'fs-extra'
import * as path from 'path'

interface IndexOptions {
  configPath?: any, // 配置spaas.config.js路径
}

export default class Index {
  public conf: IndexOptions

  constructor(options: IndexOptions) {
    this.conf = Object.assign({
      configPath: ''
    }, options)
  }

  async init() {
    try{
      await this.cloneMainApp(Template.dir);
    } catch(err) {
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

}
