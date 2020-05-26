import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './router'
import store from './store'
import Bridge from '@spaas/bridge';

// style
import './styles/global.less';
import './styles/reset.less';

// plugins
import './plugins/element'
import './plugins/axios'
import './plugins/icon-font'

Vue.config.productionTip = false

let router: VueRouter | null
let instance: Vue | null

interface IPropsType {
  container?: any;
}

function render (props: IPropsType = {}) {
  const { container } = props
  router = new VueRouter({
    mode: 'hash',
    routes
  })

  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap () {
  console.log('[vue] vue app bootstraped')
}


export async function mount (props) {
  console.log('[vue] props from main framework', props)
  render(props)
}

export function mounted(instance, props) {
  const userInfo = Bridge.store.get('userInfo')
  instance.$store.commit('SET_USER_INFO', userInfo)
  // customStore.set('subAppRoute', instance.$route)
  // console.log('✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨mounted', instance)
}

export async function unmount () {
  (instance as Vue).$destroy()
  instance = null
  router = null
}
