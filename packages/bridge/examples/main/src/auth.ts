import { registerMicroApps, RegistrableApp, setDefaultMountApp  } from "qiankun";

import render from "./render";

function genActiveRule(routerPrefix: string) {
  return (location: Location): boolean => {
    const hashRouter = location.hash.split('?')[0];
    return hashRouter === routerPrefix || hashRouter.startsWith(`${routerPrefix}/`)
  };
}

interface IMenuItem {
  pathUrl: string;
  [propName: string]: any;
}
const registerMicroAppsByMenu = (menuList: IMenuItem[], data = {}) => {
  const appList = menuList.reduce((arr: RegistrableApp[], info, index) => {
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
        (app):any => {
          // TODO 进行权限校验
          console.log("before load", app);
        },
      ],
      beforeMount: [
        (app): any => {
          console.log("before mount", app);
        },
      ],
      afterUnmount: [
        (app): any => {
          console.log("after unload", app);
        },
      ],
    }
  );
  
}

setDefaultMountApp('#/nuxt');

export default registerMicroAppsByMenu;