import Vue from 'vue'
import Element from 'element-ui';

import App from './App.vue'
import store from './store'
import router from './router'

Vue.use(Element);

interface IRender {
  appContent: string;
  loading: boolean;
}

interface IApp extends Vue {
  content?: string
  loading?: boolean
}

let app: IApp;

function render({ appContent, loading }: IRender) {
  /*
  examples for vue
   */
  if (!app) {
    app = new Vue({
      router,
      store,
      data() {
        return {
          content: appContent,
          loading,
        };
      },
      render(h) {
        return h(App, {
          props: {
            content: (this as IApp).content,
            loading: (this as IApp).loading,
          },
        });
      },
    }).$mount("#app");
  } else {
    app.content = appContent;
    app.loading = loading;
  }
}

export default render;
