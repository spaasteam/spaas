<template>
  <div class="page-404">
    <not-exist />
  </div>
</template>

<script>
import NotExist from '../components/NotExist/index';

export default {
  components: {
    NotExist,
  },
};
</script>

<style lang="less" scoped>
.page-404 {
  display: flex;
  height: calc(100vh - 140px);
  justify-content: center;
  padding-top: 120px;
}
</style>
