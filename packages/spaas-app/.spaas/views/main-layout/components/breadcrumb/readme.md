## 面包屑

目前的技术点是根据当前路由的 `this.$route.fullPath` 去匹配出一个路径数组

### example

```js
let path = '/app-management/list'

const routes = matchAllRoutes(path)

console.log(routes) // ['/app-management', '/app-management/list']
```

上面的 routes 就是匹配出来的路径，然后会拿 `src/const/route-info.json` 下的 路由表进行对照获取对应的 `title`

`router-info.json` 文件内容大概如下
```js
{
   "/app-management": "应用管理",
   "/app-management/list": "应用列表"
}
```

有了上面的基础信息，我们就可以在面包屑下使用

```js
import routeInfoMap from 'absolutePath' // 所有路由的 name 对照表

computed: {
  breadcrumbList() {
    return matchAllRoutes(this.$route.fullPath) // 得到面包屑的 path 数组
      .map(path => ({  // 通过 path 组装 path title 等数据
        path,
        title: routeInfoMap[path],
      }))
      .filter(({ title }) => title); // 最后掉滤出没有 title 的
  },
}
```


目前vue文件路由可以通过 `npm run build:page` 命令去动态生成，但是 根节点路由还需要自己添加。

命令相关的信息请查看 `bin/new/README.md`

