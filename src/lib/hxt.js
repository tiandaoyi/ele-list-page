// 当前的组件库支持的语言
const langList = {
  ZH_CN: 'zh-CN',
  EN: 'en',
  TH: 'th',
}
// 匹配的数据
let matchData = ''

// hxlang 初始化中文托底
function setMatchData (hxlang = localStorage.getItem('hxlang') || 'ZH_CN') {
  // // 如果有hxlang参数，但是不在支持的语言列表中，则默认为英文
  matchData = require(`./locales/${langList[hxlang] || 'en'}.json`)
}

setMatchData()

window.asyncComponentInit.push(fn)

window.$hxt_ele_list_page = (params, options) => {
  // 引入本地json
  if (params && typeof params === 'object') {
    const { desc = '' } = params
    const matchLangVal = matchData[desc] || desc
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
