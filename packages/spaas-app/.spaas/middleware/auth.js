/*
 * @Author: Han
 * @Date: 2019-05-08 14:32:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-08-09 23:56:08
 * @Description 路由鉴权中间件，实现其他路由守卫功能请新建一个中间件
 *
 * **********************************************************
 * * @Strong 这是一个路由中间件，请不要在 serverMiddleware 中使用 *
 * **********************************************************
 */
import Vue from 'vue';
import {cookie} from 'dx-admin-components';
import cookieKeys from '@/const/cookie-keys';

const LOGIN_PATH = '/login';
const INDEX_PATH = '/';
const ICONS_PATH = '/icons';

// 路由白名单，直接绕过路由守卫
const whiteList = [LOGIN_PATH, '/icons'];

export default async ({store, redirect, env, route}) => {
  if (process.server) return;

  const {NO_LOGIN, BUILD_TYPE, BUILD_TYPE_PRIVATE} = env;
  const {path} = route;
  const cookieInfo = {};

  if ((!!BUILD_TYPE && BUILD_TYPE) !== BUILD_TYPE_PRIVATE) {
    cookieKeys.forEach(key => {
      cookieInfo[key] = cookie.get(key);
    });

    const {token} = cookieInfo;

    // 开发时可以用 NO_LOGIN 跳过路由鉴权
    if (NO_LOGIN > 0) return;

    // 鉴权白名单
    if (whiteList.indexOf(path) > -1) return;

    // 只允许开发中打开icons页面
    if (process.env.MODE === 'prod' && path === ICONS_PATH) {
      redirect(INDEX_PATH);
      return;
    }

    // 未登录
    if (!token) {
      redirect(LOGIN_PATH);
      return;
    }

    // 已登录但是state因刷新丢失
    if (store.state.userId === '') {
      store.commit('update', cookieInfo);
      try {
        await store.dispatch('getUserInfo');
        const ifHasPromise = await store.dispatch('fetchAppId');
        if (!ifHasPromise) {
          Vue.$notify.error({
            title: '暂无权限',
            message: '请联系管理员开通权限',
            duration: 3000,
            onClose: () => {
              store.commit('logout');
            },
          });
          return;
        }
      } catch (e) {
        console.error('auth error: ', e);
      }
    }
  } else {
    //私有化改造
    if (!cookie.get('token')) {
      redirect(LOGIN_PATH);
    }
    store.dispatch('fetchAppId');
  }
};
