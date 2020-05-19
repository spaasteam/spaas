require('dotenv').config()
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const proxyConfig = require('./proxy.config');
const {
  env
} = process

let publicPath = env.PUBLIC_PATH || './'

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './views/styles/var.less'),
      ],
    })
}

// vue.config.js
module.exports = {
  // 选项...
  devServer: {
    proxy: proxyConfig
  },
  publicPath: process.env.NODE_ENV === 'production' ?
    publicPath :
    './',
  chainWebpack(config) {
    config.resolve.alias
      .set('~', resolve('views'))
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('views/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('views/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
    }
  },
}
