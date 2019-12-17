import axios from '@/services/apiClient';

const apiVersion = '/api/v1';
const serviceType = '/deepexi-cloud';
const serviceTenantType = `${serviceType}/tenant`;
const serviceAdminType = `${serviceType}/admin`;

const basicUrl = `${serviceType}${apiVersion}`;
const tenantUrl = `${serviceTenantType}${apiVersion}`;
const adminUrl = `${serviceAdminType}${apiVersion}`;

import {userInfo, subscribeInfo, routers} from '@/const/config';

const isSingleBuild = process.env.SINGLE_BUILD === '1';

/**
 * @description 登录接口
 * @param {*} userInfo
 */
export const loginByUsername = isSingleBuild
  ? async () => userInfo
  : userInfo => axios.$post(`${basicUrl}/login`, userInfo);

/**
 * @description 获取中心Id
 * @param {*} params
 * @param {string} tenantId 租户ID
 */
export const getProductList = isSingleBuild
  ? async () => subscribeInfo
  : params => axios.$get(`${adminUrl}/spaasProductSubscribe`, {params});

// 获取用户权限菜单
/**
 * @description 获取菜单资源
 * @param {*} params
 */
export const getMenu = isSingleBuild
  ? async () => routers
  : params => axios.$get(`${tenantUrl}/menus`, {params});

/**
 * @description 根据token获取用户信息
 * @param {*} token
 */
export const getUserDetail = isSingleBuild
  ? async () => userInfo
  : token => axios.$get(`${basicUrl}/token?token=${token}`);
