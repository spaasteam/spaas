import Vue from 'vue';
import SvgIcon from '@/components/SvgIcon'; // svg component

// register globally
Vue.component('svg-icon', SvgIcon);

//包含了父级文件夹（包含子目录）下面
const req = require.context('../', true, /\.svg$/);

const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
