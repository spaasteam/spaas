// 读取modules文件架下的所有store/xx/index.js或者store.js
const requireModule = require.context('../../modules', true, /store\/(.*)(index|store)\.js*/);
const modules = requireModule.keys();

// 根据文件夹名注册模块以及子模块
export default async ({store}) => {
  modules.forEach(md => {
    const content = requireModule(md).default || requireModule(md);
    const moduleName = md.replace(/\.\/|store\//g, '').split('/');

    moduleName.pop();
    store.registerModule(moduleName, content);
  });
};
