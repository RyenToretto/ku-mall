import { getRoot } from '../../tool'
import { format, parseDate } from '../../date'
import {
  isArray,
  isArrayStr,
  isBoolean,
  isDate,
  isFn,
  isJsonStr,
  isNull,
  isObject,
  isTrue
} from './base-type'

export function parseByType(key, value, valueType) {
  if (isNull(valueType)) {
    return value
  }

  //转换函数
  if (isFn(valueType)) {
    return valueType.call(getRoot(), value, key)
  }

  //空值
  if (isNull(value)) {
    if (valueType === 'object') {
      return {}
    }
    if (valueType === 'array') {
      return []
    }
    return ''
  }

  if (valueType === 'int') {
    return parseInt(value)
  }
  if (valueType === 'float') {
    return parseFloat(value)
  }
  if ((valueType === 'boolean' || valueType === 'bool') && isBoolean(value)) {
    return isTrue(value)
  }
  if (
    ((valueType === 'object' || valueType === 'json') && isJsonStr(value)) ||
    (valueType === 'array' && isArrayStr(value))
  ) {
    return JSON.parse(value)
  }
  if (valueType.toLowerCase().indexOf('time') > -1) {
    let v = parseDate(value)
    if (!isDate(v)) {
      return value
    }
    if (valueType === 'timestamp') {
      return v.getTime()
    }
    if (valueType === 'startTimestamp') {
      return v.setHours(0, 0, 0, 0)
    }
    if (valueType === 'endTimestamp') {
      return v.setHours(23, 59, 59, 999)
    }
    if (valueType === 'startTime') {
      v.setHours(0, 0, 0, 0)
      return format(v, 'seconds')
    }
    if (valueType === 'endTime') {
      v.setHours(23, 59, 59, 999)
      return format(v, 'seconds')
    }
  }

  if (valueType === 'string') {
    return isArray(value) || isObject(value) ? JSON.stringify(value) : value + ''
  }
  return value
}
