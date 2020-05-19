import Vue from 'vue'
import VueRouter from 'vue-router'
import RouterList, {whitePathList} from '../../views/router';
import store from '../store/index';

Vue.use(VueRouter)

const routes = RouterList

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  const {path} = to

  // 鉴权白名单
  if (whitePathList.indexOf(path) > -1) {
    next();
    return;
  };

  if (!store.state.token) {
    next('/login')
    return
  }

  // 如有没有用户信息，则先重新获取
  if (store.state.token && !store.state.userInfo) {
    try {
      await store.dispatch('GET_USER_INFO')
      await store.dispatch('GET_USER_PERMISSION')
      next();
    } catch (e) {
      console.error(e)
    }
  } else {
    next();
  }
})

export default router
