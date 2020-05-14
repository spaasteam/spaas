import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import routes from './router'
import store from './store'

Vue.config.productionTip = false


let instance: Vue | null;
let router;

function render() {
  router = new VueRouter({
    mode: 'hash',
    routes
  })
  instance = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}

// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('vue app bootstraped');
}

export async function mount(props: any) {
  console.log('props from main framework', props);
  render();
}

export async function unmount() {
  (instance as Vue).$destroy();
  instance = null;
  // @ts-ignore
  router = null;
}
