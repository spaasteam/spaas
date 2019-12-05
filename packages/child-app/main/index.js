/**
 * 模块入口文件
 */
const path = require('path');
const fg = require('fast-glob');

function resolve(dir) {
  return path.join(__dirname, dir);
}

// 保留模块路径
const filePath = fg.sync(resolve('../src/*'), {
  onlyFiles: false,
  deep: 1,
});

const modulesPath = filePath.reduce((obj, item) => {
  const pathArr = item.split('/') || [];
  const moduleName = pathArr[pathArr.length - 1];
  obj[moduleName] = item;
  return obj;
}, {});

// 最终的数据格式为{ 'spaas-application': '/Users/barret/projects/spaas-console/src/spaas-application' }
module.exports = modulesPath;
