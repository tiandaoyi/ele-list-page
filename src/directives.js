import Vue from 'vue'
let MyDirective = {}
export default MyDirective.install = function(vue, options) {
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
  });

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
    // update(el) {
    //   const isTextOverflowed = el.scrollWidth > el.clientWidth
    //   if (!isTextOverflowed) {
    //     el.removeAttribute('has-overflows')
    //   } else {
    //     el.setAttribute('has-overflows', '')
    //   }
    // },
  })
}
