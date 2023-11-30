const langList = {
  ZH_CN: 'zh-CN',
  EN: 'en',
}

let elementUILang
try {
  elementUILang =
    langList[localStorage.getItem('hxlang') || 'ZH_CN'] || langList['ZH_CN']
} catch (e) {
  elementUILang = langList['ZH_CN']
}
const EN_US_JSON = require('./locales/en-US.json')
window.$hxt_ele_list_page = (params, options) => {
  // 引入本地json
  if (params && typeof params === 'object') {
    const { desc = '' } = params
    if (elementUILang === langList['ZH_CN']) {
      return desc
    } else {
      // 执行匹配
      const matchLangVal = EN_US_JSON[desc] || desc
      if (!options) {
        return matchLangVal
      } else {
        return renderString(matchLangVal, options) || desc
      }
    }
  } else {
    return ''
  }
}

// 替换字符串中的参数
function renderString(str, params = {}) {
  function isEmpty(val) {
    return !val && val !== 0
  }

  if (isEmpty(str)) return ''
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] || match || ''
  })
}
