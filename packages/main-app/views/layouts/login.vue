<template>
  <div class="login-layout">
    <div class="login-layout__content">
      <div class="login-layout__card">
        <div class="login-layout__card--banner">
          <img src="../assets/img/login-banner.png" />
        </div>
        <div class="login-layout__card--form">
          <h2 class="login-layout__card--title">你好，请先登录</h2>
          <router-view></router-view>
          <div class="login-layout__card--form__footer">
            - DEEPEXI DR -
          </div>
        </div>
      </div>
    </div>
    <div class="layout-login__footer">
      <copyright></copyright>
    </div>
  </div>
</template>

<script>
import Copyright from "../components/copyright.vue";

export default {
  name: "Login",
  components: {
    Copyright,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.login-layout {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #f1f7fc;
  overflow: hidden;

  &__content {
    height: calc(100vh - 60px);
    position: relative;
  }

  &__card {
    width: 760px;
    height: 470px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.05);
    z-index: 999;

    &--banner {
      width: 380px;
      height: 470px;
      background:
        linear-gradient(
          360deg,
          rgba(40, 120, 255, 1) 0%,
          rgba(27, 108, 245, 1) 100%
        );
      float: left;
      box-sizing: border-box;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &--form {
      width: 380px;
      height: 470px;
      float: right;
      box-sizing: border-box;
      padding: 45px;

      &__footer {
        font-size: 12px;
        color: #818389;
        text-align: center;
      }
    }

    &--title {
      font-size: 22px;
      color: #2878ff;
      line-height: 56px;
    }
  }

  &__footer {
    width: 100%;
    background: #f1f7fc;
  }
}
</style>
