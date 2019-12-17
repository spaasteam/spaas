import Vue from 'vue';
import dayjs from 'dayjs';
import { MessageBox } from '@femessage/element-ui';
import '@/icons/index';

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
    methods: {
      formatTime(value, format = 'YYYY-MM-DD HH:mm:ss') {
        return value ? dayjs(value).format(format) : '';
      },
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
