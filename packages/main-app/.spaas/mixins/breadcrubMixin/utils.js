/**
 * 匹配所有路由
 * @param {} routePath
 */
export const matchAllRoutes = routePath => {
  routePath = routePath.replace(/(\?.*?)/g, '');

  let index = 0;
  const routes = [];
  while (index >= 0 && routePath.length) {
    routes.unshift(routePath);
    index = routePath.lastIndexOf('/');
    routePath = routePath.substr(0, index);
  }

  return routes;
};

/**
 * 获取 matched 中的最后一个匹配路由，方便匹配动态路由
 * @param {*} matched
 */
export const getLastMatchRoute = matched => {
  const len = matched.length;
  return len ? (matched[len - 1] || {}).path : '';
};
