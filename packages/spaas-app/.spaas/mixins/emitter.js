function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.componentName;
    if (name === componentName) {
      child.$emit(...[eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}

export default {
  methods: {
    /**
     * @description:  从下到上派发(子组件向父组件)
     * @param {componentName} 组件名字
     * @param {eventName} 事件名
     * @param {params}   传入 参数
     */
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit(...[eventName].concat(params));
      }
    },
    /**
     * @description:  向下派发事件(父组件向子组件)
     * @param {componentName} 组件名字
     * @param {eventName} 事件名
     * @param {params}   传入 参数
     */
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
  },
};
