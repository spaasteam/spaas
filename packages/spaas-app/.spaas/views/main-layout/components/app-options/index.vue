<template>
  <div class="app-options" v-if="hasHide">
    <span class="app-options-title">当前应用：</span>
    <div class="select-container">
      {{ labelText }}
      <div class="select-icon">
        <svg-icon icon-class="down-triangle" />
      </div>
      <el-select
        v-model="curAppId"
        size="small"
        :disabled="loading || isDisabled"
        v-loading="loading"
        class="select"
      >
        <el-option v-for="app in appList" :key="app.value" :label="app.label" :value="app.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import routeInfo from '@/const/route-info';

const NONE = '2';
const DISABLED = '3';

export default {
  name: 'app-options',
  data() {
    return {
      loading: false,
      labelText: '请选择',
    };
  },
  computed: {
    centerId() {
      return this.$store.state.permission.centerId;
    },
    appList() {
      return this.$store.state.app.appList;
    },
    curAppId: {
      get() {
        const appId = this.$store.state.app.appId;
        const [currentApp] = this.appList.filter(({value}) => value === appId);
        this.labelText = currentApp ? currentApp.label : '请选择';
        return appId && Number(appId);
      },
      set(value) {
        this.$store.commit('app/setAppId', value);
        const [currentApp] = this.appList.filter(({value: val}) => val === value);
        this.$store.commit('app/setApp', currentApp);
      },
    },
    path() {
      return this.$route.path;
    },
    matchedPath() {
      const matched = this.$route.matched;
      const len = matched.length;
      return len ? (matched[len - 1] || {}).path : '';
    },
    isDisabled() {
      const curInfo = routeInfo[this.matchedPath];
      return curInfo && curInfo.appType === DISABLED;
    },
    hasHide() {
      const curInfo = routeInfo[this.matchedPath];
      const ifShow = curInfo && curInfo.appType !== NONE;
      this.$emit('changeShowStatus', ifShow);
      return ifShow;
    },
  },
  watch: {
    centerId(value) {
      value && this.getList();
    },
    // 设置query
    curAppId(value) {
      if (value && this.hasHide) {
        this.setQuery(value);
      }
    },
    path(newVal, oldVal) {
      if (newVal !== oldVal && this.hasHide) {
        this.curAppId && this.setQuery(this.curAppId);
      }
    },
  },
  created() {
    if (this.hasHide) {
      this.centerId && this.getList();
    }
  },
  methods: {
    getList() {
      this.loading = true;
      this.$store.dispatch('app/getAppList').finally(() => {
        this.loading = false;
      });
    },
    // 设置query值
    setQuery(id) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          appId: id,
        },
      });
    },
  },
};
</script>

<style lang="less">
.app-options {
  height: 40px;
  padding: 0 20px;
  display: flex;
  align-items: center;

  &-title {
    margin-right: 6px;
  }
}

.select-container {
  position: relative;
  display: inline-block;
  padding-right: 20px;
  min-width: 100px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 32px;
  line-height: 32px;

  .select-icon {
    position: absolute;
    top: 0;
    right: 0;
  }

  .select {
    min-width: 200px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
  }
}
</style>
