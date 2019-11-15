<template>
  <div class="no-permission">
    <no-permission />
  </div>
</template>

<script>
import NoPermission from '../components/NoPermission/index';

export default {
  components: {
    NoPermission,
  },
};
</script>

<style lang="less" scoped>
.no-permission {
  display: flex;
  height: calc(100vh - 140px);
  justify-content: center;
  padding-top: 120px;
}
</style>
