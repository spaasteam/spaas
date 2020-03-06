export default {
  OSS_KEY: process.env.OSS_KEY,
  OSS_SECRET: process.env.OSS_SECRET,
  OSS_BUCKET: process.env.OSS_BUCKET,
  OSS_DIR: process.env.OSS_DIR,
  OSS_REGION: process.env.OSS_REGION,
  API_SERVER: process.env.API_SERVER,
  BUILD_TYPE: process.env.BUILD_TYPE, //是否私有化
  BUILD_TYPE_PRIVATE: 'private', //私有化变量值
  USERID: process.env.USERID,
  TENANTID: process.env.TENANTID,
  TOKEN: process.env.TOKEN,
};
