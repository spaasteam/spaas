const path = require('path');
const resolve = file => {
  return path.resolve(__dirname, file);
};

exports.default = [
  {
    path: '/application-type',
    component: resolve('./pages/application-type/index.vue'),
    title: '应用管理',
    appType: '1',
    enable: false,
  },
  {
    path: '/app-manage',
    component: resolve('./pages/app-manage/index.vue'),
    title: '应用类型',
    appType: '0',
    enable: true,
  }
];
