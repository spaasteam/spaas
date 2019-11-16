<template>
  <div class="menu-list">
    <menu-item v-for="m in menuList" :data="m" :key="m.id"></menu-item>
  </div>
</template>

<script>
import MenuItem from './src/menu-item';

export default {
  name: 'MenuList',
  components: {
    MenuItem,
  },
  props: {
    menuList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
<style lang="less">
.menu-list {
  user-select: none;
}
</style>
