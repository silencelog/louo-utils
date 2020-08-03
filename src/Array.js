/**
 * Pants module.
 * @module Array
 * @see module:Array
 */

/**
 * [clone 深拷贝]
 * @param  {Array} a [description]
 * @return {Array}   [description]
 */
function clone (a) {
  return [].concat(a)
}

/**
 * [unique 数组去重]
 * @param  {Array} a [description]
 * @param  {String} key [description]
 * @return {Array}   [description]
 */
function unique (a, key) {
  if (key) {
    const arr = []
    const map = {}
    for (let i = 0; i < a.length; i++) {
      if (map[a[i][key]]) continue
      arr.push(a[i])
      map[a[i][key]] = 1
    }
    return arr
  } else {
    return Array.from(new Set(a))
  }
}

/**
 * [upset 随机排序]
 * @param  {Array} a [description]
 * @return {Array}     [description]
 */
function upset (a) {
  return a.sort(function () { return Math.random() - 0.5 })
}

/**
 * [randomOne 随机选取]
 * @param  {Array} a [description]
 * @return {Object}     [description]
 */
function randomOne (a) {
  return a[Math.floor(Math.random() * (a.length >>> 0))]
}

/**
 * [reduce 对累加器和数组中的每个元素（从左到右）应用一个函数，将其减少为单个值]
 * @param  {Array}   a   [description]
 * @param  {Function} fn  [description]
 * @param  {*}   [sum] [description]
 * @return {*}       [description]
 */
function reduce (a, fn, sum) {
  let value
  const len = a.length >>> 0; let i = 0; const o = Object(a)
  if (arguments.length >= 3) {
    value = arguments[2]
  } else {
    while (i < len && !(i in o)) {
      i++
    }
    if (i >= len) {
      throw new TypeError('Reduce of empty array with no initial value')
    }
    value = o[i++]
  }
  while (i < len) {
    if (i in o) {
      value = fn(value, o[i], i, o)
    }
    i++
  }
  return value
}

/**
 * [object 数组转对象]
 * @param  {Array} a [description]
 * @param  {(String|Function)} fn [description]
 * @param  {String} children [description]
 * @return {Object}   [description]
 */
function object (a, fn, children) {
  const obj = {}
  if (!fn) return obj
  if (typeof fn === 'string') {
    const k = fn
    fn = function (o, v, i) {
      o[v[k]] = v
      return v
    }
  }
  if (typeof fn === 'function') {
    for (let i = 0; i < (a.length >>> 0); i++) {
      fn(obj, a[i], i)
      if (children && a[i][children]) {
        Object.assign(obj, object(a[i][children], fn, children))
      }
    }
  }
  return obj
}

/**
 * TODO 是否保留,优化
 * [selected 取出对象数组符合条件的数组]
 * @param  {Array}  a  [description]
 * @param  {String}  k  [description]
 * @param  {Boolean} eq [description]
 * @return {Array}     [description]
 */
function selected (a, k, eq = true) {
  const arr = []
  if (!k) return arr
  for (let i = 0; i < (a.length >>> 0); i++) {
    const item = a[i]
    if (item[k] === eq) arr.push(item)
  }
  return arr
}

/**
 * [toggle 判断一个值是否存在，有则删除无则添加]
 * @param  {Array}   a  [description]
 * @param  {*}   o  [description]
 * @param  {Function} [fn] [description]
 * @return {Array}      [description]
 */
function toggle (a, o, fn) {
  if (!o) return
  if (!fn || typeof fn !== 'function') fn = function (o, v) { return o === v }
  for (let i = 0; i < (a.length >>> 0); i++) {
    const item = a[i]
    if (fn.bind(a, o, item, i)()) {
      a.splice(i, 1)
      return a
    }
  }
  a.push(o)
  return a
}

/**
 * [findIndex 数组中查找某个值的下标]
 * @param  {Array}   a  [description]
 * @param  {*} fn [description]
 * @return {Number}      [description]
 */
function findIndex (a, fn) {
  const len = a.length >>> 0
  if (typeof fn === 'function') {
    for (let i = 0; i < len; i++) {
      if (fn(a[i])) return i
    }
  } else {
    for (let i = 0; i < len; i++) {
      if (a[i] === fn) return i
    }
  }
  return -1
}

/**
 * [indexOf 查找值在数组中的位置]
 * @param  {Array} a [description]
 * @param  {String} s [description]
 * @return {Number}   [description]
 */
function indexOf (a, s) {
  for (let i = 0; i < (a.length >>> 0); i++) {
    if (a[i] === s) {
      return i
    }
  }
  return -1
}

/**
 * [find 数组中查找某个值]
 * @param  {Array}   a  [description]
 * @param  {*} fn [description]
 * @return {*}      [description]
 */
function find (a, fn) {
  const i = findIndex(a, fn)
  return i > 0 ? a[i] : null
}

/**
 * [combine 去重合并]
 * @return {Array} [description]
 */
function combine () {
  const arr = [].concat.apply([], arguments)
  return unique(arr)
}

/**
 * TODO 待优化
 * [group 数组分组，返回对象]
 * @param  {Array} arr   [description]
 * @param  {String} field [description]
 * @param  {(String|Object|Array)} sort  [排序字段：asc:true desc:false]
 * @return {Object}       [description]
 */
function group (arr, field, sort) {
  const obj = {}
  if (!field) return obj
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    if (item._$data) {
      item = item.toJSON()
    }
    let v = obj[item[field]]
    if (!v) {
      v = []
      obj[item[field]] = v
    }
    v.push(item)
  }
  if (!sort) return obj
  let by = 'asc'
  let order = field
  let orderFn
  if (typeof sort === 'string') {
    order = sort
  } else if (typeof sort === 'object') {
    order = sort.order
    by = sort.by
  } else {
    orderFn = sort
  }
  for (const k in obj) {
    obj[k].sort((v1, v2) => {
      if (orderFn) {
        return orderFn.call(arr, v1, v2)
      } else {
        if (by === 'asc') {
          return v1[order] - v2[order]
        } else {
          return v2[order] - v1[order]
        }
      }
    })
  }
  return obj
}

export { clone, unique, upset, randomOne, reduce, object, selected, toggle, findIndex, indexOf, find, group }
