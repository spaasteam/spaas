/*
 * @Author: Han
 * @Date: 2019-05-08 15:13:59
 * @Last Modified by: Han
 * @Last Modified time: 2019-05-15 15:51:46
 * @Description 请求拦截，适配 restEasy 后端API服务框架，若数据格式不符合下面的数据格式，则会按照 httpStatusCode 正常触发对应的事件。
 * @Example
 * 适配api返回格式：
 * {
 *   code: Number, // 业务状态码 0: 操作成功;
 *   msg: String,  // 业务操作信息 当 code === 0 时为 "ok"; code !== 0 时为具体的失败信息
 *   payload: Any, // 接口返回数据
 * }
 *
 * 当 code !== 0 同时 httpStatusCode === 200 时，请求会被拦截到 xhr.onerror 事件，即此时的请求操作会被 Promise.catch 捕获。
 * 其余情况都和普通请求行为一致
 */

import Vue from 'vue';
import cookie from 'js-cookie';
import qs from 'qs';

import cookieKeys from '@/const/cookie-keys';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 根据返回的状态码以及错误码来提示用户
 */
const remindOrExit = (() => {
  let timer;
  return error => {
    const resp = error.response;
    const data = resp.data;
    const status = resp.status;
    let message = '';

    if (status === 401 || status === 403) {
      const {exp, msg} = data;
      // exp: 'exceeds maximum allowed expiration';
      // message: "No credentials found for given 'iss'";
      // 如果有exp字段则认为为登录超时
      // 没有权限，执行一次logout，然后重新登录
      if (exp) {
        message = '登陆超时，请重新登录！';
      } else {
        message = '您已通过其他浏览器登录,请退出后再登陆！';
      }
      if (!timer) {
        Vue.$notify.error({
          title: '提示',
          message: msg || message,
        });
        timer = setTimeout(() => {
          cookieKeys.forEach(key => {
            cookie.remove(key, {
              path: process.env.COOKIE_PATH,
              domain: process.env.COOKIE_DOMAIN,
            });
          });
          // 清空state，跳转到login页的逻辑交给路由守卫
          window.location.reload();
        }, 3000);
      }
    } else {
      message = data.msg || data.message || '';
      Vue.$notify.error({
        title: data.code || status,
        message: message || codeMessage[status],
      });
    }
  };
})();

export default function({$axios, store}) {
  $axios.onRequest(config => {
    let url = config.url;
    // jwt 验证
    if (store.state.token) {
      config.headers.common.Authorization = `Bearer ${store.state.token}`;
    }

    const params = {
      tenantId: store.state.tenantId,
      userId: store.state.userId,
      appId: store.state.app.appId,
      _: new Date().getTime(),
    };
    // 去除空值
    for (const i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }

    url += url.indexOf('?') > -1 ? '&' : '?';
    url += qs.stringify(params);

    config.url = url;

    return config;
  });

  $axios.onResponse(resp => {
    const {data} = resp,
      code = parseInt(data.code, 10);

    // 如果code存在且不等于0，则将响应到error中
    if (code !== 0 && !Number.isNaN(code)) {
      // 如果httpStatusCode = 200, 但是操作失败的请求，将响应转为error
      // 兼容error的数据结构
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        ...resp,
        response: resp,
      });
    }
    // 不能直接resolve resp.data 因为部分组件是按照axios原本的返回数据结构进行设计的
    return Promise.resolve(resp);
  });

  $axios.onError(error => {
    if (process.client) {
      // axios 数据结构
      remindOrExit(error);
    } else {
      // TODO asyncData 的错误 需要日志监控
      console.log('error', error);
    }

    // 将错误信息继续抛出，业务逻辑可以进行后续的操作
    return Promise.reject(error);
  });
}
