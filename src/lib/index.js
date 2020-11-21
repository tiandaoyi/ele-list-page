import Vue from 'vue'
import EleListPage from './list/List';
import directives from '../directives'
// 全局注册指令
Vue.use(directives)
EleListPage.install = function(Vue) {
    Vue.component(EleListPage.name, EleListPage);
}

export default EleListPage;
