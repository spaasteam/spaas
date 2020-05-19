
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

export interface IState {
  token?: string;
  userInfo?: IUserInfo | null;
  menuList?: IMenuInfo[] | null;
  appInfo?: IAppInfo | null;
  collapse?: boolean // 是否收缩侧边栏
}

export interface mapObj {
  [key: string]: any
}
