import { isArray, isNull } from '../../validate'
import { isDev, md5 } from '../../tool'
import { getDeepVal, setDeepValue, clone } from '../../object'
import { getValue } from '../../config'
import doLog from '../../doLog'

/**
 * @description 从globalData中获取本地临时缓存数据
 * @return {Object}
 */
function getLocalCache() {
  return getDeepVal(getApp(), 'globalData.LOCAL_CACHE', {})
}

/**
 * @description 当登录状态失效时，清理与用户状态相关的缓存
 * @param {Object} e
 */
function clearStorage(e) {
  let userStateKeys = getValue('userStateKeys', [])
  userStateKeys.forEach((key) => {
    uni.removeStorageSync(key)
  })
  getApp().globalData.LOCAL_CACHE = {}
  if (isDev) {
    doLog.warn('本地缓存、临时缓存数据已全部清除……')
  }
}

/**
 * @description 获取本次请求的缓存key
 * @param {Object} url
 * @param {Object} data
 * @return {String} 返回缓存key
 */
function getCacheKey(url, data) {
  return md5(url + JSON.stringify(data))
}

/**
 * @description 取出临时缓存
 * @param {Object} url 请求地址
 * @param {Object} data 请求参数
 */
function getCache(url, data) {
  //缓存空间和键名
  var cacheSpace = md5(url)
  var cacheKey = getCacheKey(url, data)
  //取缓存值
  var localCache = getLocalCache()
  var cacheValue = getDeepVal(localCache, `${cacheSpace}.${cacheKey}`)
  return clone(cacheValue)
}

/**
 * @description 设置临时缓存
 * @param {Object} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} value 缓存值
 */
function setCache(url, data, value) {
  if (isNull(value)) {
    return
  }
  //缓存空间和键名
  let spaceName = md5(url)
  let key = getCacheKey(url, data)
  //赋值
  var localCache = getLocalCache()
  setDeepValue(localCache, `${spaceName}.${key}`, clone(value))
}

/**
 * @description 请求成功后清理缓存
 * @param {String} url 为空时清空所有缓存，多个url使用英文分号分割
 */
function clearCache(url) {
  let localCache = getLocalCache()
  if (!url) {
    localCache = {}
    return
  }
  let urls = isArray(url) ? url : url.split(';')
  urls.forEach((item) => {
    let cacheSpace = md5(item)
    delete localCache[cacheSpace]
  })
}

function clearTargetCache(url) {
  let caches = getValue('request.caches', {})
  for (let key in caches) {
    let value = caches[key]
    if (isArray(value) && value.includes(url)) {
      clearCache(key)
    }
  }
}

export { clearStorage, clearTargetCache, getCache, setCache, clearCache }
