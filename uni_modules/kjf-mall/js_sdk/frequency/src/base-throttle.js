import { isFn } from '../../validate'
import { getValue } from '../../config'

let frequency = getValue('frequency', { onceByOnce: 200, once: 200 })

/**
 * @description 节流，每隔一定时间执行一次，在此期间仅执行一次
 * @param {Function} fn 即将执行的函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} isTail 是否在时间段结尾执行
 */
export function onceByOnce(fn, wait = frequency.onceByOnce, isTail) {
  let isAvail = true
  let timeout = null
  let isFirst = true
  let movement = null
  return function () {
    let context = this
    let args = arguments
    if (isTail) {
      if (null === timeout) {
        timeout = setTimeout(() => {
          timeout = null
          isFn(fn) && fn.apply(context, args)
        }, wait)
      }
    } else {
      // 立即执行
      if (isAvail) {
        isAvail = false
        isFn(fn) && fn.apply(context, args)
        setTimeout(() => {
          isAvail = true
        }, wait)
      }
    }
    if (isFirst) {
      // 防止只点击一次时触发两次的情况
      isFirst = false
      return
    }
    // 最后一次必定执行
    clearTimeout(movement)
    movement = setTimeout(() => {
      isFn(fn) && fn.apply(context, args)
    }, wait)
  }
}
