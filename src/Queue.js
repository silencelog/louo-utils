import { isPromise, isFunction } from './Type'

/** 队列 */
class Queue {
  /**
   * 创建队列对象.
   * @param {Object} options - {"limit": "并发上限"}.
   */
  constructor (options={}) {
    // 并发上限
    this.limit = options.limit || 1
    // 任务队列
    this.list = []
    // 任务下标
    this.index = -1
    // 是否停止
    this.isStop = false
  }
  get isParallel () {
    return this.limit > 1
  }
  /**
   * [next 下一步]
   * @return {Object} [description]
   */
  next () {
    if (!this.isStop) {
      ++this.index
      if (this.index >= this.list.length) return
      let cur = this.list[this.index]
      if (isFunction(cur) || isPromise(cur)) {
        cur(this.next.bind(this))
      }
    }
    return this
  }
  /**
   * [add 添加异步回调]
   * @param {...Function|Promise} fns [description]
   * @return {Object} [队列本身]
   */
  add (...fns) {
    fns.forEach(function (v, i) {
      if (typeof v !== 'function') {
        throw new Error('is Not Function')
      }
    })
    this.list.push(...fns)
    return this
  }
  /**
   * [stop 停止队列执行]
   * @return {Object} [description]
   */
  stop () {
    this.isStop = true
    return this
  }
  /**
   * 没用
   * [retry 重试]
   * @return {Object} [description]
   */
  retry () {
    this.isStop = false
    this.run()
    return this
  }
  /**
   * [start 开始]
   * @return {Object} [description]
   */
  start () {
    this.isStop = false
    this.run()
    return this
  }
  /**
   * [restart 重新开始]
   * @return {Object} [description]
   */
  restart () {
    this.isStop = false
    this.index = -1
    this.run()
    return this
  }
  /**
   * [run 运行程序]
   * @param  {...Function|Promise} fns [description]
   * @return {Object}         [description]
   */
  run (...fns) {
    let limit = this.isParallel ? this.limit : 1
    for (let i = 0; i < limit; i++) {
      this.next()
    }
    return this
  }
  /**
   * TODO 优化支持继续，运行结果，重试
   * [runAll 全部直接运行]
   * @return {Object} [description]
   */
  runAll () {
    for (const fn of this.list) {
      this.next()
    }
    return this
  }
  /**
   * [clear 停止并且清空队列]
   * @return {Object} [description]
   */
  clear () {
    this.list = []
    this.index = -1
    this.isStop = false
  }
}

window && (window.Queue = Queue)

export default Queue
