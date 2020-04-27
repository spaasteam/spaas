import axios from "@/services/apiClient";


// 查询制品的所有菜单
export const getArtifactsMenu = ({artifactId, env}) => {
    const envStr = env ? `${env}-` : '';
    return axios.get(`/${envStr}asset-service-v2/asset-service-v2/tenant/api/v1/artifacts/${artifactId}/menus`)
};
