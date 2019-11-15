const path = require('path')
const resolve = (file)=> {
  return path.resolve( __dirname, file);
}

console.log(resolve('./pages/hello.vue'));

export default [
  {
    path: '/hello',
    component: resolve('./pages/hello.vue')
  }
]
