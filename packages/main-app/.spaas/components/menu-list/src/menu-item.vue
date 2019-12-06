<script>
import {Submenu, MenuItem} from '@femessage/element-ui';

export default {
  name: 'MenuItem',
  components: {
    'el-submenu': Submenu,
    'el-menu-item': MenuItem,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isRoot() {
      return this.data && this.data.children && this.data.children.length;
    },
    isUrl() {
      const urlString = this.data.iconUrl;
      const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      return urlString && reg.test(urlString);
    },
  },
  render(h) {
    return this.isRoot ? this.renderSubmenu(h) : this.renderMenuItem(h);
  },
  methods: {
    // 渲染有子菜单的主菜单
    renderSubmenu(h) {
      // 递归获取子菜单
      const childrens = this.data.children.map(c => {
        return h('menu-item', {
          props: {
            data: c,
          },
        });
      });

      const Content = h(
        'div',
        {
          class: 'menu-item-container',
          slot: 'title',
        },
        [this.renderIcon(h), this.renderTitleSlot(h)],
      );

      return h(
        'el-submenu',
        {
          props: {
            index: `${this.data.id}`,
            'popper-class': 'popover-menu'
          },
        },
        [Content, childrens],
      );
    },
    // 渲染有无子菜单的主菜单
    renderMenuItem(h) {
      const {pathUrl, url} = this.data;
      return h(
        'el-menu-item',
        {
          class: 'menu-item-container',
          props: {
            index: `${pathUrl || url}`,
          },
        },
        [this.renderIcon(h), this.renderTitleSlot(h)],
      );
    },
    // 渲染title slot
    renderTitleSlot(h) {
      return h(
        'div',
        {
          slot: 'title',
          class: 'menu-item-text',
        },
        this.data.name,
      );
    },
    // 渲染Icon图标
    renderIcon(h) {
      const DefaultIcon = h('span', {
        class: 'icon-default',
      });
      let Icon = this.isUrl ? this.renderImageIcon(h) : this.renderSvgIcon(h);
      if (!this.data.iconUrl) {
        Icon = DefaultIcon;
      }
      return h(
        'div',
        {
          class: 'menu-item-icon',
        },
        [Icon],
      );
    },
    // 渲染图片Icon
    renderImageIcon(h) {
      return h('img', {
        class: 'image-icon',
        attrs: {
          src: this.data.iconUrl,
        },
      });
    },
    // 渲染SvgIcon
    renderSvgIcon(h) {
      return h('svg-icon', {
        class: 'svg-icon',
        props: {
          iconClass: this.data.iconUrl,
        },
      });
    },
  },
};
</script>

<style lang="less">
@backgroundColor: #f0f2f5;

// reset hover backgroundColor
.el-menu-item:hover,
.el-submenu__title:hover {
  background-color: @backgroundColor !important;
}

.el-menu-item {

  .menu-item-icon {
    z-index: 99;
  }

  .menu-item-text {
    z-index: 99;
  }

  &.is-active {
    position: relative;
    color: #fff !important;
    .icon-default {
      width: 4px;
      height: 12px;
      background-color: #fff;
      border-radius: 15px;
    }
    &:after {
      position: absolute;
      top: 8px;
      left: 12px;
      content: '';
      display: block;
      width: 174px;
      height: 34px;
      background:@primary-color;
      border-radius: 8px;
    }
  }
}
// 菜单收起的样式
.hideSidebar {
  .menu-item-text,
  .el-submenu__icon-arrow {
    display: none;
  }

  .el-submenu__title {
    height: 50px;
    line-height: 50px;
    .menu-item-container {
      height: 100%;
      justify-content: center;

      .icon-default {
        margin: 0 auto;
      }
    }
  }

  [class*='icon'] {
    font-size: 16px;
    margin: 0;
    justify-content: center;
  }

  .el-tooltip {
    .menu-item-icon {
      height: 100%;
    }
  }
}

.menu-item {
  &-text {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }

  &-container {
    display: flex;
    align-items: center;
  }

  &-icon {
    height: 100%;
    display: flex;
    align-items: center;
    .image-icon {
      width: 16px;
    }

    // 默认icon
    .icon-default {
      display: block;
      width: 4px;
      height: 4px;
      background: rgba(171, 172, 176, 1);
      border-radius: 1px;
      margin: 0 3px;
    }
  }
}

.popover-menu {
  .el-menu-item, .el-submenu__title{
    height: 50px;
    line-height: 50px;
  }
}
</style>
