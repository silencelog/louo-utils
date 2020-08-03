/**
 * Pants module.
 * @module Url
 * @see module:Url
 */

/**
 * [formatParams 对象转化成url参数字符串格式]
 * @param  {Object} o [description]
 * @param  {String} j [description]
 * @return {String}      [description]
 */
function formatParams (o, j = '&') {
  const arr = []
  for (const key in o) {
    if (!o[key] && o[key] !== 0) continue
    arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(o[key])))
  }
  return arr.join(j)
}

/**
 * [getQueryString 获取参数值]
 * @param  {String} name [参数名]
 * @param  {Object} param [{url:要截取的字符串, reg:结果匹配的正则}]
 * @return {String}      [参数值]
 */
function getQueryString (name, param = {}) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let result = ''
  let url = ''
  if (!param.url) {
    url = window.location.search ? window.location.search.substr(1) : window.location.href.replace(/.*\?/, '')
  } else {
    url = param.url.replace(/.*\?/, '')
  }
  result = url.match(reg)
  if (result !== null) {
    const value = decodeURIComponent(result[2])
    if (param.reg) {
      const vreg = new RegExp(param.reg)
      const val = value.match(vreg)
      if (val !== null) return val[0]
      return null
    }
    return value
  }
  return null
}

/**
 * [loadScript 异步加载script文件]
 * @param  {String} url [description]
 * @return {Promise}   [description]
 */
async function loadScript (url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = resolve
    script.onerror = reject
    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(script, firstScript)
  })
}

export { formatParams, getQueryString }
