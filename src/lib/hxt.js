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
const ZH_CN_JSON = require('./locales/zh-CN.json')
window.$hxt_ele_list_page = (params, options) => {
  // 引入本地json
  if (params && typeof params === 'object') {
    const { desc = '' } = params
    const matchLangVal =(elementUILang === langList['ZH_CN'] ? ZH_CN_JSON[desc] : EN_US_JSON[desc]) || desc
    return !options ? matchLangVal : renderString(matchLangVal, options) || desc
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
