import { isNull, isNumber, isDate, isString } from '../../validate'
/**
 * @description 转为日期
 * @param {String|Timestamp} time
 */
function parseDate(time, defDate) {
  defDate = defDate || null
  if (isNull(time)) {
    return defDate
  }
  if (isDate(time)) {
    return time
  }
  if (isNumber(time)) {
    if (time.toString().length === 10) {
      time = time * 1000
    }
    if (time.toString().length !== 13) {
      return defDate
    }
  }
  if (isString(time)) {
    time = Date.parse(time.replace(/(年|月|-)/g, '/').replace(/(日)/g, ''))
  }
  let date = new Date(time)
  return isNaN(date.getTime()) ? defDate : date
}

export { parseDate }
