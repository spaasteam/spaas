/*
 * @Description: vuex store
 * @Author: barret
 * @Date: 2019-08-13 17:18:05
 * @LastEditTime: 2020-03-09 16:32:30
 * @LastEditors: Please set LastEditors
 */
import cookie from 'js-cookie';
import cookieKeys from '@/const/cookie-keys';

import {loginByUsername, getMenu, getUserDetail} from '@/services/v1/deepexi-cloud';
import {getProductList} from '@/services/v1/asset-service';
import {productList, menuList} from '@/const/config';

import meta from '@/const/meta.js';
import ENV from '@/envconfig/config';

const cookiePath = ENV.COOKIE_PATH;
const cookieDomain = ENV.COOKIE_DOMAIN;
const isPrivate = ENV.BUILD_TYPE == ENV.BUILD_TYPE_PRIVATE;

const isObject = value => Object.prototype.toString.call(value) === '[object Object]';

export const state = () => ({
  userId: isPrivate && ENV.USERID ? ENV.USERID : '',
  token: '',
  tenantId: isPrivate && ENV.TENANTID ? ENV.TENANTID : '',
  username: '',
  user: {},

  meta: {},

  permission: {
    menuList: isPrivate && menuList ? menuList.payload : [],
    menuReady: isPrivate ? true : false,
    spaName: meta.spaName,
    spaIcon: '',
    centerId: '',
    productList: isPrivate && productList ? productList.payload : [],
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
    let res;
    if (isPrivate) {
      res = productList || {};
    } else {
      res = await getProductList({
        status: 1,
      });
    }
    const productList = res.payload || [];
    const [product] = productList.filter(item => item.productName === meta.spaName);
    if (!product) return;
    const {id: centerId, icon} = product;
    !isPrivate &&
      dispatch('fetchMenu', centerId, {
        root: true,
      });

    commit('update', {
      permission: {
        centerId,
        spaIcon: icon,
        productList,
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
