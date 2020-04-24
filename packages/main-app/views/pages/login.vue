<template>
  <div class="login">
    <div class="main">
      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter.native="login"
      >
        <el-form-item label prop="enterpriseId">
          <dr-input
            v-model.trim="form.enterpriseId"
            size="small"
            label="企业ID"
          ></dr-input>
        </el-form-item>
        <el-form-item label prop="username">
          <dr-input
            v-model.trim="form.username"
            label="账号"
            size="small"
          ></dr-input>
        </el-form-item>
        <el-form-item label prop="password">
          <dr-input
            v-model.trim="form.password"
            label="密码"
            type="password"
            size="small"
            auto-complete="off"
          ></dr-input>
        </el-form-item>
        <el-form-item class="login-button__container">
          <el-button
            :loading="loading"
            class="login-button"
            type="primary"
            size="medium"
            @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <!--<div style="text-align: right">-->
      <!--<nuxt-link to="/register">未有账号，直接注册</nuxt-link>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import DrInput from "~/components/dr-input";

export default {
  layout: "login",
  name: "Login",
  components: {
    DrInput,
  },
  data() {
    return {
      loading: false,
      form: {
        username: "",
        password: "",
        enterpriseId: "",
      },
      rules: {
        enterpriseId: [
          { required: true, message: "请输入企业Id", trigger: "blur" },
        ],
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    login() {
      // 判断是否在请求中
      if (this.loading) return;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;

          this.$store
            .dispatch("LOGIN", this.form)
            .then(() => {
              this.loading = false;
              this.$router.replace("/");
            })
            .catch((e) => {
              // TODO 异常处理
              this.loading = false;
              console.error(e);
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less">
.login {
  &-form {
    .el-form-item__error {
      width: 100%;
      font-size: 12px;
      color: #9ca6c7;
      text-align: right;
      font-weight: 400;
      line-height: 18px;
    }
  }

  &-button__container {
    margin-top: 40px;

    .login-button {
      width: 100%;
    }
  }
}
</style>
