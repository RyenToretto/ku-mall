import { isFn } from '../../validate'
import { getValue } from '../../config'

let frequency = getValue('frequency', { onceByOnce: 200, once: 200 })

/**
 * @description 防抖，函数在延时时间内只执行一次，如在此期间多次触发，则延时时间重新计时。
 * @param {Function} fn 要执行的回调函数
 * @param {Number} wait 延时的时间，单位ms
 */
export function once(fn, wait = frequency.once, immediate) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    let later = function () {
      timeout = null
      if (!immediate) {
        isFn(fn) && fn.apply(context, args)
      }
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      isFn(fn) && fn.apply(context, args)
    }
  }
}
