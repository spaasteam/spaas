import "./assets/global.less";
import "./assets/reset.less";

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

// 路由token校验白名单
const whitePathList = [
  '/login',
];

export default routes;

export {
  whitePathList
};