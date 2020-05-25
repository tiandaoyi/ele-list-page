import Vue from 'vue'
import App from './App.vue'
import EleListPage from './lib/index.js'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
Vue.use(EleListPage);

// Vue.prototype.Mock = require('mockjs')

new Vue({
  el: '#app',
  render: h => h(App)
})
