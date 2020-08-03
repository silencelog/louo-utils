/**
 * Pants module.
 * @module Number
 * @see module:Number
 */

/**
 * [pow 返回x的y次幂的值]
 * @param  {Number} x [底数]
 * @param  {Number} y [幂数]
 * @return {Number}   [description]
 */
function pow (x=10, y) {
  return Number(Math.pow(x, y).toFixed(Math.abs(y)))
}

/**
 * [mul 乘法]
 * @param  {Number} x [被乘数]
 * @param  {Number} y [乘数]
 * @return {Number}   [description]
 */
function mul (x, y) {
  let decimal = 0
  let _x = x.toString()
  let _y = y.toString()
  try {
    decimal += (_x.split('.')[1] || '').length
    decimal += (_y.split('.')[1] || '').length
  } catch (e) {
    console.log(e)
  }
  return Number(_x.replace('.', '')) * Number(_y.replace('.', '')) / pow(10, decimal)
}

/**
 * [div 除法]
 * @param  {Number} x [被除数]
 * @param  {Number} y [除数]
 * @return {Number}   [description]
 */
function div (x, y) {
  let decimal = 0
  let _x = x.toString()
  let _y = y.toString()
  decimal = (_y.split('.')[1] || '').length - (_x.split('.')[1] || '').length
  return mul(Number(_x.replace('.', '')) / Number(_y.replace('.', '')), pow(10, decimal))
}

/**
 * [add 加法]
 * @param  {Number} x [被加数]
 * @param  {Number} y [加数]
 * @return {Number}   [description]
 */
function add (x, y) {
  let decimal = 0
  let _x = x.toString()
  let _y = y.toString()
  decimal = pow(10, Math.max((_x.split('.')[1] || '').length, (_y.split('.')[1] || '').length))
  return (mul(Number(x), decimal) + mul(Number(y), decimal)) / decimal
}

/**
 * [sub 减法]
 * @param  {Number} x [被减法]
 * @param  {Number} y [减法]
 * @return {Number}   [description]
 */
function sub (x, y) {
  let decimal = 0
  let _x = x.toString()
  let _y = y.toString()
  decimal = pow(10, Math.max((_x.split('.')[1] || '').length, (_y.split('.')[1] || '').length))
  return (mul(Number(x), decimal) - mul(Number(y), decimal)) / decimal
}

/**
 * [是否偶数]
 * @param  {Number}  v [description]
 * @return {Boolean}   [description]
 */
function isEven (v) {
  return v % 2 === 0
}

/**
 * [校验数字是否越界]
 * @param  {Number} v [description]
 * @return {Boolean}     [description]
 */
function checkBoundary (v) {
  if (v > Number.MAX_SAFE_INTEGER || v < Number.MIN_SAFE_INTEGER) {
    console.warn(`${v} is beyond boundary when transfer to integer, the results may not be accurate`)
    return true
  }
  return false
}

/**
 * [保留小数位]
 * @param  {Number} v       [description]
 * @param  {Number} decimal [description]
 * @return {String}         [description]
 */
function toFixed (v, decimal) {
  return Number((parseInt(v * Math.pow(10, decimal) + 0.5) / Math.pow(10, decimal) + '').toFixed(decimal))
}

/**
 * [千分位格式化]
 * @param  {Number|String} v [description]
 * @param  {Number} n [保留小数点后几位]
 * @return {String}   [description]
 */
function thousands (v, n) {
  let s = ('' + v).split('.')
  let d = s.length > 1 ? '.' + (n > -1 ? s[1].substring(0, n) : s[1]) : ''
  return s[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + d
}

/**
 * [矫正浮点数误差]
 * @param  {Number} v       [需要矫正的数]
 * @param  {Number} precision [精度]
 * @return {Number}           [description]
 */
function strip (v, precision = 2) {
  return +parseFloat(v.toPrecision(precision))
}

/**
 * [upDigit 数字大写]
 * @param  {Number} v [description]
 * @return {String}   [description]
 */
function capital (v) {
  const fraction = ['角', '分', '厘']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
  v = Math.abs(v)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(v * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  v = Math.floor(v)
  for (let i = 0; i < unit[0].length && v > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && v > 0; j++) {
      p = digit[v % 10] + unit[1][j] + p
      v = Math.floor(v / 10)
    }
    s = p + unit[0][i] + s
  }
  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
}

/**
 * [randomNumber 随机返回指定范围内的整数]
 * @param  {Number} min [最小值,只有一个参数时该参数为最大值，最小值为0]
 * @param  {Number} max [最大值]
 * @return {Number}    [指定范围内的整数]
 */
function randomNumber (min = 0, max = 255) {
  if (arguments.length === 1) {
    return Math.round(Math.random() * min)
  } else {
    return Math.round(min + Math.random() * (max - min))
  }
}

/**
 * [numberFormatter 数字格式化]
 * @param  {Number} num    [description]
 * @param  {Number} digits [description]
 * @return {String}        [description]
 */
function numberFormatter (num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export { pow, mul, div, add, sub, isEven, checkBoundary, toFixed, strip, capital, randomNumber, thousands, numberFormatter }
