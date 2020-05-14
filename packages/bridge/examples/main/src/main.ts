import Vue from "vue";

import { start } from "qiankun";

import render from "./render";

Vue.config.productionTip = false;

function initApp() {
  render({ appContent: "", loading: true });
}

initApp();

// setDefaultMountApp('#/react');

start({ prefetch: true });
