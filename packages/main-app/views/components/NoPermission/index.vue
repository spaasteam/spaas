<template>
  <div class="no-permission-component">
    <img :src="noLimit" alt="您暂时没有查看的权限" class="img-block" />
    <p class="sorry-info">抱歉，您暂时没有查看的权限</p>
    <el-button type="primary" @click="goBackToIndex">返回首页</el-button>
  </div>
</template>

<script>
import noLimit from './images/noLimit.png';

export default {
  props: {
    goIndex: Function,
  },
  data() {
    return {
      noLimit,
    };
  },
  methods: {
    goBackToIndex() {
      if (this.goIndex) {
        this.goIndex();
      } else {
        this.$router.replace('/');
      }
    },
  },
};
</script>
<style lang="less">
.no-permission-component {
  padding-top: 100px;
  text-align: center;

  .img-block {
    width: 120px;
    height: 120px;
    display: inline-block;
  }

  .sorry-info {
    height: 70px;
    line-height: 70px;
    color: #2d303b;
    font-size: 16px;
  }
}
</style>
