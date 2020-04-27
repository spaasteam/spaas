require('dotenv').config()

import Vue from "vue";
// registerMicroApps,
// setDefaultMountApp
import "./plugins/element";
import "./plugins/icon-font";

import { start } from "qiankun";

import render from "./render";

Vue.config.productionTip = false;

function initApp() {
  render({ appContent: "", loading: true });
}

initApp();

// setDefaultMountApp('#/react');

start({ prefetch: true });
