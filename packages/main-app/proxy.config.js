// 不能以斜杠结尾
const apiServer = process.env.API_SERVER;

module.exports = {
  '/asset-service': {
    target: apiServer
  },
  '/deepexi-cloud': {
    target: apiServer
  },
  '/deepexi-tenant': {
    target: apiServer
  },
  '/deepexi-permission': {
    target: apiServer
  },
  '/deepexi-system-digital-retail-1.1': {
    target: apiServer
  },
  '/dev-asset-service-v2': {
    target: 'http://dr.sandbox.deepexi.top/dev-asset-service-v2/'
  },
  '/prd-asset-service-v2': {
    target: apiServer
  },
};
