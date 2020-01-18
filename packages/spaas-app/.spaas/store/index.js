/*
 * @Description: vuex store
 * @Author: barret
 * @Date: 2019-08-13 17:18:05
 * @LastEditTime: 2019-08-13 17:19:11
 * @LastEditors: barret
 */
import cookie from 'js-cookie';
import cookieKeys from '@/const/cookie-keys';

import {loginByUsername, getProductList, getMenu, getUserDetail} from '@/services/v1/deepexi-cloud';

import meta from '@/const/meta.js';

const cookiePath = process.env.COOKIE_PATH;
const cookieDomain = process.env.COOKIE_DOMAIN;

const isObject = value => Object.prototype.toString.call(value) === '[object Object]';

export const state = () => ({
  userId: '',
  token: '',
  tenantId: '',
  username: '',
  user: {},

  meta: {},

  permission: {
    menuList: [],
    menuReady: false,
    spaName: meta.spaName,
    spaIcon: '',
    centerId: '',
  },

  setting: {
    collapse: false, // 是否收缩侧边栏
  },
});

export const mutations = {
  login(state, payload) {
    cookieKeys.forEach(key => {
      state[key] = payload[key];
      cookie.set(key, payload[key], {
        path: cookiePath,
        domain: cookieDomain,
      });
    });
  },
  logout(state) {
    cookieKeys.forEach(key => {
      state[key] = '';
      cookie.remove(key, {
        path: cookiePath,
        domain: cookieDomain,
      });
    });
    // 清空state，跳转到login页的逻辑交给路由守卫
    window.location.reload();
  },
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      if (isObject(payload[k])) {
        state[k] = Object.assign(state[k], payload[k]);
      } else {
        state[k] = payload[k];
      }
    });
  },
};

export const actions = {
  // 用户名账号登录
  async loginByUsername({commit}, userInfo) {
    try {
      const {payload} = await loginByUsername(userInfo);

      commit('login', {...payload, ...payload.params});

      commit('update', {
        user: payload,
      });

      return payload;
    } catch (err) {
      return Promise.reject(err);
    }
  },
  // 根据token获取用户信息
  async getUserInfo({commit, state}) {
    try {
      const {payload} = await getUserDetail(state.token);
      commit('update', {
        user: payload,
        userId: payload.params.userId,
        username: payload.username,
        tenantId: payload.tenantId,
      });

      return payload.tenantId;
    } catch (error) {
      console.log(error);
    }
  },
  // 请求中心Id
  async fetchAppId({dispatch, commit}) {
    const {payload} = await getProductList({
      status: 3,
      productName: meta.spaName,
    });
    const productList = payload.content;
    const [product] = productList.filter(item => item.productName === meta.spaName);
    if (!product) return;
    const {productId: centerId, icon} = product;
    dispatch('fetchMenu', centerId, {root: true});

    commit('update', {
      permission: {
        centerId,
        spaIcon: icon,
      },
    });
    return product;
  },
  // 请求菜单
  async fetchMenu({commit}, appId) {
    try {
      const params = {
        appId,
        code: meta.menuCode,
        tenantId: state.tenantId,
      };
      const {payload} = await getMenu(params);
      commit('update', {
        permission: {
          menuList: payload,
        },
      });
    } catch (error) {
      return error;
    } finally {
      commit('update', {permission: {menuReady: true}});
    }
  },
};
