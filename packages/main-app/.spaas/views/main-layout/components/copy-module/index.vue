<template>
  <el-popover
    placement="top-start"
    title="下载此模块到本地项目"
    width="400"
    trigger="hover"
    v-if="modulePath"
  >
      <div class="inner-content">
        <pre class="inner-pre">
          <code class="copy-module-code" ref="code">npx spaas add module {{ moduleName }} --path={{ modulePath }}</code>
        </pre>
        <div
          class="copy-code-button"
          @click="handleClipboard($refs.code.innerHTML, $event)"
        >
          <i class="el-icon-copy-document"></i>
        </div>
      </div>
      <div class="copy-module" slot="reference">
        <i class="el-icon-download"></i>
      </div>
    </el-popover>
</template>

<script>
import { Popover } from '@femessage/element-ui';
import clipboard from '@/utils/clipboard';
import PackageJson from '@/../package.json';
import routerJson from '@/const/route-info.json';

export default {
  name: 'dowloadButton',
  components: {
    ElPopover: Popover
  },
  data() {
    const { name } = PackageJson;
    return {
      moduleName: name,
      modulePath: '',
    }
  },
  watch: {
    $route: {
      handler() {
        const {path} = this.$route;
        const { modulePath } = routerJson[path] || {}
        this.modulePath = modulePath;
      },
      immediate: true,
    },
  },
  methods: {
    handleClipboard(text, event) {
      clipboard(text, event);
    },
  },
}
</script>

<style lang="less">
.copy-module {
  position: fixed;
  right: 80px;
  bottom: 40px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 20px;
  background: #fff;
  border-radius: 40px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.copy-module-view {
  position: relative;
  .copy-module-code {
    display: inline-block;
    margin: 0 0.2em;
    padding: 0.2em 0.4em 0.1em;
    font-size: 85%;
    border-radius: 3px;
  }
}

.inner-content {
  display: flex;

  .inner-pre {
    margin-top: 0;
    margin-bottom: 1em;
    overflow: auto;
    white-space: nowrap;
  }

  .copy-module-code {
    display: inline-block;
    margin: 0 0.2em;
    padding: 0.2em 0.4em 0.1em;
    font-size: 85%;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .copy-code-button {
    border: 0;
    background: transparent;
    padding: 0;
    line-height: inherit;
    display: inline-block;
    color: #1890FF;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    transition: color 0.3s;
    margin-left: 8px;
  }
}
</style>
