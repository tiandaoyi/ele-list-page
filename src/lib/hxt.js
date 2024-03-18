const langList = {
  ZH_CN: 'zh-CN',
  EN: 'en',
  TH: 'th',
}

let elementUILang, lang
try {
  lang = localStorage.getItem('hxlang') || 'ZH_CN'
  elementUILang = langList[lang]
} catch (e) {
  lang = 'ZH_CN'
  elementUILang = langList[lang]
}

const matchData = require(`./locales/${elementUILang}.json`)

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
