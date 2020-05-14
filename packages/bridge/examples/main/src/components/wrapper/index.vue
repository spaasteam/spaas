<template>
  <div>
    <div class="mainapp">
      <!-- 标题栏 -->
      <header class="mainapp-header">
        <h1>QianKun</h1>
      </header>
      <div class="mainapp-main">
        <!-- 侧边栏 -->
        <div class="mainapp-sidemenu">
          <el-button @click="setUserInfo">设置用户信息</el-button>
          <p class="develop-progress">开发进度为：</p>
          <el-input-number v-model="num" @change="handleChange" :min="0" :max="100" label="开发进度为："></el-input-number>
        </div>
        <main>
          <slot></slot>
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { store, event } from '../../../../../src/index';

@Component({
  name: "Wrapper"
})
export default class Wrapper extends Vue {
  menuList = this.$store.state.menuList;
  num = 50

  mounted() {
    const menuList = [
      {
        name: "nuxt",
        pathUrl: "http://localhost:3000#/nuxt"
      },
      {
        name: "vue",
        pathUrl: "http://localhost:7101#/vue"
      }
    ];
    this.$store.dispatch("registerMicroApp", menuList);
    store.set('user', [{name: '999'}]);
    console.error(store.hasStore('user'))
  }

  push(subapp: string) {
    history.pushState(null, subapp, subapp);
  }

  handleChange = (val) => {
    event.emit('setProgress', val);
  }

  setUserInfo = () => {
    const userInfo = {
      tenantId: "", // 租户隔离标识
      appId: "", // 应用id
      username: "", // 帐号名
      email: "", // 邮箱
      phone: "", // 手机号
      nickname: "", // 姓名
      avatar: "", // 头像
      gender: "" // 性别（0：男，1：女）
    };
    this.$store.commit("SET_USER_INFO", userInfo);
  };
}
</script>

<style lang="less" scoped>
// 主应用慎用 reset 样式
body {
  margin: 0;
}

.mainapp {
  // 防止被子应用的样式覆盖
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  line-height: 1;
}

.mainapp-header {
  > h1 {
    color: #333;
    font-size: 36px;
    font-weight: 700;
    margin: 0;
    padding: 36px;
  }
}

.mainapp-main {
  display: flex;

  .mainapp-sidemenu {
    width: 230px;
    list-style: none;
    margin: 0;
    margin-left: 40px;
    padding: 0;
    border-right: 2px solid #aaa;

    .develop-progress {
      color: #606266;
      font-weight: 500;
      padding: 22px 20px;
      font-size: 16px;
    }
  }
}
</style>
