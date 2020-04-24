import axios from "@/services/apiClient";
const context = "/deepexi-system-digital-retail-1.1";
const version = "/api/v1";
const baseUrl = context + version;

export const getHomeData = () => axios.$get(`${baseUrl}/homePage/data`);

/**
 * 查询已绑定公众号列表
 */
export const getWeixinList = () =>
  axios.$get(`${baseUrl}/wx/authorizerInfos/list`);
