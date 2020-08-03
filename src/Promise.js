/**
 * Pants module.
 * @module Promise
 * @see module:Promise
 */

!Promise.prototype.finally && (Promise.prototype.finally = function (callback) { return this.then(callback).catch(callback) })

/**
 * [concurrent 每几个promise同时并发执行]
 * @param  {Array}    arr   [description]
 * @param  {Function} fn    [description]
 * @param  {Number}   limit [description]
 * @param  {Function} callback [description]
 * @return {Null}         [description]
 */
async function concurrent (arr, fn, limit = 5, callback) {
  let ps = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    ps.push(fn.bind(this, item, i, arr)())
    if ((i !== 0 && (i + 1) % limit === 0) || i === (arr.length - 1)) {
      const result = await Promise.all(ps)
      callback && typeof callback === 'function' ? callback.call(this, item, i, arr) : Promise.resolve(item, i, arr)
      ps = []
    }
  }
}

/**
 * [limit promise并发几个进程轮询执行]
 * @param  {Array}   arr      [description]
 * @param  {Function} fn       [description]
 * @param  {Number}   limit    [description]
 * @param  {Function} callback [description]
 * @return {Null}            [description]
 */
async function limit (arr, fn, limit = 5, callback) {
  let max = 0
  let dones = 0
  let next = 0
  function run (item, i) {
    next++
    if (next >= arr.length) return
    fn.bind(this, item, i, arr)().then(() => {
      return callback && typeof callback === 'function' ? callback.call(this, item, i, arr) : Promise.resolve(item, i, arr)
    }).catch(err => {
      throw new Error(err)
    }).finally(() => {
      console.log('next', next, arr.length)
      dones = dones + 1
      if (next < arr.length) {
        run(arr[next], next)
      }
    })
  }
  arr.slice(0, limit).forEach((item, i) => {
    run(item, i)
  })
}

export { concurrent, limit }
