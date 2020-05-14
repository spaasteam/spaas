// ts识别全局方法/变量
import VueRouter, { Route } from 'vue-router'
import Vue from 'vue'
import { Store } from 'vuex'

declare module '*.vue' {
  export default Vue
}
declare module '*.ts' {
  const value: any
  export default value
}

declare global {
  interface window {
    require: any
  }
}

// 识别 this.$route
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter // 这表示this下有这个东西
    $route: Route
    $store: Store<any>
  }
}

/**
 * 引入部分第三方库/自己编写的模块的时候需要额外声明文件
 * 引入的时候，需要使用类似 import VueLazyLaod from 'vue-lazyload' 的写法
 */
// declare module 'vue-lazyload'
