import Vue from "vue";

import App from "./App.vue";
import store from "./store";
import router from "./router";

interface IApp extends Vue {
  content?: string;
  loading?: boolean;
}

let app: IApp;

function render({ appContent, loading }) {
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
            content: (this as any).content,
            loading: (this as any).loading,
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
