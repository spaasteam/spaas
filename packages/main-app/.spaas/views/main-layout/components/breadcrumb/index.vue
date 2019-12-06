<template>
  <el-breadcrumb class="v-breadcrumb" :separator="separator" v-if="$bcm_list.length">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        class="v-breadcrumb-item"
        v-for="(item, index) in $bcm_list"
        :key="item.title + index"
      >
        <span
          class="link"
          v-if="item.enable && index != $bcm_list.length - 1"
          :to="{path: item.fullPath || item.path || item.redirectPath}"
          @click="handle2Path(item)"
        >
          <Render v-if="item.render" :render="item.render" />
          <span v-else>{{ item.title }}</span>
        </span>

        <template v-else>
          <Render v-if="item.render" :render="item.render" :data="item" />
          <span v-else class="link disabled" :key="index">{{ item.title }}</span>
        </template>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script>
import {Breadcrumb, BreadcrumbItem} from '@femessage/element-ui';
import Render from './render';

export default {
  name: 'VBreadcrumb',
  inject: ['$bcm_list'],
  props: {
    separator: {
      type: String,
      default: '/',
    },
  },
  components: {
    elBreadcrumb: Breadcrumb,
    elBreadcrumbItem: BreadcrumbItem,
    Render,
  },
  methods: {
    handle2Path(data) {
      const {fullPath, path, redirectPath} = data;

      this.$router.push({
        path: fullPath || path || redirectPath,
        query: {
          ...this.$route.query,
        },
      });
    },
  },
};
</script>

<style lang="less">
.v-breadcrumb {
  line-height: 50px;
  height: 50px;
  overflow: hidden;
  padding: 0 20px;
  box-sizing: border-box;

  .breadcrumb-enter-active,
  .breadcrumb-leave-active {
    transition: all 0.5s;
  }

  .breadcrumb-enter,
  .breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
  }

  .breadcrumb-move {
    transition: all 0.5s;
  }

  .breadcrumb-leave-active {
    position: absolute;
  }

  .v-breadcrumb-item {
    .link {
      cursor: pointer;
      color: #2d303b;
      font-size: 14px;
      font-weight: normal;

      &.disabled {
        cursor: not-allowed;
      }
    }

    &:last-child {
      .link {
        color: #2d303b;
        font-weight: bold;
      }
    }

    &:first-child {
      .link {
        color: #2d303b;
      }
    }
  }
}
</style>
