require('dotenv').config()
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const proxyConfig = require('./proxy.config');
const {env} = process

let publicPath = env.PUBLIC_PATH || './'

// vue.config.js
module.exports = {
  // 选项...
  devServer: {
    proxy: proxyConfig
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? publicPath
    : './',
  chainWebpack(config) {
    config.resolve.alias
        .set('~', resolve('views'))
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  configureWebpack:{
    externals: {
       'vue': 'Vue',
       'vue-router': 'VueRouter',
       'element-ui': 'ELEMENT',
    }
  },
}