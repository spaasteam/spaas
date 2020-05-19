require('dotenv').config()

import Vue from "vue";
// registerMicroApps,
// setDefaultMountApp
import '../views/index';
import "./plugins/element";

import { start } from "qiankun";

import render from "./render";

Vue.config.productionTip = false;

function initApp() {
  render({ appContent: "", loading: true });
}

initApp();

// setDefaultMountApp('#/react');

start({ prefetch: true });
