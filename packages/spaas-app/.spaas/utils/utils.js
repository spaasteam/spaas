/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-05 14:24:09
 * @LastEditTime: 2019-08-12 14:10:55
 * @LastEditors: Please set LastEditors
 */
/**
 * @description 防抖
 * @param {Function}  callback
 * @param {Number}  时间间隔 默认500ms
 * @param {Boolean}  是否立即开始
 * @example
 * @return {Function}
 */
export function debounce(func, wait = 500, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * @description 节流函数
 * @param {function} 函数
 * @param {Number} 延迟时间 默认500ms
 * @example
 * @return {Function}
 */
export function throttle(fn, delay = 500) {
  let now, lastExec, timer, context, args; //eslint-disable-line

  const execute = function() {
    fn.apply(context, args);
    lastExec = now;
  };

  return function() {
    context = this;
    args = arguments;

    now = Date.now();

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (lastExec) {
      const diff = delay - (now - lastExec);
      if (diff < 0) {
        execute();
      } else {
        timer = setTimeout(() => {
          execute();
        }, diff);
      }
    } else {
      execute();
    }
  };
}

/**
 * @description: 睡眠函数
 * @param {Number}  等待时间，默认500ms
 */
export function sleep(time = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

/**
 * @description: 深层拷贝
 * @param {Object} 对象
 * @example
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @description:扁平化数组
 * @param {Array} 多维数组
 * @return {Array} 一维数组
 */
export function flatArray(data, expandAll, parent = null, level = null) {
  let tmp = [];
  data.forEach((record, i) => {
    record._expanded = record._expanded === undefined ? expandAll : true;
    if (level !== undefined && level !== null) {
      record.level = level !== undefined && level !== null ? level + 1 : 0;
    }
    record.sort = i;
    if (!!parent) {
      record.path = `/${parent.id}/${record.id}`;
      record.parentId = parent.id;
    } else {
      record.parent = '';
      record.parentId = 0;
      record.path = `/${record.id}`;
    }
    tmp.push(record);
    if (record.children && record.children.length > 0) {
      const children = flatArray(record.children, expandAll, record, record.level);
      tmp = tmp.concat(children);
    }
  });
  return tmp;
}

/**
 * @description 一维数组格式转化为tree格式
 * @param {Array}  一维数组
 * @return {Array} 多维数组
 */
export function arrayToTree(treeArray) {
  const r = [],
    tmpMap = {};

  for (let i = 0, l = treeArray.length; i < l; i++) {
    // 以每条数据的id作为obj的key值，数据作为value值存入到一个临时对象里面
    tmpMap[treeArray[i].id] = treeArray[i];
  }

  for (let i = 0, l = treeArray.length; i < l; i++) {
    const key = tmpMap[treeArray[i].parentId];

    // 循环每一条数据的pid，假如这个临时对象有这个key值，就代表这个key对应的数据有children，需要Push进去
    if (key) {
      if (!key.children) {
        key.children = [];
        key.children.push(treeArray[i]);
      } else {
        key.children.push(treeArray[i]);
      }
    } else {
      // 如果没有这个Key值，那就代表没有父级,直接放在最外层
      r.push(treeArray[i]);
    }
  }
  return r;
}

/**
 * @description: 递归获得所有层级
 */
export function getAllLevel(id, array = []) {
  const result = [],
    element = array.find(item => item.id === id) || {};
  result.unshift(element);
  if (element.parentId) {
    result.unshift(...getAllLevel(element.parentId, array));
  }
  return result;
}

/**
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 * @param {Object}  对象
 * @param {Object}  对象
 */
export function objEqual(obj1, obj2) {
  const keysArr1 = Object.keys(obj1),
    keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) return false;
  if (keysArr1.length === 0 && keysArr2.length === 0) return true;
  return !keysArr1.some(key => obj1[key] !== obj2[key]);
}

/**
 * @description:获取数组集(传入数组ID)
 * @param {Array} 数组1
 * @param {Array} 数组2
 * @param {Boolean} true / false
 * @return {Array} isIntersection = true 返回数组差集 / false 返回数组交集
 */

export function difference(arr1, arr2, isIntersection = false) {
  const val = new Set(arr2);
  return [...arr1.filter(v => (isIntersection ? !val.has(v) : val.has(v)))];
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ` ${cls}`;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`);
    ele.className = ele.className.replace(reg, ' ');
  }
}

/**
 * 把目标url转换为绝对url，
 * @param target
 */
export function transformOutsideLink(target) {
  const urlPattern = /^https?:\/\//i;

  if (urlPattern.test(target)) {
    return target;
  } else if (target.indexOf('www') > -1) {
    return `http://${target}`;
  }

  // 以相对路径替换原url
  const pathnameArr = location.pathname.split('/');
  let preUrl = location.origin;
  for (let i = 0; i < pathnameArr.length - 1; i++) {
    if (pathnameArr[i].indexOf('.html') !== -1) {
      break;
    } else {
      preUrl = `${preUrl}/${pathnameArr[i]}`;
    }
  }
  return `${preUrl}${target}`;
}

export function detectOS() {
  const isWin = navigator.platform == 'Win32' || navigator.platform == 'Windows';
  const isMac =
    navigator.platform == 'Mac68K' ||
    navigator.platform == 'MacPPC' ||
    navigator.platform == 'Macintosh' ||
    navigator.platform == 'MacIntel';
  if (isMac) return 'Mac';
  const isUnix = navigator.platform == 'X11' && !isWin && !isMac;
  if (isUnix) return 'Unix';
  const isLinux = String(navigator.platform).indexOf('Linux') > -1;
  if (isLinux) return 'Linux';
  if (isWin) return 'Win';
  return 'other';
}
