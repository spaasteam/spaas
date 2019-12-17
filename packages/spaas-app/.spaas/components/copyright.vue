<template>
  <div class="copyright">
    Copyright ©
    {{ new Date().getFullYear() + ' ' + $store.state.meta.copyright }}
  </div>
</template>

<script>
export default {
  name: 'CopyRight',
};
</script>
<style scoped>
.copyright {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  text-align: center;
  line-height: 40px;
}
</style>
