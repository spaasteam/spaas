<template>
  <div class="menu-list">
    <menu-item v-for="m in menuList" :data="m" :key="m.id"></menu-item>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import MenuItem from './menu-item.vue'

@Component({
  name: 'MenuList',
  components: {
    MenuItem
  }
})
export default class MenuList extends Vue {
  @Prop({ default: () => [] }) private menuList!: any[];
}
</script>

<style lang="less">
.menu-list {
  user-select: none;
}
</style>
