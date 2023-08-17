import { initLocale } from "./js_sdk/locale/src/base-locale.js" ;
import utils from "./js_sdk/index.js" ;
import * as allRequests from "./api" ;

const install = (Vue , payload = {}) => {
  uni.$utils = utils ;  // 挂载对象
  Vue.prototype.$utils = utils;  // 挂载对象

  // 挂载接口
  utils.deepMerge(uni.$utils, allRequests);
  if (payload) {
    payload.api && utils.deepMerge(uni.$utils, payload.api);
  }
}

export default {
  install,
  initLocale
}
