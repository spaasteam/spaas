import Vue from "vue";

import App from "./App.vue";
import store from "./store";
import router from "./router";

let app = null;

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
            content: this.content,
            loading: this.loading,
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
