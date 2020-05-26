/**
 * 在使用.get().. 方法的时候，是对返回值没有做任何的处理的
 * 在使用.$get()..方法的时候，对返回值有做相应的处理
 */
import axios, { AxiosRequestConfig } from 'axios'
import store from '@/store/index'
import { tuple } from '../utils/type'
import { Notification, Message } from 'element-ui'

interface Methods {
  [key: string]: (...args: any) => any;
}

const skipUrls = ['easy-mock']
const methods = ['put', 'post']

const codeMessage = {
  400: '请求有误',
  401: '没有权限',
  403: '禁止访问',
  404: '请求不存在',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误。',
  503: '服务不可用',
  504: '网关超时'
}

const remindOrExit = (() => {
  let timer
  return (error) => {
    const resp = error.response
    const data = resp.data

    if (resp.status === 401) {
      if (!timer) {
        Notification.error({
          title: '提示',
          message: '登陆超时，请重新登录！'
        })
        timer = setTimeout(() => {
          store.commit('LOGOUT')
        }, 2000)
      }
    } else {
      const statusCode = String(resp.status)
      const message: string =
        resp.status === 200
          ? data.msg
          : resp.data.msg || data.message || codeMessage[resp.status]
      // 判断http状态码或者code是否为4开头
      if (statusCode.startsWith('4') || data.code.startsWith(4)) {
        Message.error(message)
      } else {
        Notification.error({
          title: '提示',
          message
        })
      }
    }
  }
})()

const service: Methods = {}

// Request helpers
const reqMethods = tuple(
  'request',
  'delete',
  'get',
  'head',
  'options', // url, config
  'post',
  'put',
  'patch', // url, data, config
  '$get',
  '$put',
  '$delete',
  '$post'
)

axios.interceptors.request.use(
  function (config: AxiosRequestConfig): AxiosRequestConfig {
    // Do something before request is sent
    let url = config.url || ''
    const method = config.method
    // 因后端框架进行规范改造，故post，put方法query后边不传参数
    const chekoutMethod = methods.some((v) => v === method)
    if (skipUrls.some((skipUrl) => url.indexOf(skipUrl) > -1)) return config

    const token = store.state.token
    const userData = store.state.userInfo || {}

    // 只传有值的参数
    const paramsList = ['tenantId', 'appId', 'userId'].filter((v) => {
      return userData[v]
    })

    // post put参数
    const paramsData = paramsList.reduce((cur, pre) => {
      cur[pre] = userData[pre]
      return cur
    }, {})

    // query参数
    const queryData = paramsList
      .map((v) => {
        return `${v}=${userData[v]}`
      })
      .join('&')

    // jwt 验证
    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`
    }

    if (!chekoutMethod) {
      url += url.indexOf('?') > -1 ? '&' : '?'
      url += queryData
    } else {
      if (!Array.isArray(config.data)) {
        config.data = {
          ...config.data,
          ...paramsData
        }
      }
    }

    config.url = `${url}${
      url.indexOf('?') > -1 ? '&' : '?'
    }_=${new Date().getTime()}`
    return config
  },
  function (error) {
    remindOrExit(error)
    // Do something with request error
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (resp) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const { data } = resp
    const code = parseInt(data.code)
    // 如果code存在且不等于0，则将响应到error中
    if (code !== 0 && !Number.isNaN(code)) {
      // 如果httpStatusCode = 200, 但是操作失败的请求，将响应转为error
      // 兼容error的数据结构
      remindOrExit({ response: resp })
      // eslint-disable-next-line
      return Promise.reject({ response: resp })
    }
    return Promise.resolve(resp)
  },
  function (error) {
    remindOrExit(error)
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

reqMethods.forEach((method) => {
  service[method] = (...rest) => {
    // 不含有$的方法名不对其数据进行处理
    if (method.indexOf('$') !== -1) {
      // 含有$, 将返回数据处理
      return axios[method].apply(null, rest).then((res) => res.data)
    }
    return axios[method].apply(null, rest)
  }
})

export const GET = service.$get
export const POST = service.$post
export const DELETE = service.$delete
export const PUT = service.$put

export default service
