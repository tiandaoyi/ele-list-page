// import Vue from 'vue'
import EleListPage from './list/List';
import ListTable from './list/ListTable';
import './hxt'
// import directives from '../directives'
// 全局注册指令
// Vue.use(directives)
EleListPage.install = function(Vue) {
  Vue.directive('loadMore', {
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
  Vue.directive("loadMoreInput", {
    bind(el, binding) {
      const selectDom = el.querySelector(
        ".el-select-dropdown .el-select-dropdown__wrap"
      );
      const inputDom = el.querySelector(
        ".el-input .el-input__inner"
      );
      let tempValue = ''
      inputDom.addEventListener("input", function(e) {
        tempValue = e.target.value
        binding.value && binding.value(tempValue, true);
      });
      selectDom.addEventListener("scroll", function() {
        const isEnd = this.scrollHeight - this.scrollTop <= this.clientHeight;
        if (isEnd) {
          binding.value && binding.value(tempValue, false);
        }
      });
    }
  })

  Vue.directive('tooltip', {
    bind(el, { value }) {
      el.textContent = value
      el.setAttribute('tooltip-value', value)
    },
    inserted(el) {
      const isTextOverflowed = el.scrollWidth > el.clientWidth
      if (!isTextOverflowed) {
        el.removeAttribute('has-overflows')
      } else {
        el.setAttribute('has-overflows', '')
      }
    },
    update(el) {
      const isTextOverflowed = el.scrollWidth > el.clientWidth
      if (!isTextOverflowed) {
        el.removeAttribute('has-overflows')
      } else {
        el.setAttribute('has-overflows', '')
      }
    },
  })

  Vue.component(EleListPage.name, EleListPage)
  Vue.component(ListTable.name, ListTable)

  Vue.prototype.$hxt_ele_list_page = window.$hxt_ele_list_page
}

export default EleListPage;
