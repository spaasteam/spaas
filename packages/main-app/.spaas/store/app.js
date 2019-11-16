import {appOptions} from '@/services/v1/spaas-application-center';

export const state = () => ({
  appId: '',
  appList: [],
  appData: {},
});

export const mutations = {
  setAppId(state, payload) {
    state.appId = payload;
  },
  setAppList(state, payload) {
    state.appList = payload;
  },
  setApp(state, payload) {
    state.appData = payload;
  },
};

export const actions = {
  async getAppList({state, commit, rootState}) {
    const {centerId} = rootState.permission;

    // 获取url的appId值
    let {appId} = this.$router.currentRoute.query;
    appId = appId && Number(appId);

    try {
      const resp = await appOptions(centerId);
      if (resp.payload) {
        const options = resp.payload.content.map(el => {
          return {
            label: el.name,
            value: el.id,
          };
        });
        // 获取appId直接赋值
        const curAppId = appId || (options[0] && options[0].value);

        // 设置当前 app
        if (curAppId) {
          const [currentApp] = options.filter(({value}) => value === curAppId);
          commit('setApp', currentApp);
        }

        commit('setAppList', options);
        commit('setAppId', curAppId);
        return {
          appList: state.appList,
          appId: curAppId,
        };
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
