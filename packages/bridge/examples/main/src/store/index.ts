import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'

import registerMicroAppsByMenu from '../auth';
import { IState, IMenuItem } from './types';
import Connect from '../../../../src/index';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    userInfo: null,
    appInfo: null,
    menuInfo: null,
    menuList: []
  },
  mutations: {
    SET_TOKEN(state: IState, token: string) {
      state.token = token;
      Connect.store.set('token', token);
    },
    SET_USER_INFO(state: IState, userInfo) {
      console.warn(userInfo);
      state.userInfo = userInfo
      Connect.store.set('userInfo', userInfo);
    },
    SET_APP_INFO(state: IState, appInfo) {
      state.appInfo = appInfo
      Connect.store.set('appInfo', appInfo);
    },
    SET_MENU_INFO(state: IState, menuInfo) {
      state.menuInfo = menuInfo
      Connect.store.set('menuInfo', menuInfo);
    },
    SET_MENU(state: IState, menuList: IMenuItem[]) {
      state.menuList = menuList;
    }
  },
  actions: {
    registerMicroApp({commit}: ActionContext<IState, IState>, menuList: IMenuItem[]) {
      commit('SET_MENU', menuList);
      registerMicroAppsByMenu(menuList);
    }
  }
})
