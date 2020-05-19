import axios from "@/services/apiClient";
import PermissionJson from './json/permission.json';
import userInfo from './json/userInfo.json';
import MenuJson from "./json/menu.json";

const context = "/deepexi-system-digital-retail-1.1";
const version = "/api/v1";
const baseUrl = context + version;
const deepexiUrl = "/deepexi-cloud" + version;
const deepexiCloudTenant = "/deepexi-cloud/tenant" + version;

/**
 * 登陆
 */
export const login = (params) => {
  return axios.$post(`${deepexiUrl}/login`, {
    channel: "pc",
    ...params,
  });
}

/**
 * 根据token获取用户信息
 * @param {string} token
 */
export const getUserInfo = (token) => {
  return axios.$get(`${deepexiUrl}/token?token=${token}`);
}

/**
 * 获取当前用户已开通的产品
 */
// export const getOpenProducts = () => axios.$get(`${deepexiUrl}/user/products`)
export const getOpenProducts = () => {
  return axios.$get(
    `/asset-service/tenant/api/v1/products/permission-product-group-by-channel`
  );
}
  

/**
 * 获取当前用户的菜单权限
 * @param {*} productId 菜单功能组id
 */
export const getUserPermission = (productId) => {
  return axios.$get(
    `${deepexiCloudTenant}/menus?code=digital-retail-console-menu&appId=${productId}`
  );
}

/**
 * 获取DR产品
 */
export const findDrProduct = (saasProduct) => {
  // saasProduct = saasProduct.reduce((pre, cur) => {
  //   if (cur.products) {
  //     pre.push(...cur.products)
  //   }
  //   return pre
  // }, [])

  return saasProduct.find((v) => v.productName == "DR");
};

/**
 * 初始化渠道和店铺
 * type 1.PC运营端登录时 2.H5端登录时 3.微信小程序授权
 */
export const initChannelAndShop = () => {
  const channelList = [1];

  channelList.forEach((type) => {
    axios.$post(`${baseUrl}/login/initialize/initializeChannelShop`, {
      type,
    });
  });
};

/**
 * 初始化会员分组和等级
 * @param {Object} params
 */
export const initMember = () =>
  axios.$post(`${baseUrl}/login/initialize/initializeMemberGroupLevel`);
