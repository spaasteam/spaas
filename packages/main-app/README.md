# 微前端主应用开发说明

## 前言
对主应用封装的主要目的：

- 为了保证团队的子应用的通用性（也就是说子应用可以移植到公司任何的主应用下）
- 方便团队的统一接入IAM
- 降低微前端的主应用开发门槛



## 开发说明
### 一、安装spaas命令行工具
spaas-cli工具需要全局安装，在命令行工具里面输入以下命令：（spaas-cli依赖yarn，yarn需要事先全局安装）
```bash
npm install @spaas/cli@2.0.2-alpha.0 --registry=http://129.204.96.188:4873 -g
# 验证是否安装成功
spaas -V
# 如果出现对应的版本号，即对应的spaas-cli命令行工具安装成功
```


### 二、初始化主应用脚手架
执行如下命令，按照输入提示填写应用信息
```bash
# 执行启动交互命令
spaas init
# 1、选择对应的初始化应用模板，这里选择“微前端主应用模块”
# 2、填写相应的项目名称（必填，到时候初始化后为项目的文件夹名称了）；
# 3、填写项目版本；
# 4、填写项目描述；
```


### 三、安装项目依赖
```bash
yarn
```
### 四、在项目根目录下创建.env文件
```bash
API_SERVER=http://dr.sandbox.deepexi.top

# PUBLIC_PATH=http://cdn-dev.deepexi.top/deepexi-ci-cd/deploy/5da1824b70e174004079a44a/xraclv96jd2nd7z8cyanl0h4i8jtu51n/
```


### 五、在views文件夹下进行项目开发


## 开发注意事项

- 所有的开发都应该在views文件夹下；
- views文件夹下必须包含**router.js文件（详情看文章下面说明）；**
- **views文件夹下必须包含wrapper.vue文件；**
- 在使用vuex的时候，必须用命名空间，不能直接注册到主store里面；


<br />

## router.js
相当于逻辑层的入口文件。里面必须暴露对应的路由声明数组。例子如下：
```javascript
const routes = [
  {
    path: '/',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ './layouts/default.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "about" */ './pages/login.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: 'LoginLayout',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ './layouts/login.vue'),
    children: [
      {
        path: '/',
        name: 'Login',
        component: () => import(/* webpackChunkName: "about" */ './pages/login.vue'),
      }
    ]
  },
];
export default routes;
```
如果有部分页面不要求用户需要先登录才访问的，同样的在文件里面修改whitePathList即可
```javascript
// 路由token校验白名单
const whitePathList = [
  '/login',
  // 添加需要的跳过登录的页面
];
export {
  whitePathList
};
```
如果其他在页面载入之前需要加载的程序都统一在router.js这个文件里面进行处理。如：
```javascript
import "./assets/global.less";
import "./assets/reset.less";
```
## wrapper.vue
wrapper.vue就是主应用项目显示的最外层，里面必须有一个默认的slot，以方便微应用显示。
```vue
<template>
  <index-layout>
    <!-- 需要有slot标签 -->
    <slot></slot>
  </index-layout>
</template>

<script>
import IndexLayout from './layouts/default';

export default {
  components: {
    IndexLayout,
  }
}
</script>
```


## 关于store的使用
为了避免污染根store，所有store的使用都应该用命名空间。如：<br />/views/store/index.js文件：
```javascript
export const state = () => ({})

export const getters = {}

export const mutations = {
}

export const actions = {
  testStores() {
    console.log('我是测试store')
  }
}

export const namespaced = true;
```
使用时：
```javascript
this.$store.registerModule('myModule', ContextStore);

this.$store.dispatch('myModule/testStores');
```


