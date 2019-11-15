<!--
 * @Description: 右侧边栏
 * @Author: barret
 * @Date: 2019-08-05 14:24:09
 * @LastEditTime: 2019-08-12 14:05:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="drawer-container">
    <el-menu @select="selectItem" class="aside-menu">
      <scrollbar wrap-class="scrollbar-wrapper" :noresize="false">
        <menu-list :menuList="menuList"></menu-list>
      </scrollbar>
    </el-menu>
  </div>
</template>

<script>
import MenuList from '@/components/menu-list';
import {transformOutsideLink} from '@/utils/utils';
import Scrollbar from '@/components/scrollbar/index.js';

export default {
  components: {
    MenuList,
    Scrollbar,
  },
  data() {
    return {
      menuList: [
        {
          id: '1',
          name: 'data-table文档',
          url:
            'https://serverless.deepexi.top/serverless-console/index.html#/material/el-data-table?file=README.md',
        },
        {
          id: '2',
          name: '组件',
          children: [
            {
              id: '2-1',
              name: 'form-renderer文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/el-form-renderer?file=README.md',
            },
            {
              id: '2-2',
              name: '文件上传(upload-to-ali)文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/upload-to-ali?file=README.md',
            },
            {
              id: '2-3',
              name: '图片预览(img-preview)文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/img-preview?file=README.md',
            },
            {
              id: '2-4',
              name: '富文本(v-editor)文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/v-editor?file=README.md',
            },
            {
              id: '2-5',
              name: '列表组件(data-list)文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/data-list?file=README.md',
            },
            {
              id: '2-6',
              name: '版本号(el-semver-input)文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/el-semver-input?file=README.md',
            },
            {
              id: '2-7',
              name: '范围输入框(el-number-range)文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/el-number-range?file=README.md',
            },
            {
              id: '2-8',
              name: '省市区选择(el-select-area)文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/el-select-area?file=README.md',
            },
            {
              id: '2-9',
              name: '树形组件(el-data-tree)文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/el-data-tree?file=README.md',
            },
            {
              id: '2-10',
              name: '导入导出excel插件文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/excel-it?file=README.md',
            },
            {
              id: '2-11',
              name: '倒计时文档',
              url:
                'https://serverless.deepexi.top/serverless-console/index.html#/material/excel-it?file=README.md',
            },
          ],
        },
        {
          id: '3',
          name: '图标',
          url: '#/icons',
        },
        {
          id: '4',
          name: '每日一题',
          url: 'https://github.com/spaasteam/spaas-daily-practice/issues',
        },
      ],
    };
  },
  methods: {
    selectItem(index) {
      // console.log(transformOutsideLink(index));
      if (index) window.open(transformOutsideLink(index));
    },
  },
};
</script>

<style lang="less" scoped>
.drawer-container {
  height: 100vh;
  padding: 20px 0 20px 10px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }

  .aside-menu,
  .scrollbar {
    height: 100%;
  }
  .scrollbar-wrapper {
    height: calc(100vh - 40px);
    overflow-x: hidden !important;
    margin-bottom: 0 !important;

    .el-scrollbar__view {
      height: 100%;
    }
  }
}
</style>
