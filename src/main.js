import Vue from 'vue'
import App from './App.vue'
import EleListPage from './lib/index.js'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
Vue.use(EleListPage);
import './styles/index.scss'
// demo页面

import loadDirective from './directives.js'
// 注册指令
loadDirective(Vue)

new Vue({
  el: '#app',
  render: h => h(App)
})
