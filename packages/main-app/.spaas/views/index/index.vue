<template>
  <div class="index" :style="{'background-image': `url(${$store.state.meta.homePageImg})`}"></div>
</template>

<script>
export default {
  name: 'index',
};
</script>

<style lang="less" scoped>
.index {
  height: calc(100vh - 140px);
  background: #f7f8fb;
  background-size: 100%, auto;
  background-repeat: no-repeat;
}
</style>
