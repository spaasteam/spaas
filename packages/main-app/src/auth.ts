import { registerMicroApps } from "qiankun";

import render from "./render";

function genActiveRule(routerPrefix) {
  return (location) => {
    const hashRouter = location.hash.split('?')[0];
    return hashRouter === routerPrefix || hashRouter.startsWith(`${routerPrefix}/`)
  };
}

const registerMicroAppsByMenu = (menuList, data = {}) => {
  const appList = menuList.reduce((arr, info, index) => {
    const arrList = info.pathUrl.split('#/');
    const childRootRouter = arrList[1] ? `#/${arrList[1]}` : '';
    const childResource = arrList[0];
    if(childResource) {
      arr.push({
        name: String(index),
        entry: childResource,
        render,
        activeRule: genActiveRule(`${childRootRouter}`),
        props: data
      })
    }
    return arr;
  }, [])
  registerMicroApps(
    appList,
    {
      beforeLoad: [
        (app) => {
          // TODO 进行权限校验
          console.log("before load", app);
          return new Promise((resolve) => {
            resolve({})
          })
        },
      ],
      beforeMount: [
        (app) => {
          console.log("before mount", app);
          return new Promise((resolve) => {
            resolve({})
          })
        },
      ],
      afterUnmount: [
        (app) => {
          console.log("after unload", app);
          return new Promise((resolve) => {
            resolve({})
          })
        },
      ],
    }
  );
  
}

export default registerMicroAppsByMenu;