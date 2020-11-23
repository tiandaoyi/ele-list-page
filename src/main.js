import Vue from 'vue'
import App from './App.vue'
import EleListPage from './lib/index.js'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
Vue.use(EleListPage);
import './styles/index.scss'
// demo页面

// import directives from './directives.js'
// 全局注册指令
// Vue.use(directives)
new Vue({
  el: '#app',
  render: h => h(App)
})
