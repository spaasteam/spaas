<!--
 * @Description: main layout 布局
 * @Author: barret
 * @Date: 2019-08-05 14:24:09
 * @LastEditTime: 2019-08-16 15:29:11
 * @LastEditors: barret
 -->
<template>
  <el-container direction="vertical">
    <!-- 头部导航 -->
    <layout-head />
    <el-container>
      <!-- 侧边栏 -->
      <sidebar />
      <el-container class="main-container" direction="vertical">
        <!-- 页面 header -->
        <v-breadcrumb v-if="hasHeader" class="nuxt-header main-breadcurmb"></v-breadcrumb>
        <app-options v-if="hasAppOptions"></app-options>
        <el-main class="nuxt-main">
          <div
            :class="{
              'nuxt-content': true,
              'medium-height': !hasHeader && !hasAppOptions,
              'small-height': hasHeader && !hasAppOptions,
              'min-height': hasHeader && hasAppOptions,
            }"
          >
            <nuxt></nuxt>
            <el-footer class="footer-container" height="50px">
              <copyright></copyright>
            </el-footer>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <right-panel v-if="ifNotProduction">
      <settings />
    </right-panel>
  </el-container>
</template>

<script>
import {mapState} from 'vuex';
import Copyright from '@/components/copyright.vue';
import LayoutHead from '@/components/layout-head.vue';
import RightPanel from '@/components/RightPanel';

import VBreadcrumb from './components/breadcrumb';
import AppOptions from './components/app-options';
import Settings from './components/settings';
import Sidebar from './components/sidebar.vue';

import breadCrumbMixin from '@/mixins/breadcrubMixin';

export default {
  components: {
    Copyright,
    LayoutHead,
    Sidebar,
    VBreadcrumb,
    AppOptions,
    Settings,
    RightPanel,
  },
  mixins: [breadCrumbMixin],
  props: {
    ifNotProduction: {
      type: Boolean,
      default: process.env.NODE_ENV !== 'production',
    },
  },
  computed: {
    ...mapState(['permission', 'setting']),
    appName() {
      return this.permission.spaName;
    },
    hasHeader() {
      const {path, name} = this.$route;
      return path !== '/' && name !== 'all';
    },
    hasAppOptions() {
      const {path} = this.$route;
      return path !== '/';
    },
  },
};
</script>
<style lang="less" scoped>
#__nuxt {
  // 最小宽度，防止屏幕缩小顶部栏会变形
  min-width: 900px;
  @title-bg: rgba(242, 244, 249, 1);
  @menu-height: 50px;
  @primary-color: #1890ff;
  @main-bg: #f7f8fb;

  .el-header,
  .el-main {
    padding: 0;
  }
  .el-footer {
    background: @main-bg;
  }

  .nuxt-header {
    background: #fff;
    line-height: 50px;
    padding-left: 20px;
    transition: margin-left 0.28s;
  }

  // 主体区域 Main container
  .main-container {
    background: @main-bg;
    .nuxt-main {
      position: relative;
      box-sizing: border-box;
      background: @main-bg;

      .nuxt-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin-bottom: 50px;
        padding: 20px 20px 10px;
      }
    }
  }

  .footer-container {
    position: absolute;
    bottom: -50px;
    left: 0;
    right: 0;
  }

  .medium-height {
    min-height: calc(100vh - 140px);
  }
  .small-height {
    min-height: calc(100vh - 160px);
  }
  .min-height {
    min-height: calc(100vh - 210px);
  }
}
</style>
