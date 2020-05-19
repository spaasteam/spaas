<!--
 * @Description: main layout 布局
 * @Author: barret
 * @Date: 2019-08-05 14:24:09
 * @LastEditTime: 2019-08-16 15:29:11
 * @LastEditors: barret
 -->
<template>
  <el-container direction="vertical" id="__vue__">
    <!-- 头部导航 -->
    <LayoutHead />
    <el-container>
      <!-- 侧边栏 -->
      <Sidebar />
      <el-container class="main-container" direction="vertical">
        <!-- 页面 header -->
        <el-main class="nuxt-main">
          <div
            class="nuxt-content medium-height"
          >
            <slot></slot>
            <router-view></router-view>
            <el-footer class="footer-container" height="40px">
              <Copyright></Copyright>
            </el-footer>
          </div>
        </el-main>
      </el-container>
    </el-container>

  </el-container>
</template>

<script>
import Copyright from '../../components/copyright.vue'
import LayoutHead from './components/layout-head/index'

import Sidebar from './components/sidebar.vue'

export default {
  components: {
    Copyright,
    LayoutHead,
    Sidebar,
  },
  props: {
    ifNotProduction: {
      type: Boolean,
      default: process.env.NODE_ENV !== 'production'
    }
  },
  data() {
    const { path, name } = this.$route
    return {
      ifShowCopyModule: process.env.COPY_MODULE,
      showAppOptions: true,
    }
  },
  watch: {
    $route: {
      handler() {
        const { path, name } = this.$route
        this.hasHeader = path !== '/' && name !== 'all'
        this.showAppOptions = true
        this.$nextTick(() => {
          this.hasAppOptions = path !== '/' && this.showAppOptions
        })
      },
      immediate: true
    }
  },
  methods: {
    changeShowStatus(ifShow) {
      this.showAppOptions = ifShow
    }
  }
}
</script>
<style lang="less">
#__vue__ {
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
    line-height: 60px;
    padding-left: 20px;
    transition: margin-left 0.28s;
  }

  // 主体区域 Main container
  .main-container {
    background: @main-bg;
  }

  .nuxt-main {
    position: relative;
    box-sizing: border-box;
    background: @main-bg;
  }

  .nuxt-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin-bottom: 40px;
    padding: 20px 20px 10px;
  }

  .footer-container {
    position: absolute;
    bottom: -40px;
    left: 0;
    right: 0;
  }

  .medium-height {
    min-height: calc(100vh - 100px);
  }
  .small-height {
    min-height: calc(100vh - 150px);
  }
  .min-height {
    min-height: calc(100vh - 190px);
  }

  .default-layout-main {
    background-color: #f0f2f5;
    .default-layout-crumb {
      background-color: rgba(#fff, 0);
      display: flex;
      .el-breadcrumb {
        flex: 1;
        align-items: center;
        display: flex;
      }
      .breadcrumb-quiet {
        font-weight: 400;
        color: #2d303b;
        &:hover {
          color: #2878ff;
        }
      }
      .breadcrumb-active {
        color: #2d303b;
        font-weight: 500;
      }
    }
    .default-layout-content {
      min-height: calc(100vh - 160px);
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0 20px;
    }
  }
}
</style>
