import { isObject } from '../../validate'
import { localeB } from '../../locale'
import { parseDate } from './base-parse-date.js'

function getFormat(format) {
  switch (format) {
    case 'second':
      return 'yyyy-MM-dd HH:mm:ss'
    case 'minute':
      return 'yyyy-MM-dd HH:mm'
    case 'hour':
      return 'yyyy-MM-dd HH'
    case 'day':
      return 'yyyy-MM-dd'
    case 'month':
      return 'yyyy-MM'
    case 'year':
      return 'yyyy'
    default:
      return format
  }
}

function toStr(date, format) {
  if (null === date) {
    return ''
  }
  format = getFormat(format)
  let ret
  const opt = {
    'y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(format)
    if (ret) {
      format = format.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      )
    }
  }
  return format
}

function differDate({ date, differ, format }) {
  if (null === date) {
    return ''
  }
  let ms = date.getTime() - Date.now()
  let suffix = ms > 0 ? localeB('time.later') : localeB('time.ago')
  ms = Math.abs(ms)

  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  let noDiffer =
    differ === 'none' ||
    (differ === 'second' && seconds > 60) ||
    (differ === 'minute' && minutes > 60) ||
    (differ === 'hour' && hours > 24) ||
    (differ === 'day' && days > 30) ||
    (differ === 'month' && months > 12)

  if (noDiffer) {
    return toStr(date, format)
  }

  let differTimes = [years, months, days, hours, minutes, seconds]
  let differs = ['year', 'month', 'day', 'hour', 'minute', 'second']
  let differIndex = differs.indexOf(differ)
  let number, quantifier
  for (var i = differIndex; i < differs.length; i++) {
    let time = differTimes[i]
    let curDiffer = differs[i]
    let min = curDiffer === 'second' ? 30 : 0
    if (time > min) {
      number = time
      quantifier = localeB(`time.${differs[i]}`)
      break
    }
    if (curDiffer === 'second') {
      number = ''
      suffix = ''
      quantifier = localeB('time.justNow')
    }
  }
  if (quantifier === '月') {
    quantifier = '个月'
  }
  if (number > 1 && differs.includes(quantifier)) {
    quantifier += 's'
  }
  return `${number}${quantifier}${suffix}`
}

/**
 * @description 日期格式化
 * @param {Date} date 日期
 * @param {String} fmt 格式
 */
function format(config, fmt) {
  if (!isObject(config)) {
    config = {
      date: config,
      format: fmt
    }
  }
  let { date, format = 'minute', defaultDate, differ = 'none' } = config
  date = parseDate(date, defaultDate)
  return differDate({ date, differ, format })
}

export { format }
