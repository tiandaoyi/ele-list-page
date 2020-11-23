import Vue from 'vue'
let MyDirective = {}
export default MyDirective.install = function(vue, options) {
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
}