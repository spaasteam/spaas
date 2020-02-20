import Vue from 'vue';
import dayjs from 'dayjs';
import {MessageBox, MessageBoxCenter} from '@femessage/element-ui';
import '@/icons/index';
import processConst from './process';

const formatTime = (val, format = 'YYYY-MM-DD HH:mm:ss') => {
  return val ? dayjs(val).format(format) : '';
};

const find = (options = [], condtionFn) => options.find(item => condtionFn(item));

const getLabel = (list, value) => {
  const data = find(list, i => i.value === parseInt(value, 10));
  return data ? data.label : '未知';
};

const formValidate = function formValidate(form) {
  return new Promise((resolve, reject) => {
    if (!form) return reject(new Error('form 没有定义'));

    form.validate(validate => {
      if (!validate) return reject();

      return resolve();
    });
  });
};

const makeStrToObject = str => {
  let result;
  if (typeof str === 'string') {
    result = JSON.parse(str);
  }
  if (typeof result === 'string') {
    return makeStrToObject(result);
  }
  return result;
};


const jsonFormat = json => {
  try {
    if (!json) return `<span class="not-data">暂无数据</span>`;
    json = JSON.stringify(makeStrToObject(json), undefined, 2);
    json = json
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>');
    return {
      text: json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        match => {
          let cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return `<span class="${cls}">${match}</span>`;
        },
      ),
      notJson: false,
    };
  } catch (error) {
    return {
      text: json
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\\t\\r/g, '')
        .replace(/\\n/g, '<br>')
        .replace(/\\"/g, '"'),
      notJson: true,
    };
  }
};

export default function({store}) {
  Vue.mixin({
    computed: {
      appId() {
        return store.state.app.appId;
      },
      appData() {
        return store.state.app.appData;
      },
    },
    watch: {
      appId: {
        handler(val) {
          this.$nextTick(() => {
            val && this.handleAppIdChange && this.handleAppIdChange(this.appData);
          });
        },
        immediate: true,
      },
    },
    filters: {
      formatTime,
      processEnum(val, listKey) {
        return getLabel(processConst[listKey], val);
      },
    },
    methods: {
      formatTime,
      getLabel,
      formValidate,
      jsonFormat
    },
  });

  /**
   * @param() title 标题
   * @param() text 文本文案
   * @param() confirm 传入的 promise
   *
   * 解决的问题:
   *    confirm 是 element-ui 的一个 确认消息(messageBox) 消息组件
   * 但是我们一般会在用户交互问答后发送请求，此时该组件原本没有提供 loading 接口，故制作一个满足业务需求的 confirm
   */
  Vue.prototype.$loadingConfirm = function f({
    title,
    text,
    confirm,
    confirmButtonText = '确定',
    cancelButtonText = '取消',
    type = 'warning',
  }) {
    if (typeof confirm !== 'function') {
      throw new Error('confirm must be function');
    }
    return MessageBox.confirm(text, title, {
      confirmButtonText,
      cancelButtonText,
      type,
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          const handleClose = () => {
            instance.confirmButtonLoading = false;
            done();
          };
          instance.confirmButtonLoading = true;
          Promise.resolve(confirm()).finally(handleClose);
        } else {
          return done();
        }
      },
    }).catch(() => {});
  };
}

Vue.prototype.$alert = MessageBoxCenter.alert;

