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

<script>
import Wrapper from '../views/wrapper';
import RouterList from '../views/router';

export default {
  routerList: [],
  components: {
    Wrapper
  },
  props: {
    loading: Boolean,
    content: String,
  },
  data() {
    return {
      showWrapper: true,
    }
  },
  watch: {
    $route(to, from) {
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
  },
  created() {
    this.checkIfShowWrapper();
  },
  methods: {
    checkIfShowWrapper(route) {
      const path = route && route.path || this.$route.path;
      console.error(path);

      let showWrapper = true;
      for(const item of RouterList) {
        if(path === item.path || path.startsWith(`${item.path}/`)) {
          showWrapper = false;
          break;
        }
      }
      this.showWrapper = showWrapper;
    }
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
