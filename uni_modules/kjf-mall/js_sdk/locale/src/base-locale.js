import { isFn, isObject, isArray, isNull } from '../../validate'
import { getDeepVal } from '../../object'
import { getValue, setConfig } from '../../config'
import doLog from '../../doLog'

/**
 * @description 初始化本地语种数据
 */
function initLocale() {
  //初始化本地语种
  var base_locale = uni.getStorageSync('base_locale')
  if (!base_locale) {
    return
  }
  setLocale(base_locale)
}

/**
 * @description 获取当前的语种名称
 * @return {String} 未使用i18n插件，无值时表明未启用国际化，默认返回zh-CN
 */
function getLangName() {
  return isI18n() ? getApp().$i18n.locale : getValue('locale', 'zh-CN')
}

/**
 * @description 获取当前语种
 */
function getLang() {
  let langName = getLangName()
  return getValue(`messages.${langName}`)
}

/**
 * @description 获取语言包的值
 * @param {Object} keys 键名
 * @param {Object} args 参数
 */
function getLocaleValue(keys, args) {
  let lang = getLang()
  if (isNull(lang)) {
    doLog.error('the language pack does not exist')
    return keys
  }
  let data = getDeepVal(lang, keys)
  if (isNull(data)) {
    return keys
  }
  if (isNull(args)) {
    return data
  }
  if (isObject(args)) {
    for (let key in args) {
      let reg = new RegExp(`{${key}}`, 'g')
      data = data.replace(reg, args[key])
    }
    return data
  }
  if (isArray(args)) {
    for (var i = 0; i < args.length; i++) {
      let reg = new RegExp(`{${i}}`, 'g')
      data = data.replace(reg, args[i])
    }
    return data
  }
  return keys
}

/**
 * @description 判断是否启用了i18n插件
 */
function isI18n() {
  let app = getApp()
  return isFn(app.$t) && app.$i18n !== undefined
}

/**
 * @description 切换语言
 * @param {String} langName 语种
 */
export function setLocale(langName) {
  if (isI18n()) {
    getApp().$i18n.locale = langName
  }
  setConfig({ locale: langName })
  uni.setStorageSync('base_locale', langName)
}

export function locale(keys, args) {
  return isI18n() ? getApp().$t(keys, args) : getLocaleValue(keys, args)
}

export function localeB(keys, args) {
  keys = `base.${keys}`
  return locale(keys, args)
}

export { initLocale }
