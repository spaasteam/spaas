import routeInfo from '@/const/route-info';
import meta from '@/const/meta';

export default ({app}) => {
  app.router.afterEach(to => {
    // 根据route-info.json生成title
    const curInfo = routeInfo[to.path];
    window.document.title = curInfo ? curInfo.title : meta.spaName;
  });
};
