import Vue from 'vue';
import routeInfoMap from '@/const/route-info';
import {matchAllRoutes, getLastMatchRoute} from './utils';

const pathToRegexp = require('path-to-regexp');

const data = Vue.observable({
  $bcm_list: [],
});

// 重置路由，并设置新值
function setBreadcrumbList(routePaths, params) {
  data.$bcm_list.splice(0, data.$bcm_list.length);

  routePaths.forEach(path => {
    const routeInfo = routeInfoMap[path];

    if (routeInfo) {
      const toPath = pathToRegexp.compile(path);

      data.$bcm_list.push({
        path,
        fullPath: toPath(params),
        ...routeInfo,
      });
    }
  });
}

const findPathIndex = path =>
  data.$bcm_list.findIndex(v => v.path && pathToRegexp(v.path).test(path));

export default {
  provide: {
    ...data,
    $bcm: {
      /**
       * 设置单个
       * @param {*} path
       * @param {*} title
       */
      setTitleByPath(path, title) {
        const index = findPathIndex(path);
        if (index > -1) {
          const router = data.$bcm_list[index];
          router.title = title;
          delete router.render;
          data.$bcm_list.splice(index, 1, router);
        }
      },
      /**
       * 设置多个
       * @param {*} path
       * @param {*} array{
          "title": "测试",
          "enable": true,
          "appType": 1,
           path?: 跳转路径，如果 enable false 可以省略
       *
       * }
       */
      setMultiByPath(path, array) {
        const index = findPathIndex(path);

        if (index > -1) {
          data.$bcm_list.splice(index, 1, ...array);
        }
      },
      /**
       *
       * @param {*} path  要替换的 路由 path
       * @param {*} render 传入渲染的 render 方法
       */
      setJSXByPath(path, render) {
        const index = findPathIndex(path);
        if (index > -1) {
          const router = data.$bcm_list[index];
          router.render = render;
          data.$bcm_list.splice(index, 1, router);
        }
      },
    },
  },
  watch: {
    $route: {
      handler() {
        const {params} = this.$route;

        const routePath = getLastMatchRoute(this.$route.matched);

        const routePaths = matchAllRoutes(routePath);

        setBreadcrumbList(routePaths, params);
      },
      immediate: true,
    },
  },
};
