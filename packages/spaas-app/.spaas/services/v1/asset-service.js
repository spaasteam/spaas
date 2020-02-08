import axios from '@/services/apiClient';

const apiVersion = '/api/v1';
const serviceType = '/asset-service';
const serviceTenantType = `${serviceType}/tenant`;
const serviceAdminType = `${serviceType}/admin`;

const basicUrl = `${serviceType}${apiVersion}`;
const tenantUrl = `${serviceTenantType}${apiVersion}`;
const adminUrl = `${serviceAdminType}${apiVersion}`;

/**
 * @description 获取中心Id
 * @param {*} params status 0 未订阅 1 已订阅
 * @param {string} tenantId 租户ID
 */
export const getProductList = params =>
  axios.$get(`${adminUrl}/spaas/products/subscription`, {params});
