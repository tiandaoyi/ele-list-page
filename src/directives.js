export default (Vue, options) => {
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
    },
    inserted(el) {
      const isTextOverflowed = el.scrollWidth > el.clientWidth
      if (!isTextOverflowed) {
        el.removeAttribute('has-overflows')
      } else {
        el.setAttribute('has-overflows', '')
      }
      // 监听该dom的鼠标悬浮
      el.addEventListener('mouseenter', function() {
        if (el.getAttribute('has-overflows') === null) return
        const zIndex = window.getComputedStyle(el).zIndex
        const { bottom, left, width, height } = el.getBoundingClientRect()
        const tooltipValue = el.textContent
        const tooltipDom = document.createElement('div')
        tooltipDom.className = 'tooltip'
        tooltipDom.textContent = tooltipValue
        // 批量设置样式
        Object.assign(tooltipDom.style, {
          top: `${bottom}px`,
          left: `${left}px`,
          position: 'fixed',
          'font-size': '12px',
          background: '#333',
          color: 'white',
          padding: '4px',
          'border-radius': '5px',
          width: `${width}px`,
          zIndex: (isNaN(Number(zIndex)) ? 0: Number(zIndex)) + 1,
        })
        // 底部追加小箭头
        const arrowDom = document.createElement('div')
        Object.assign(arrowDom.style, {
          position: 'absolute',
          top: '-4px',
          left: `${width / 2}px`,
          'border-left': '4px solid transparent',
          'border-right': '4px solid transparent',
          'border-bottom': '4px solid #333',
        })
        tooltipDom.appendChild(arrowDom)

        document.body.appendChild(tooltipDom)
      })
      // 监听该dom的鼠标离开
      el.addEventListener('mouseleave', function() {
        const tooltipDom = document.querySelector('.tooltip')
        tooltipDom && document.body.removeChild(tooltipDom)
      })
    },
  })
}
