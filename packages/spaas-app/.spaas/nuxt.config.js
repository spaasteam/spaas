/*
 * @Description: nuxt 配置文件
 * @Author: barret
 * @Date: 2019-08-10 07:57:24
 * @LastEditTime: 2019-08-22 21:08:07
 * @LastEditors: barret
 */
require('dotenv').config();
const proxyConfig = require('../proxy.config');
const path = require('path');
// 添加扩展路由
const fg = require('fast-glob');

function resolve(dir) {
  return path.join(__dirname, dir);
}

['PUBLIC_PATH', 'API_SERVER', 'COOKIE_PATH', 'NO_LOGIN'].forEach(key =>
  console.log('%s\t: %s', key, process.env[key]),
);

const env = process.env;
const isProd = env.MODE === 'prod';

const publicPath = env.PUBLIC_PATH || './';

const filePath = fg.sync(resolve('../modules/**/route.js'), {
  deep: 2,
  onlyFiles: true,
});

const routes = filePath.reduce((pre, cur) => {
  const file = require(cur).default;
  return pre.concat(file);
}, []);

// 不能以斜杠结尾
const apiServer = process.env.API_SERVER;
// 必须以斜杠结尾

const config = {
  aliIconFont: '',
  env: proxyConfig,
};

let axios = {
  proxy: true,
};

// 如果生产指定apiServer, 则使用绝对路径请求api
if (isProd && apiServer) {
  axios = {
    proxy: false,
    baseURL: apiServer,
  };
}

const nuxtConfig = {
  srcDir: '.spaas/',
  mode: 'spa',
  env: {
    NO_LOGIN: process.env.NO_LOGIN,
    COOKIE_PATH: process.env.COOKIE_PATH || '/',
  },
  proxy: config.env[env.MODE],
  router: {
    middleware: ['meta', 'auth'],
    mode: 'hash',
    extendRoutes(r) {
      r.unshift(...routes);
    },
  },
  /*
   ** Build configuration
   */
  build: {
    [isProd ? 'publicPath' : '']: publicPath,
    extractCSS: true,
    /*
     ** Run ESLint on save
     */
    extend(config, {isDev, isClient}) {
      config.externals = {
        vue: 'Vue',
        '@femessage/element-ui': 'ELEMENT',
        'element-ui': 'ELEMENT',
      };
      config.module.rules = config.module.rules.filter(item => !item.test.test('.svg'));

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('./icons')],
        options: {
          symbolId: 'icon-[name]',
        },
      });

      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg)$/,
        exclude: [resolve('./icons')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000, // 1K limit
              name: 'img/[name].[hash:8].[ext]',
            },
          },
        ],
      });

      // Run ESLint on save
      // if (isDev && isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/,
      //     options: {
      //       cache: true,
      //       fix: true,
      //       quiet: true,
      //     },
      //   });
      // }
      isProd && (config.output.publicPath = publicPath);
    },
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'SPaaS Console',
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        'http-equiv': 'x-ua-compatible',
        content: 'IE=edge, chrome=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'SPaaS Console',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//cdn.jsdelivr.net/npm/@spaas/spaas-theme-chalk@2.12.3/lib/index.css',
      },
    ],
    script: [
      {
        type: 'text/javascript',
        src: '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
      },
      {
        type: 'text/javascript',
        src: '//cdn.jsdelivr.net/npm/@femessage/element-ui@2.12.3/lib/index.js',
      },
    ],
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#5D81F9',
  },
  /**
   * Share variables, mixins, functions across all style files (no @import needed)
   * @Link https://github.com/nuxt-community/style-resources-module/
   */
  styleResources: {
    less: '~styles/var.less',
  },
  css: [
    {
      src: '~styles/global.less',
      lang: 'less',
    },
  ],
  plugins: [
    {
      src: '~/plugins/axios-port.js',
    },
    {
      src: '~/plugins/axios',
    },
    {
      src: '~/plugins/element',
    },
    {
      src: '~/plugins/store',
    },
    {
      src: '~/plugins/router',
    },
    '~/plugins/globalPlugin',
  ],
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    [
      '@nuxtjs/dotenv',
      {
        path: './',
      },
    ],
  ],
  axios,
};

module.exports = nuxtConfig;
