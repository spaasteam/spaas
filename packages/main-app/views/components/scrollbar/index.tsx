// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js
import {Vue, Component, Prop} from 'vue-property-decorator';

import {addResizeListener, removeResizeListener} from './utils/resize-event';
import scrollbarWidth from './utils/scrollbar-width';
import {toObject} from './utils/util';
import Bar from './bar';
import './index.less';

/* istanbul ignore next */
@Component({
  name: 'Scrollbar',
  components: {
    Bar,
  },
})
export default class Scrollbar extends Vue {
  @Prop({default: false}) horizontal?: boolean
  @Prop({default: true}) vertical?: boolean
  @Prop({default: ''}) wrapStyle?: object | string
  @Prop({default: '' }) wrapClass?: object | string
  @Prop({default: '' }) viewClass?: object | string
  @Prop({default: '' }) viewStyle?: object | string
  @Prop({default: true}) noresize?: boolean

  sizeWidth = '0'
  sizeHeight = '0'
  moveX = 0
  moveY = 0

  get wrap() {
    return this.$refs.wrap;
  }

  get slotsWrap(): HTMLDivElement {
    return this.$refs.slotsWrap as HTMLDivElement;
  }

  handleScroll() {
    const wrap:any = this.wrap;
    const slotsWrap = this.slotsWrap;

    this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
    this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;

    const bottomDistance = slotsWrap.clientHeight - wrap.scrollTop - wrap.clientHeight;
    const rightDistance = this.slotsWrap.clientHeight - wrap.scrollLeft - wrap.clientWidth;

    this.$emit('onScrollY', bottomDistance);
    this.$emit('onScrollX', rightDistance);
  }

  update() {
    const wrap:any = this.wrap;
    if (!wrap) return;

    const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
    const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

    this.sizeHeight = heightPercentage < 100 ? `${heightPercentage}%` : '';
    this.sizeWidth = widthPercentage < 100 ? `${widthPercentage}%` : '';
  }

  mounted() {
    this.$nextTick(this.update);
    !this.noresize && addResizeListener(this.$refs.slotsWrap, this.update);
  }

  beforeDestroy() {
    !this.noresize && removeResizeListener(this.$refs.slotsWrap, this.update);
  }


  render(h) {
    const gutter = scrollbarWidth();
    let style:any = this.wrapStyle;

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `${this.horizontal ? `margin-bottom: ${gutterWith}; ` : ''}${
        this.vertical ? `margin-right: ${gutterWith};` : ''
      }`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    const wrap = (
      <div
        ref="wrap"
        style={style}
        onScroll={this.handleScroll}
        class={[this.wrapClass, 'scrollbar__wrap', gutter ? '' : 'scrollbar__wrap--hidden-default']}
      >
        {
          <div class={['scrollbar__view', this.viewClass]} style={this.viewStyle} ref="resize">
            <div ref="slotsWrap">{this.$slots.default}</div>
          </div>
        }
      </div>
    );
    const nodes = [wrap];
    if (this.horizontal) {
      nodes.push(<bar move={this.moveX} size={this.sizeWidth} />);
    }
    if (this.vertical) {
      nodes.push(<bar vertical move={this.moveY} size={this.sizeHeight} />);
    }
    return h(
      'div',
      {
        class: 'scrollbar',
      },
      nodes,
    );
  }
} 
