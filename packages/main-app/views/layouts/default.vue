<template>
  <div>
    <el-container class="default-layout">
      <div v-if="SANDBOX && showTips" class="sandbox-tips">
        <div class="tips-text">预览模式下可体验你选择的全部功能，同时预览模式下不持久保存操作数据，如需正式使用，请开通我们提供的运行服务！</div>
        <i class="el-icon-close" @click="closeTips"></i>
      </div>
      <el-header class="default-layout-header">
        <div class="default-layout-header-logo" @click="linkHomeBtn">
          <svg-icon class="logo-icon" icon-class="dr-logo" />
          <h1>DEEPEXI 数字化零售平台</h1>
        </div>
        <el-dropdown class="user-operate" @command="handleDropdown">
          <span class="el-dropdown-link">
            {{ user.username || "guest" }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="LOGOUT">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-container class="default-layout-container">
        <div :class="{ collapsed: isCollapse }" class="nav-menu">
          <div class="nav-menu__main">
            <ul>
              <li
                v-for="menu in menuList"
                :key="menu.id"
                :class="{ active: currentMainPath == menu.name }"
                @click="mainNavClick(menu)"
              >
                <icon-font :icon="menu.iconUrl" prefix></icon-font>
                <span v-show="!isCollapse">{{ menu.name }}</span>
              </li>
            </ul>
            <p class="collapse-btn">
              <span class="iconfont iconshouqi" @click="toggleMenuShow"></span>
            </p>
          </div>

          <transition name="slide">
            <ul
              v-show="currentPath !== '/' && !isCollapse && subMenuList.length > 0"
              class="nav-menu__sub"
            >
              <li
                v-for="subMenu in subMenuList"
                :key="subMenu.id"
                :class="{ active: currentSubPath == subMenu.name }"
                @click="subNavClick(subMenu)"
              >
                <span>{{ subMenu.name }}</span>
              </li>
            </ul>
          </transition>
        </div>

        <el-container class="default-layout-main">
          <el-main class="default-layout-content">
            <section style="width: 100%;min-height: 100%;background: #fff;position: relative">
              <slot></slot>
              <router-view></router-view>
            </section>
          </el-main>
          <el-footer class="default-layout-footer" height="40px">
            <copyright></copyright>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Copyright from "../components/copyright.vue";
// import registerMicroAppsByMenu from '../auth';
import {SANDBOX} from '../const/globalEnv';

export default {
  components: {
    Copyright,
  },
  props: {
    loading: Boolean,
    content: String,
  },
  data() {
    const currentPath = this.$route && this.$route.path || '/'
    return {
      SANDBOX,
      showTips: false,
      currentMainPath: "",
      currentSubPath: "",
      currentPath,
      isCollapse: false,
      subMenuList: [],
      showComponent: "blank", // "404", "forbidden", "index"
    };
  },
  watch:{      //监听路由变化
    $route( to , from ){
      this.currentPath = to && to.path || '/'
    }
  },
  computed: {
    user() {
      return this.$store.state.user || {};
    },
    menuList() {
      const list = this.$store.state.menuList;
      if(list && list.length) {
        const {
          token,
          meta,
          user,
          openedProducts,
          iamAppId,
        } = this.$store.state;
        // 显示404
        this.getComponentByRouter(list);
        this.$nextTick(() => {
          // 注册子应用
          // registerMicroAppsByMenu(list, {
          //   token,
          //   meta,
          //   user,
          //   openedProducts,
          //   iamAppId,
          // });
        })
      }
      // 显示侧边栏
      this.showMenu(list);
      return list;
    },
    path() {
      return this.$route.path;
    },
    showLogin() {
      return !this.$store.state.token;
    },
    showIndex() {
      return (
        this.$store.state.token &&
        this.$store.state.user.id &&
        this.$store.state.user.appId
      );
    },
  },
  async created() {
    // 如有没有用户信息，则先重新获取
    if (this.$store.state.token && !this.$store.state.user.id) {
      await this.$store.dispatch("GET_USER_INFO");
      await this.$store.dispatch("GET_USER_PERMISSION");
    }
    if(this.SANDBOX) {
      this.showTips = true;
    }
  },
  methods: {
    handleDropdown() {
      this.$store.commit("LOGOUT");
    },
    toggleMenuShow() {
      this.isCollapse = !this.isCollapse;
    },
    gotoRoute(path) {
      if (this.path != path) {
        this.$router.push({ path });
      }
    },
    mainNavClick(menu) {
      this.currentMainPath = menu.name;
      this.subMenuList = menu.children || [];
      const defaultMenu = this.subMenuList[0];

      if (defaultMenu) {
        // 默认进入第一个路由
        this.currentSubPath = defaultMenu.name;
        this.gotoRoute(defaultMenu.pathUrl);
      } else {
        // 如果没有二级菜单，点击就进去路由
        menu.pathUrl && this.gotoRoute(menu.pathUrl);
      }
    },
    subNavClick(subMenu) {
      this.currentSubPath = subMenu.name;
      this.gotoRoute(subMenu.pathUrl);
    },
    //跳转回首页按钮
    linkHomeBtn() {
      const path = this.$route.path;
      if (path === "/") return;
      this.$router.replace("/");
      Object.assign(this.$data, this.$options.data());
    },
    showMenu(menu) {
      //防止刷新浏览器后一级菜单未显示选中项、二级菜单未显示
      const path = this.$route.path;
      const firstLevelPath = path.split("/")[1]; //获取路径中的一级路由
      const secondLevelPath = path.split("/")[2]; //获取路径中的二级路由
      // eslint-disable-next-line
      const pathStr = `${firstLevelPath}\/${secondLevelPath}`; //匹配到二级路由
      menu.forEach((item) => {
        if (path === item.pathUrl) {
          //没有二级路由
          this.currentMainPath = item.name;
        }
        let firstChildrenPath =
          item.children.length !== 0 && item.children[0].pathUrl.split("/")[1]; //获取一级路由
        if (firstLevelPath === firstChildrenPath) {
          this.currentMainPath = item.name;
          this.subMenuList = item.children;
          item.children.forEach((i) => {
            if (this.currentSubPath === "") {
              this.currentSubPath =
                i.pathUrl.indexOf(pathStr) !== -1 ? i.name : "";
            }
          });
        }
      });
    },
    getComponentByRouter(menu) {
      const currentHashPath = location.hash.split('?')[0];
      const routerIfInMenu = (menu) => {
        for(let i in menu) {
          const arrList = menu[i].pathUrl.split('#/');
          const childRootRouter = arrList[1] ? `#/${arrList[1]}` : '';
          const ifRight = childRootRouter && (currentHashPath === childRootRouter || currentHashPath.startsWith(`${childRootRouter}/`) || currentHashPath.startsWith(`${childRootRouter}?`))
          if(ifRight) {
            return true;
            break;
          }
        };
        return false;
      }
      // "404", "forbidden", "index"
      if(currentHashPath === '#/') {
        this.showComponent = 'index';
      } else if(!routerIfInMenu(menu)) {
        this.showComponent = '404';
      } else {
        this.showComponent = 'blank';
      }
    }, 
    closeTips() {
      this.showTips = false;
    }
  },
};
</script>

<style lang="less">
/* stylelint-disable */
.default-layout {
  height: 100vh;

  .sandbox-tips {
    display: flex;
    padding: 20px;
    line-height: 25px;
    text-align: center;
    font-weight: 400;
    color: #818389;
    .tips-text {
      flex: 1;
    }
    .el-icon-close {
      font-size: 25px;
    }
  }

  &-header {
    background-color: #192e56;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-logo {
      display: flex;
      align-items: center;
      cursor: pointer;

      .logo-icon {
        margin-right: 10px;
        width: 22px !important;
        height: 22px !important;
      }

      h1 {
        font-size: 18px;
        color: #fff;
        font-weight: 400;
      }
    }

    .user-operate {
      float: right;
      line-height: 60px;

      .el-dropdown-link {
        color: #fff !important;
      }
    }
  }

  &-container {
    height: calc(100vh - 60px);
  }

  .default-layout-sider {
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.15);
    z-index: 10;
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

  &-footer {
    overflow: hidden;
  }

  .nav-menu {
    display: flex;
    font-size: 14px;

    &.collapsed {
      .collapse-btn {
        transform: rotate(180deg);
      }

      .nav-menu__main {
        min-width: 30px;

        li {
          min-width: 30px;
        }
      }
    }

    &__main {
      box-sizing: border-box;
      display: flex;
      padding-left: 6px;
      min-width: 80px;
      position: relative;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.15);
      overflow-y: auto;
      // 在chrome 隐藏菜单的滚动条
      &::-webkit-scrollbar {
        display: none;
      }

      flex-direction: column;
      justify-content: space-between;

      .collapse-btn {
        line-height: 50px;
        text-align: center;
        transition: transform 0.5s ease;
        transform: rotate(0deg);

        .iconfont {
          color: #8c8e9a;
          cursor: pointer;
          font-size: 14px;
        }
      }

      li {
        height: 40px;
        margin: 10px 0;
        padding: 0 6px 0 10px;
        display: flex;
        align-items: center;
        min-width: 74px;
        cursor: pointer;

        .iconfont {
          color: #2878ff;
          margin-right: 4px;
        }

        span {
          white-space: nowrap;
        }

        &.active {
          background: #2878ff;
          border-radius: 100px 0 0 100px;
          color: #fff;

          .iconfont {
            color: #fff;
          }
        }
      }
    }

    &__sub {
      display: inline-block;
      padding: 10px;
      min-width: 120px;
      box-sizing: border-box;
      box-shadow: 2px 0 4px -3px rgba(0, 0, 0, 0.15);
      z-index: 1;
      overflow-y: auto;
      // 在chrome 隐藏菜单的滚动条
      &::-webkit-scrollbar {
        display: none;
      }

      li {
        height: 50px;
        padding: 9px 0 9px 2px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        min-width: 100px;
        white-space: nowrap;
        cursor: pointer;

        span {
          display: block;
          width: 100%;
          height: 100%;
          padding: 0 5px 0 8px;
          line-height: 32px;
          border-radius: 4px;
        }

        &.active {
          span {
            color: #2878ff;
            background: rgba(40, 120, 255, 0.08);
          }
        }
      }
    }
  }
}
</style>
