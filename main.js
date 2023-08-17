import App from './App'
import uView from '@/uni_modules/uview-ui'
import kjfMall from 'uni_modules/kjf-mall';
Vue.use(uView)
Vue.use(kjfMall); // 初始化全局配置

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
