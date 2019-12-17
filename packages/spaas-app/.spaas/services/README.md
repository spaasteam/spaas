### axios

脚手架使用 默认得 `@nuxtjs/axios` 包，与原生所有方法使用方式一样

```js
  'request',
  'delete',
  'get',
  'head',
  'options', 
  'post',
  'put',
  'patch', 
  '$get',
  '$put',
  '$delete',
  '$post'
```

由于默认方法我们要取得后台返回来的 `paylaod` 需要 res.data.payload

所以推荐使用的方式是 `aixos.$get` 去使用，方法是 nuxt 官方包提供

它帮我们解构了一层出去，简单来说就是帮我们做了 `promise.then(res => res.data)`

使用 `res.payload` 就能获取到后台数据，节省一层的解构


最佳实践 

```js
import axios from '@/services/apiClient';


const getData = (params) => axios.$get(url, { params })
const postData = (params) => axios.$post(url, params)
const putData = (params) => axios.$put(url, params)
const deleteData = (params) => axios.$delete(url, { params })

```
