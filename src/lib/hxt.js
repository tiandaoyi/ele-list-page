const langList = {
  ZH_CN: 'zh-CN',
  EN: 'en',
  TH: 'th',
}

let elementUILang, lang
try {
  let supportLangList = ['ZH_CN', 'EN']
  // 在main.js顶部，设置项目支持的语言（可以不传中英文）
  // localStorage.setItem('supportLang', JSON.stringify(['TH'])) // 增加支持泰语
  if (localStorage.getItem('supportLang')) {
    const data = JSON.parse(localStorage.getItem('supportLang'))
    supportLangList = Array.from(new Set(arr.concat(data)))
  }
  lang = localStorage.getItem('hxlang') || 'ZH_CN' // 如果没有hxlang，默认语言是中文

  // 如果存在了不支持的语言，默认使用托底语言
  if (!supportLangList.includes(lang)) {
    lang = 'EN'
  }
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
