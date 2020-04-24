import { registerMicroApps } from "qiankun";

import render from "./render";

function genActiveRule(routerPrefix) {
  return (location) => {
    console.error(location.hash);
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
        },
      ],
      beforeMount: [
        (app) => {
          console.log("before mount", app);
        },
      ],
      afterUnmount: [
        (app) => {
          console.log("after unload", app);
        },
      ],
    }
  );
  
}

export default registerMicroAppsByMenu;