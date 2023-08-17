import { default as novelReader } from './novelReader'
import { default as theme } from './theme'
import { default as doRequest } from './doRequest'
import { getValue } from './config'

/**
 * @description 类型验证函数
 */
import * as validate from './validate'

/**
 * @description 操作 json 对象相关函数
 */
import * as objects from './object'

/**
 * @description 云函数请求函数
 */
import * as http from './http'

/**
 * @description 本地缓存和临时缓存
 */
import { clearStorage, clearCache } from './cache'

/**
 * @description 开发相关工具类函数
 */
import * as tool from './tool'

/**
 * @description 日期
 */
import * as date from './date'

/**
 * @description 操作频率控制函数
 */
import { once, onceByOnce } from './frequency'

/**
 * @description 媒体查询函数
 */
import { getDeviceType, isPc } from './media'

/**
 * @description 国际化
 */
import { locale, localeB, setLocale } from './locale'

export default {
  novelReader,
  theme,
  doRequest,
  getValue,
  getDeviceType,
  isPc,
  once,
  onceByOnce,
  clearStorage,
  clearCache,
  ...http,
  ...date,
  ...tool,
  ...validate,
  ...objects,
  locale,
  localeB,
  setLocale,
  hasAuth(res) {
    let fn = getValue('hasAuth')
    return validate.isFn(fn) && fn(res)
  },
  isLogin() {
    let fn = getValue('isLogin')
    return validate.isFn(fn) && fn()
  },
  _isOkState(res) {
    let fn = getValue('response.isOkState')
    return validate.isFn(fn) && fn(res)
  },
  _isFailState(res) {
    let fn = getValue('response.isFailState')
    return validate.isFn(fn) && fn(res)
  },
  _getMsg(res) {
    return objects.getDeepVal(res, getValue('response.msgKey'))
  }
}
