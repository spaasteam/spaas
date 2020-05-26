import axios from '@/services/apiClient'

import { AxiosRequestConfig } from 'axios'

// type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

// // 删除 'url' | 'data' | 'method' | 'params'，返回其它
export type RequestConfig = Omit<AxiosRequestConfig, 'url' | 'data' | 'method' | 'params'>;

function urlResolve (url: string, paramsObj: {[key: string]: string}) {
  if (!paramsObj || !url.includes('{')) return url

  const urlArray = url.split('/').map(item => {
    if (item.includes('{')) {
      const paramName = item.replace(/[{}\s]/g, '')
      return paramsObj[paramName]
    }
    return item
  })
  return urlArray.join('/')
}

/**
 * @description: 重写mock请求方法
 *
 * 因pont只支持以下格式
    axios({
      method: 'post',
      url: '/user/12345',
      data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
      }
    });
    //为什么这么说呢，是根据查看生成的api接口文档查看的
 */
export function fetch (options) {
  console.log(options)
  // get/post 设置请求头的方式不一样，需要兼容
  // 参考：https://www.cnblogs.com/dudu123/p/10107242.html
  return axios[options.method](options.url, {
    params: {
      ...options.params
    },
    headers: {
      ...options.headers
    }
  })
}
