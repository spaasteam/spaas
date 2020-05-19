/* eslint-disable */
export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
};

export function renderThumbStyle({move, size, bar}) {
  const style = {};
  const translate = `translate${bar.axis}(${move}%)`;

  style[bar.size] = size;
  style['transform'] = translate;
  style['msTransform'] = translate;
  style['webkitTransform'] = translate;

  return style;
}

/* istanbul ignore next */
export const on = (function() {
  // @ts-ignore
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  }
  return function(element, event, handler) {
    if (element && event && handler) {
      element.attachEvent(`on${event}`, handler);
    }
  };
})();

/* istanbul ignore next */
export const off = (function() {
  // @ts-ignore
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  }
  return function(element, event, handler: any) {
    if (element && event) {
      element.detachEvent(`on${event}`, handler);
    }
  };
})();

function extend(to: any, _from: any) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
}

export function toObject(arr: Array<object>) {
  const res: object = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}
