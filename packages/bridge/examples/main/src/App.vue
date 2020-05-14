<template>
  <div>
    <wrapper v-if="showWrapper">
      <div v-if="loading">loading</div>
      <div class="app-container" v-if="content">
        <div v-html="content"></div>
      </div>
    </wrapper>
    <router-view v-else-if="!showWrapper" />
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import { Route } from 'vue-router';

import Wrapper from './components/wrapper/index.vue';
import RouterList from './router/index';
import Bridge from '../../../src/index';

@Component({
  name: 'App',
  components: {
    Wrapper
  },
})
export default class App extends Vue {
  @Prop({ default: () => []}) routerList?: string[]
  @Prop({ default: true }) loading?: boolean
  @Prop({ default: '' }) content?: string

  showWrapper = true

  @Watch('$route')
  onRouteChange(to: Route) {
  // TODO
    // 比较当前一级路由是否在主应用
    // 1. 当前路由在主应用
    // 1.1 不显示wrapper
    // 2. 当前路由在子应用
    // 2.1 显示wrapper
    // 3. 找不到该路由
    // 3.1 显示404页面
    this.checkIfShowWrapper(to);
  }

  created() {
    this.checkIfShowWrapper();
    Bridge.store.set('token', '999999');
    Bridge.event.on('alert666', (val) => {
      alert(`好嘞，子应用小老弟，收到你的请求。一起来喊${val}`)
    })
  }

  checkIfShowWrapper(route?: Route) {
    const path = route && route.path || this.$route.path;
    // 可以在这里判断显示wrapper
    // let showWrapper = true;
    const showWrapper = true;

    const list = (RouterList as any).options.routes;
    for(const item of list) {
      if(path === item.path || path.startsWith(`${item.path}/`)) {
        // showWrapper = false;
        break;
      }
    }
    this.showWrapper = showWrapper;
  }
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
