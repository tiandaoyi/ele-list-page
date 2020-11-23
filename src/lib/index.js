// import Vue from 'vue'
import EleListPage from './list/List';
// import directives from '../directives'
// 全局注册指令
// Vue.use(directives)
EleListPage.install = function(Vue) {
  Vue.directive('loadmore', {
    bind (el, binding) {
      const selectDom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
      selectDom.addEventListener('scroll', function () {
        const isEnd = this.scrollHeight - this.scrollTop <= this.clientHeight
        if (isEnd) {
          binding.value && binding.value()
        }
      })
    }
  })
  Vue.component(EleListPage.name, EleListPage)
}

export default EleListPage;
