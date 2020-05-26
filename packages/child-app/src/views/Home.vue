<template>
  <div class="home">
    <svg-icon icon-class="logo" class="logo-icon"/>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
}
</script>

<style lang="less" scoped>
  .home {
    padding: 100px 0;
    .logo-icon {
      font-size: 150px;
    }
  }
</style>
