# @spaas/bridge使用文档v0.1.0

# @spaas/bridge使用文档v0.1.0

<a name="pbeX5"></a>

## 前言
通过 `@spaas/bridge` 这个包可以很简单的实现应用间通信，比如全局切换语言子应用响应的场景。`@spaas/bridge` 支持状态共享和事件监听响应两种方式。基于`@ice/stark-data进行了二次封装，限定了通信的内容`

<a name="t0K2G"></a>

## 安装

```bash
# yarn
yarn add @spaas/bridge --registry http://129.204.96.188:4873
# npm
npm install @spaas/bridge --registry http://129.204.96.188:4873
```
<a name="8upys"></a>

## store

<br />

<a name="qjlp1"></a>

### get(key, callback) 子应用中获取数据

- key: 字符串，限定为token || userInfo || menuInfo || appInfo 如果设置这些字段外的数据，必须设置获取参数的回调方法
- callback: 一定要设置一个默认获取值的方法。
- 返回值为对应的数值数据 对应的值具体的数据格式看以下例子



<a name="ZnCfZ"></a>

#### 获取token
```javascript
import Bridge from '@spaas/bridge'
// 获取token
Bridge.store.get('token');
```


<a name="rd4Sj"></a>

#### 获取用户信息
```javascript
import Bridge from '@spaas/bridge'

// 获取用户信息
Bridge.store.get('userInfo');
```
<a name="1s4jI"></a>

#### 获取Menu信息
```javascript
import Bridge from '@spaas/bridge'

// 获取Menu信息
Bridge.store.get('menuInfo');
```

<a name="Stkcg"></a>

#### 获取App信息
```typescript
import Bridge from '@spaas/bridge'
// 获取App信息
Bridge.store.get('appInfo');
```
<a name="Mx6O6"></a>

#### 获取限定类型外的数据
```typescript
import Bridge from '@spaas/bridge'
// 获取限定类型外的数据
Bridge.store.get('expandData', async () => {
  return new Promise((resolve) => {
    // 如果没有获取到主应用中的数据，则在这里进行请求接口获取
    setTimeout(() => {
      resolve({
        message: '获取到主应用中的数据'
      })
    }, 1000)
  })
})
```

<br />

<a name="xP2CS"></a>

### set(key, value) 设置公共的共享数据

- key: 字符串，限定为token || userInfo || menuInfo || appInfo
- value: 对应的值具体的数据格式看以下例子



<a name="ky5IB"></a>

#### 设置token信息
```javascript
import Bridge from '@spaas/bridge'
// 设置token
Bridge.store.set('token', 'eeee');
```


<a name="z95FF"></a>

#### 设置用户信息
```javascript
import Bridge from '@spaas/bridge'

// 设置用户信息
const userInfo = {
  "tenantId": "", // 租户隔离标识
  "appId": "", // 应用id
  "username": "", // 帐号名
  "email": "", // 邮箱
  "phone": "", // 手机号
  "nickname": "", // 姓名
  "avatar": "", // 头像
  "gender": "", // 性别（0：男，1：女）
}
Bridge.store.set('userInfo', userInfo);
```
<a name="MJmkL"></a>

#### 设置Menu信息
```javascript
import Bridge from '@spaas/bridge'


// 设置Menu信息
const menuInfo = {
  "appId": "", // 应用id
  "name": "", // 名称
  "code": "", // 标识码
  "description": "", // 描述
  "type": "", // 类型  0-菜单 1-按钮 2-其它
  "iconUrl": "", // 图标
  "pathUrl": "", // 路径URL
  "status": "", // 状态 0-有效 1-无效
  "children": [], // 子菜单
}
Bridge.store.set('menuInfo', menuInfo);
```
<a name="VYCf6"></a>

#### 设置App信息
```typescript
import Bridge from '@spaas/bridge'
// 设置App信息
const appInfo = {
  "name": "", // 应用名称
  "description": "", // 应用描述
  "code": "", // code
  "logoUrl": "", // 图标URL
  "status": "", // 状态 0-启用 1-禁用
  "loginUrl": "", // 登录地址
}
Bridge.store.set('appInfo', appInfo);
```

<br />

<a name="UBKA7"></a>

### on(key, callback, force) 监控数据的变化

- **key**: 数据的key值 值限定为token || userInfo || menuInfo || appInfo
- **callback**：回调函数，获取到的数据为更换后的数据
- **force**: boolean 类型，true 则表示初始化注册过程中，会强制执行一次

<br />
<a name="rAUQ5"></a>

#### 示例：
```javascript
// 子应用
import Bridge from '@spaas/bridge';

// 监听数据的变化 第一个参数限定为token || userInfo || menuInfo || appInfo
Bridge.store.watchStore('token', (lang) => {
  console.log(`get token from main app,value is ${lang}`);
}, true);
```

<br />

<a name="O0Zwl"></a>

### has(key) 判断数据是否被监控
如果数据被监控，则会返回true，否则返回false<br />

<a name="YcFYA"></a>

#### 示例：
```javascript
// 主应用
import Bridge from '@spaas/bridge';

// 判断数据是否被监控,如果数据被监控，则会返回true，否则返回false
Bridge.store.has('token');
```


<a name="Uj5sb"></a>

### hasStore(key) 判断数据是否被设置
如果数据已经被设置，则返回为true，否则返回false<br />

<a name="9k1mv"></a>

#### 示例：
```javascript
// 主应用
import Bridge from '@spaas/bridge';

// 判断数据已经被设置,如果数据被监控，则会返回true，否则返回false
Bridge.store.hasStore('user'); // false
Bridge.store.set('flower', undefined);
Bridge.store.hasStore('flower'); // true
```


<a name="KIm9m"></a>

### off(key, callback) 删除已经注册的变量监听事件

- key: 对应的监听变量
- callback: 回调函数



<a name="EQ1Ke"></a>

#### 示例：
```javascript
import Bridge from '@spaas/bridge';

// 移除token数据监控
Bridge.offAllWatchStore('token', () => {})
```

<br />

<a name="6PQTm"></a>

### offAll() 移除所有的监控store变化的事件
一键移除所有的监控事件（包括其他子应用注册的监控事件）<br />

<a name="F5Oeu"></a>

#### 示例：
```javascript
import Bridge from '@spaas/bridge';

// 移除所有的数据监控
Bridge.offAll()

```

<br />

<a name="Mg8ty"></a>

## event

- `on(key, callback)` **注册回调函数，回调函数的入参通过 emit 注入，如 ...rest**<br />
- `off(key, callback)` **删除已经注册的回调函数**<br />
- `emit(key, ...rest)` **触发已经注册的函数，支持入参**<br />



<a name="ZWTOf"></a>

### on(key, callback) 注册监控函数
```javascript
import Bridge from '@spaas/bridge';

// 注册回调函数，等待被触发
Bridge.event.on('freshMessage', (data) => {
  // 重新获取消息数
  console.log(data);
});
```


<a name="YC6NK"></a>

### emit(key, ...rest) 
```typescript
import { event } from '@spaas/bridge';
const emitData = {
  describe: '传给父应用的数据'
}
event.emit('freshMessage', emitData);
```

<br />

<a name="99nqo"></a>

### off(key, callback) 删除已注册的监控函数
```javascript
// 子应用
import { event } from '@spaas/bridge';
event.off('freshMessage', () => {});
```

<br />


## License

[MIT](LICENSE)
