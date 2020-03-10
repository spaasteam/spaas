import {appName} from '../../spaas.config';

const meta = {
  favicon: 'https://bucket-cdn-prd.oss-cn-shenzhen.aliyuncs.com/spaas-favcion/spaas.ico', // 需要根据应用来更改对应的图标

  // 登录表单上的图片
  logoLogin:
    'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/logo_%E8%93%9D%E8%89%B2%E5%AD%97%E4%BD%93.svg',

  // 侧边栏logo 没有文字
  logoSidebar: 'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/logo.svg',

  // 侧边栏logo 有文字
  logoSidebarWithWord:
    'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/logo_font.svg',

  // 应用名称
  appName: 'SPaaS-Console',
  copyright: '滴普科技 版权所有',

  // 登录页背景
  loginBgImg: 'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/login-bg.jpg',

  // console 首页背景
  homePageImg: 'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/login-bg.jpg',

  // 当前应用名
  spaName: appName,

  // 菜单资源code
  menuCode: 'spaas-menu',
};

export default meta;
