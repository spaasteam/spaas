import store from './stark-data/store';
import { warn } from './stark-data/utils';

/**
 * 固定设定参数的方法
 */

export interface IUserInfo {
  tenantId: string; // 租户隔离标识
  appId: string; // 应用id
  username: string; // 帐号名
  email: string; // 邮箱
  phone: string; // 手机号
  nickname: string; // 姓名
  avatar: string; // 头像
  gender: string; // 性别（0：男，1：女）
}

export interface IMenuInfo {
  appId: string; // 应用id
  name: string; // 名称
  code: string; // 标识码
  description: string; // 描述
  type: string; // 类型  0-菜单 1-按钮 2-其它
  iconUrl: string; // 图标
  pathUrl: string; // 路径URL
  status: string; // 状态 0-有效 1-无效
  children: [], // 子菜单
}

export interface IAppInfo {
  name: string; // 应用名称
  description: string; // 应用描述
  code: string; // code
  logoUrl: string; // 图标URL
  status: string; // 状态 0-启用 1-禁用
  loginUrl: string; // 登录地址
}

type TToken = 'token';
type TUserInfo = 'userInfo';
type TMenuInfo = 'menuInfo';
type TAppInfo = 'appInfo';
type TSumType = TToken | TUserInfo | TMenuInfo | TAppInfo;

/**
 * 获取store中的值
 * 获取除了token, appInfo, menuInfo, userInfo之外的值，必须要有回调函数获取其值
 * @param key 
 * @param callback
 */
function get(storeName: TToken): string
function get(storeName: TUserInfo): IUserInfo
function get(storeName: TMenuInfo): IMenuInfo
function get(storeName: TAppInfo): IAppInfo
function get(key: string, callback: () => any): any
function get(key: string, callback?: () => any): any {
  // 判断key是否存在于数组中
  // 如果存在则直接返回
  // 如果不存在，则去判断有没有，没有的话，调用回调函数
  const globalStoreKeys: TSumType[] = ['token', 'appInfo', 'menuInfo', 'userInfo'];
  if(globalStoreKeys.find(val => val === key)) {
    return store.get(key)
  } else if(!callback) {
    warn('获取除了token, appInfo, menuInfo, userInfo之外的值，必须要有回调函数获取其值');
    return;
  } else if(hasStore(key)){
    return store.get(key)
  } else {
    return callback();
  }
}

export interface ISetKey {
  token?: string;
  userInfo?: IUserInfo;
  menuInfo?: IMenuInfo;
  appInfo?: IAppInfo;
  [propName: string]: any
}
/**
 * 设置store中的值
 * TODO 后面有需要再对其格式进行校验
 * @param  key 可以为字符串或者对象
 * @param value 可选参数
 */
function set(key: TToken, value: string): void
function set(key: TUserInfo, value: IUserInfo): void
function set(key: TMenuInfo, value: IMenuInfo): void
function set(key: TAppInfo, value: IAppInfo): void
function set(key: string, value?: any): void
function set(key: ISetKey): void
function set(key: string | ISetKey, value?: any): void {
  return store.set(key, value);
}

/**
 * 判断数据是否被监控
 * @param key string
 * @returns boolean
 */
function has(key: string): boolean {
  return store.has(key)
}

/**
 * 判断store中是否存在某值，如果存在则返回true，不存在则返回false
 * @param key string
 * @returns boolean
 */
function hasStore(key: string): boolean {
  return store.hasStore(key)
}

/**
 * 移除对某数据的数据监控
 * @param key 数据名
 * @param callback 
 */
function off(key: string, callback?: (value: any) => void) {
  return store.off(key, callback);
}

/**
 * 监听某个数据的变化
 * @param key 
 * @param callback 
 * @param force 
 */
function on(key: string, callback: (value: any) => void, force?: boolean) {
  return store.on(key, callback, force);
}

/**
 * 移除所有的数据监听事件
 */
function offAll(): void {
  store.offAll()
}
export default {
  get,
  set,
  on,
  has,
  hasStore,
  off,
  offAll
}