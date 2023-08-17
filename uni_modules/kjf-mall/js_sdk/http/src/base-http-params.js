import { isNull, isJsonStr, isArrayStr, isObject, isArray } from '../../validate'
import { deepMerge } from '../../object'
import { isDev } from '../../tool'
import { getValue } from '../../config'

/**
 * @description 从请求url地址中获取键值对参数，仅支持http://domain.com?key=value&key2=value2的形式
 * @param {String} url
 * @param {Boolean} parseObject 是否将json或数组字符串的值转为json、数组
 */
function getQueryParams(url, parseObject) {
  if (!url || url.indexOf('?') === -1) {
    return {}
  }
  var kvStr = url.substr(url.indexOf('?') + 1)
  if (!kvStr) {
    return {}
  }
  return toJson(kvStr, parseObject)
}

/**
 * @description 将k=v&k1=v1的字符串转为json
 * @param {Object} kvStr
 * @param {Boolean} parseObject 是否将json或数组字符串的值转为json、数组
 * @return {Object} 返回json对象
 */
function toJson(kvStr, parseObject) {
  let data = {}
  if (isNull(kvStr)) {
    return data
  }
  let paramsArr = kvStr.split('&')
  for (let i = 0; i < paramsArr.length; i++) {
    let kv = paramsArr[i]
    if (!kv) {
      continue
    }
    let kvArr = kv.split('=')
    if (kvArr.length !== 2) {
      continue
    }
    let key = kvArr[0]
    let value = kvArr[1]
    //如果是数组或json字符串的值，将转为数组或json对象
    if (parseObject === true && (isJsonStr(value) || isArrayStr(value))) {
      value = JSON.parse(value)
    }
    data[key] = isNull(value) ? '' : value
  }
  return data
}

/**
 * @description 将json转为params
 * @param {Object} jsonData
 * @param {String} keepKeys 仅拼接指定key，为空时拼接全部参数
 * @return {String} 返回k=v&k1=v2形式的参数字符串，如有json、array的值将转为字符串
 */
function toParams(jsonData, keepKeys) {
  if (!isObject(jsonData)) {
    return ''
  }
  var params = []
  for (let key in jsonData) {
    if (!!keepKeys && keepKeys.indexOf(key) === -1) {
      continue
    }
    var value = jsonData[key]
    value = isNull(value) ? '' : value
    if (isArray(value) || isObject(value)) {
      value = JSON.stringify(value)
    }
    params.push(key + '=' + value)
  }
  return params.join('&')
}

/**
 * @description 拼接url与json参数为字符串
 * @param {Object} url 链接
 * @param {Object} params json参数
 * @param {Object} keepKeys 保留的参数键名，为空时保留全部参数
 * @return {String} 返回拼接参数后的url
 */
function toUrl(url, params, keepKeys) {
  if (!url) {
    return ''
  }
  let paramStr = toParams(params, keepKeys)
  if (!paramStr) {
    return url
  }
  let joiner = url.indexOf('?') === -1 ? '?' : '&'
  return url + joiner + paramStr
}

/**
 * @description 将url中的参数值放入data参数中
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @return {String} 返回去除参数后的请求地址url
 */
function setParamsToData(url, data) {
  if (url.indexOf('?') === -1) return url
  var arr = url.split('?')
  url = arr[0]
  var params = arr[1]
  if (!params) {
    return url
  }
  var json = toJson(params, true)
  deepMerge(data, json)
  return url
}

function getFullUrl(url) {
  let domain = getValue('request.baseUrl')
  if (isDev()) {
    let devDomain = getValue('request.devBaseUrl')
    domain = devDomain ? devDomain : domain
  }
  if (!url) {
    return domain
  }
  if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
    url = domain + url
  }
  return url
}

export { setParamsToData, getQueryParams, toJson, toParams, toUrl, getFullUrl }
