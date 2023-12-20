// import Vue from 'vue'
import EleListPage from './list/List';
import ListTable from './list/ListTable';
import './hxt'
import loadDirective from '../directives'

EleListPage.install = function(Vue) {
  loadDirective(Vue)

  Vue.component(EleListPage.name, EleListPage)
  Vue.component(ListTable.name, ListTable)

  Vue.prototype.$hxt_ele_list_page = window.$hxt_ele_list_page
}

export default EleListPage;
