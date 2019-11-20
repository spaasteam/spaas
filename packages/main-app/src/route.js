const path = require('path');
const resolve = file => {
  return path.resolve(__dirname, file);
};

exports.default = [
  {
    path: '/hello',
    component: resolve('./pages/hello.vue'),
    title: '欢迎你',
    appType: '2',
    enable: false,
  },
];
