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
          'line-height': '1.2',
          background: '#FFF',
          color: '#303133',
          padding: '10px',
          'border-radius': '4px',
          border: '1px solid #303133',
          'min-width': `${width}px`,
          'max-width': '50vw',
          zIndex: (isNaN(Number(zIndex)) ? 0: Number(zIndex)) + 1,
          'word-wrap': 'break-word',
        })
        // 底部追加小箭头
        const arrowDom = document.createElement('div')
        Object.assign(arrowDom.style, {
          position: 'absolute',
          top: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
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

  function addClass(el, className) {
    if (hasClass(el, className)) {
      return
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  }

  // 判断是否有class
  function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  }

  const addTip = function (labelList, vnode) {
    vnode.context.$nextTick(() => {
      if (labelList.length === 0) return
      if (window.hxlang === 'ZH_CN') return
      // 遍历labelList新增style:white-space:nowrap;overflow:hidden;text-overflow:ellipsis;样式,保留原有样式
      labelList.forEach((item) => {
        if (hasClass(item, 'fe-instruct-tip')) return
        addClass(item, 'fe-instruct-tip')
        item.style.cssText =
          'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' +
          item.style.cssText
        if (item.offsetWidth < item.scrollWidth) {
          const itemStr = item.outerHTML
          let str = item.innerText
          // 如果最后一个字符是:则去掉
          if (str[str.length - 1] === ':') {
            str = str.substring(0, str.length - 1)
          }
          const Tip = Vue.extend({
            template: `<el-tooltip content="${str}" effect="light">${itemStr}</el-tooltip>`,
          })
          new Tip({
            el: item,
          })
        }
      })
    })
  }

  const baseTip = {
    inserted: (el, _, vnode) => {
      vnode.context.$nextTick(() => {
        const labelList = el.querySelectorAll('th .cell')
        addTip(labelList, vnode)
      })
    },
    update: (el, _, vnode) => {
      vnode.context.$nextTick(() => {
        const labelList = el.querySelectorAll('th .cell:not(.fe-instruct-tip)')
        addTip(labelList, vnode)
      })
    },
  }

  Vue.directive('eleBaseTip', baseTip)
}
