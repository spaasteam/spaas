export default {
  name: 'RenderBread',
  functional: true,
  props: {
    render: Function,
    data: Object,
    node: Array,
  },
  render: (h, ctx) => {
    const params = {
      data: ctx.props.data,
    };
    return ctx.props.render(h, params);
  },
};
