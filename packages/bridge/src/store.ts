import store from './stark-data/store';
import { warn, isString } from './stark-data/utils';

/**
 * 固定设定参数的方法
 */
const globalStoreKeys: TSumType[] = ['token', 'appInfo', 'menuInfo', 'userInfo'];

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
function get(storeName: TMenuInfo): IMenuInfo[]
function get(storeName: TAppInfo): IAppInfo
function get(key: string, callback: () => any): any
function get(key: string, callback?: () => any): any {
  // 判断key是否存在于数组中
  // 如果存在则直接返回
  // 如果不存在，则去判断有没有，没有的话，调用回调函数
  if(globalStoreKeys.find(val => val === key)) {
    const value = store.get(key);
    _validateDataFormat(key as any, value)
    return value
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
  if(globalStoreKeys.indexOf(key as TSumType) > -1) {
    if(_validateDataFormat(key as any, value)) {
      return store.set(key, value);
    }
    return;
  }
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

interface anyObject {
  [propsName: string]: any
}

function _validateDataFormat(type: TToken, val: string): boolean
function _validateDataFormat(type: TUserInfo, val: IUserInfo): boolean
function _validateDataFormat(type: TMenuInfo, val: IMenuInfo[]): boolean
function _validateDataFormat(type: TAppInfo, val: IAppInfo): boolean
function _validateDataFormat(type: TSumType, val: any): boolean {

  const logWarn = (): boolean => {
    warn(`${type}格式错误，请先核对数据格式`)
    return false;
  }

  const validateKeyAndType = (baseObj: anyObject, compareObj: anyObject): boolean => {
    const formatKeys = Object.keys(baseObj)
    
    // child不做比较
    // 都去除child来进行比较长度
    const compareBaseObjKeysLength = formatKeys.length - Number(baseObj.children !== undefined);
    const compareObjKeysLength = Object.keys(compareObj).length - Number(compareObj.children !== undefined);

    // 判断传入的数据长度是否一致
    if(compareBaseObjKeysLength !== compareObjKeysLength) {
      return false
    }
    for(const item of formatKeys) {
      if(Object.prototype.toString.call(compareObj[item]) !== baseObj[item]) {
        return false
      }
    }
    return true;
  }
  
  const notHasThoseValidate = (str: string): void => {
    warn(`暂不支持对${str}字段进行解析`);
  }

  if(globalStoreKeys.indexOf(type) > -1) {
    if(type === 'token') {
      return isString(val) || logWarn();
    } else if(type === 'userInfo') {
      const baseUserInfoType: IUserInfo = {
        tenantId: '[object String]', // 租户隔离标识
        appId: '[object String]', // 应用id
        username: '[object String]', // 帐号名
        email: '[object String]', // 邮箱
        phone: '[object String]', // 手机号
        nickname: '[object String]', // 姓名
        avatar: '[object String]', // 头像
        gender: '[object String]', // 性别（0：男，1：女）
      }
      return validateKeyAndType(baseUserInfoType, val) || logWarn();
    } else if (type === 'menuInfo') {
      const baseMenuInfo = {
        appId: '[object String]', // 应用id
        name: '[object String]', // 名称
        code: '[object String]', // 标识码
        description: '[object String]', // 描述
        type: '[object String]', // 类型  0-菜单 1-按钮 2-其它
        iconUrl: '[object String]', // 图标
        pathUrl: '[object String]', // 路径URL
        status: '[object String]', // 状态 0-有效 1-无效
      }
      let status = true;
      const validateItem = (menuList: IMenuInfo[]) => {
        for(const item of menuList) {
          if(!validateKeyAndType(baseMenuInfo, item)) {
            status = false;
            break;
          } else if(item.children && item.children.length) {
            validateItem(item.children)
          }
        }
      }
      validateItem(val);
      return status || logWarn();
    } else if (type === 'appInfo') {
      const baseAppInfo = {
        name: '[object String]', // 应用名称
        description: '[object String]', // 应用描述
        code: '[object String]', // code
        logoUrl: '[object String]', // 图标URL
        status: '[object String]', // 状态 0-启用 1-禁用
        loginUrl: '[object String]', // 登录地址
      };
      return validateKeyAndType(baseAppInfo, val);
    }
  }
  notHasThoseValidate(type);
  return false;
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