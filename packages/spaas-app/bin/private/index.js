require('dotenv').config();
const request = require('request');
const TagList = require('./tagList');
const fs = require('fs');

// 文件配置
const fileName = 'config.js';
const filePath = './';
const fileConfig = `${filePath}/${fileName}`;

if (process.env.BUILD_TYPE !== 'private') {
  return;
}

/**
 * @description: 接口参数
 */
const opt = {
  host: process.env.API_SERVER,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.Authorization}`,
  },
};

/**
 * @description: 请求方式
 */
const axios = async function(method = 'get', params = {}) {
  return new Promise((resolve, reject) => {
    request[method](params, function(err, httpResponse, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
};

/**
 * @description: 获取产品列表
 */
function getProducts() {
  const data = axios('get', {
    ...opt,
    url: `${process.env.API_SERVER}${process.env.PRODUCTS_PATH}`,
  });
  return data;
}

/**
 * @description: 获取菜单列表
 */
function getAppMenus() {
  const data = axios('get', {
    ...opt,
    url: `${process.env.API_SERVER}${process.env.MEMUS_PATH}`,
  });
  return data;
}

/**
 * @description:  判断文件是否存在
 */

function getStat(path) {
  return new Promise(resolve => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    });
  });
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
async function dirExists(dir) {
  const isExists = await getStat(dir);
  // 如果该路径且不是文件，返回true
  if (isExists && isExists.isDirectory()) {
    return true;
  } else if (isExists) {
    // 如果该路径存在但是文件，返回false
    return false;
  }
}

/**
 * @description: 同步执行接口
 */
async function handlePromise() {
  const hasMkdir = await dirExists(filePath);
  const getValue = await getProducts();
  const getMenu = await getAppMenus();

  // 静态data
  const template = `
//获取应用列表
export const appList = ${TagList}

//产品列表
export const productList = ${getValue}

//菜单列表
export const menuList = ${getMenu}
  `;
  hasMkdir &&
    fs.writeFile(fileConfig, template, err => {
      if (err) return console.log(err);
    });
}

// 自动创建文件并生成静态文件

process.env.BUILD_TYPE === 'private' && handlePromise();
