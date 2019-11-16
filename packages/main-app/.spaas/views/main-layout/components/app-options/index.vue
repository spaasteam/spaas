<template>
  <div class="app-options" v-if="hasHide">
    <span class="app-options-title">当前应用</span>
    <el-select
      v-model="curAppId"
      placeholder="请选择"
      size="small"
      :disabled="loading || isDisabled"
      v-loading="loading"
    >
      <el-option v-for="app in appList" :key="app.value" :label="app.label" :value="app.value">
      </el-option>
    </el-select>
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
      return curInfo && curInfo.appType !== NONE;
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
  height: 50px;
  padding: 0 20px;
  background-color: #fff;
  display: flex;
  align-items: center;

  &-title {
    margin-right: 6px;
  }
}
</style>
