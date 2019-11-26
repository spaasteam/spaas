<!--
 * @Description: 左侧边栏
 * @Author: barret
 * @Date: 2019-07-27 17:51:31
 * @LastEditTime: 2019-08-16 18:00:13
 * @LastEditors: barret
 -->
<template>
  <div :class="{hideSidebar: setting.collapse}" class="sidebar-container">
    <el-menu
      v-loading="!permission.menuReady"
      :collapse="setting.collapse"
      :default-active="$route.path"
      :collapse-transition="false"
      router
      class="aside-menu"
      :active-text-color="variables.menuActiveText"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
    >
      <div class="system-name">
        <img :src="appIcon || require('@/static/default_icon.svg')" />
        <span>{{ appName }}</span>
      </div>
      <scrollbar wrap-class="scrollbar-wrapper" :noresize="false">
        <menu-list :menuList="permission.menuList"></menu-list>
      </scrollbar>

      <div class="fix-btn-wrap">
        <div class="collapse-btn" @click="toggleCollapse">
          <svg-icon icon-class="expand" class="btn-icon"></svg-icon>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import MenuList from '@/components/menu-list';
import variables from '@/styles/export.less';
import Scrollbar from '@/components/scrollbar/index.js';

export default {
  name: 'Sidebar',
  data() {
    return {
      variables,
    };
  },
  components: {
    MenuList,
    Scrollbar,
  },
  computed: {
    ...mapState(['permission', 'setting']),
    appName() {
      return this.permission.spaName;
    },
    appIcon() {
      return this.permission.spaIcon;
    }
  },
  methods: {
    toggleCollapse() {
      this.$store.commit('update', {
        setting: {
          collapse: !this.setting.collapse,
        },
      });
    },
  },
};
</script>

<style lang="less">
@title-bg: rgba(242, 244, 249, 1);
@menu-height: 50px;

.sidebar-container {
  transition: width 0.28s;
  width: @sideBarMaxWidth !important;
  overflow: hidden;
  z-index: 100;
  box-shadow: 1px 0 6px rgba(0, 21, 41, 0.35);

  //reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    height: calc(100vh - 60px - 100px);
    overflow-x: hidden !important;
    margin-bottom: 0 !important;

    .el-scrollbar__view {
      height: 100%;
    }
  }

  .el-scrollbar__bar.is-vertical {
    right: 0;
  }

  .is-horizontal {
    display: none;
  }

  .system-name {
    user-select: none;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 500;
    background-color: #fff;
    padding-left: 18px;
    color: @--color-text-primary;
    position: relative;
    display: flex;
    align-items: center;
    >img {
      width: 23px;
      height: 23px;
    }
    >span {
      min-width: 154px;
      margin-left: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }

  .fix-btn-wrap {
    height: 50px;

    .collapse-btn {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 50px;
      width: 100%;
      padding: 0 15px;
      cursor: pointer;
    }

    .btn-icon {
      transform: rotate(180deg);
      font-size: 16px;
    }
  }

  // 折叠
  &.hideSidebar {
    width: @sideBarMinWidth !important;

    .system-name {
      padding-left: 0;
      justify-content: center;
      > span {
        display: none;
        width: 0;
        opacity: 0;
        transition: opacity 0.28s ease-in-out !important;
      }
    }

    .scrollbar-wrapper {
      height: calc(100vh - 60px - 50px - 50px);
    }

    .fix-btn-wrap {
      .btn-icon {
        transform: rotate(0deg);
        margin: 0 8px;
      }
    }
  }

  // when menu collapsed
  .menu--vertical {
    // the scroll bar appears when the subMenu is too long
    > .menu--popup {
      max-height: 100vh;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 20px;
      }
    }
  }
}
</style>
