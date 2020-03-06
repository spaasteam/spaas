const fs = require('fs');
const path = require('path');
console.log(111111111111);
function mkdirs(pathname, data, callback) {
  // 需要判断是否是绝对路径(避免不必要的bug)
  pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname);
  // 获取相对路径
  pathname = path.relative(__dirname, pathname);
  const floders = pathname.split(path.sep); // path.sep 避免平台差异带来的bug
  let pre = '';
  floders.forEach(floder => {
    try {
      // 没有异常，文件已经创建，提示用户改文件已经创建
      const _stat = fs.statSync(path.join(__dirname, pre, floder));
      const hasMkdir = _stat && _stat.isDirectory();

      // 文件创建后,进行写入数据
      hasMkdir && fs.writeFile(floder, data);

      if (hasMkdir) {
        callback && callback(`文件${floder}已经存在，不能重复创建，请重新创建`);
      }
    } catch (error) {
      // 抛出异常，文件不存在则创建文件
      try {
        // 避免父文件还没有创建的时候先创建子文件所出现的意外bug,这里选择同步创建文件
        fs.mkdirSync(path.join(__dirname, pre, floder));
        callback && callback(null);
      } catch (error) {
        callback && callback(error);
      }
    }
    pre = path.join(pre, floder); // 路径拼合
  });
}

console.log('我看看2', fs);
module.exports = mkdirs;

/**
 * @description: 
 1.启动mkdir.js
 2.通过读取环境变量去决定是否生成文件
 3.通过http去调取接口，拿数据，然后生成文件
 4.每次启动时，都需要判断文件，是否存在，如果存在则不执行，如果不存在则执行
 */
