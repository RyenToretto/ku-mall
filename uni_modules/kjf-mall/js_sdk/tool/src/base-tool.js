import { default as doLog } from '../../doLog'
// #ifdef H5
import './clipBoard.js'
// #endif

import { getValue } from '../../config'
import { isNull, isTrue, isString } from '../../validate'
import { localeB } from '../../locale'
import calculator from '../../calculator'

function sleep(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

/**
 * @description 判断当前为开发环境
 * @return {Boolean} 是否为开发环境
 */
function isDev() {
  return process.env.NODE_ENV === 'development'
}

function log() {
  if (isDev()) {
    doLog.info(...arguments)
  }
}

function warn() {
  if (isDev()) {
    doLog.warn(...arguments)
  }
}

function error() {
  if (isDev()) {
    doLog.error(...arguments)
  }
}

/**
 * 拼接 url 和参数
 */
export const queryString = (url, query) => {
  let str = []
  for (let key in query) {
    str.push(key + '=' + query[key])
  }
  let paramStr = str.join('&')
  return paramStr ? `${url}?${paramStr}` : url
}

export function timeInterval(dateBeginStick) {
  const dateEnd = new Date() // 获取当前时间
  const diffStick = Math.abs(dateEnd.getTime() - dateBeginStick) // 时间差的毫秒数

  const yearDiff = Math.floor(diffStick / (24 * 3600 * 1000 * 365))
  if (yearDiff !== 0) {
    return yearDiff + '年前'
  }

  const dayDiff = Math.floor(diffStick / (24 * 3600 * 1000)) // 计算出相差天数
  if (dayDiff !== 0) {
    return dayDiff + '天前'
  }

  const leave1 = diffStick % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
  if (hours !== 0) {
    return hours + '小时前'
  }

  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差分钟数
  if (minutes !== 0) {
    return minutes + '分钟前'
  }

  return '刚刚'
}

export function parseTime(originTime, format = 'yyyy-MM-dd hh:mm:ss') {
  if (!originTime) {
    return originTime
  }
  let dateObj
  if (typeof originTime === 'object') {
    dateObj = originTime
  } else {
    if (typeof originTime === 'string' && /^[0-9]+$/.test(originTime)) {
      originTime = parseInt(originTime)
    } else if (typeof originTime === 'string') {
      originTime = originTime
        .replace(new RegExp(/-/gm), '/')
        .replace('T', ' ')
        .replace(new RegExp(/\.[\d]{3}/gm), '')
    }
    if (typeof originTime === 'number' && originTime.toString().length === 10) {
      originTime = originTime * 1000
    }
    dateObj = new Date(originTime)
  }
  if (dateObj.toString() === 'Invalid Date') {
    return originTime
  }
  const tMap = {
    y: dateObj.getFullYear(),
    M: dateObj.getMonth() + 1,
    d: dateObj.getDate(),
    h: dateObj.getHours(),
    m: dateObj.getMinutes(),
    s: dateObj.getSeconds(),
    t: dateObj.getDay()
  }
  return format.replace(/(y{1,4}|[Mdhmsa]{1,2})/g, (matchStr, tKey) => {
    let tValue = tMap[tKey[0]]
    if (tKey[0] === 't') {
      // Note: getDay() returns 0 on Sunday
      return ['日', '一', '二', '三', '四', '五', '六'][tValue]
    }
    if (matchStr.length > 0 && tValue < 10) {
      tValue = '0' + tValue
    }
    return tValue || 0
  })
}

export const getRealType = (obj) => {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

export const doToString = (t) => {
  return 'string' === typeof t ? t : JSON.stringify(t)
}

export const generateOK = (result = {}) => {
  return {
    isErr: false,
    result
  }
}

export const generateError = (title, error = {}, code) => {
  const args = error || {}
  doLog.info(`${title}${code ? '[' + code + ']' : ''}: ${doToString(args)}`)
  return {
    isErr: true,
    title,
    error,
    code
  }
}

export const deepClone = (data, noEmptyProperty = false) => {
  let _type = getRealType(data)
  let copyOfObj

  if (_type === 'array') {
    copyOfObj = []
  } else if (_type === 'object') {
    copyOfObj = {}
  } else {
    return data
  }

  for (const [key, value] of Object.entries(data)) {
    if (noEmptyProperty && (value === '' || value === null || value === undefined)) {
      continue
    }
    copyOfObj[key] = deepClone(value)
  }

  return copyOfObj
}

// 945128 => 94.51
export const toWan = (num, decimalLength = 2) => {
  if (!num) {
    return num
  }
  return calculator.fMul(num, 0.0001).toFixed(decimalLength)
}

function getLocalData(key, defaultValue) {
  let data = uni.getStorageSync(key)
  return isNull(data) ? defaultValue : data
}

/**
 * @description 显示提示信息
 */
function showTips(msg, icon = 'none') {
  if (!msg) {
    return
  }
  if (msg.length < 15) {
    uni.showToast({
      title: msg,
      icon,
      duration: msg.length > 5 ? 3000 : 2000
    })
    return
  }
  showModal({
    content: msg,
    showCancel: false
  })
}

function showToast(msg, icon = 'none') {
  showTips(msg, icon)
}

/**
 * @description 显示模态框
 */
function showModal(config = {}) {
  let _config = {
    title: localeB('modal.tips'),
    // #ifndef MP-TOUTIAO
    confirmColor: getValue('components.confirmColor')
    // #endif
  }
  uni.showModal(Object.assign(_config, config))
}

function getSafeArea() {
  let sysInfo = getApp().globalData.sysInfo
  // #ifdef H5
  return sysInfo.safeArea
  // #endif
  // #ifndef H5
  return { width: sysInfo.windowWidth, height: sysInfo.windowHeight }
  // #endif
}

/**
 * @description 将一个度量数值转为px
 * @param {String} value 数值，px、upx、rpx、%等
 * @param {Number} fatherSize 参考父级尺寸
 */
function parsePx(value, fatherSize) {
  if (isNull(value) || value === 'auto') {
    return ''
  }
  let { width, height } = getSafeArea()
  fatherSize = fatherSize || width
  value = value + ''
  let v = parseFloat(value)
  if (value.indexOf('%') > -1) {
    value = (fatherSize * v) / 100
  } else if (value.indexOf('vw') > -1) {
    value = (width * v) / 100
  } else if (value.indexOf('vh') > -1) {
    value = (height * v) / 100
  } else if (value.indexOf('upx') > -1 || value.indexOf('rpx') > -1) {
    value = width > 476 ? v / 2 : (v / 2) * (width / 375)
  }
  let intValue = parseInt(value)
  return intValue % 2 === 0 || intValue === value ? intValue : intValue + 1
}

function hasSlots(name) {
  // #ifdef MP-ALIPAY
  if (!my.canIUse('component2')) {
    doLog.error('未启用component2编译，请点击开发工具右上角的详情按钮，在项目配置中开启。')
  }
  name = name ? name : '$default'
  return (
    (!!this.$slots && !!this.$slots[name] && this.$slots[name].length > 0) ||
    (!!this.$scopedSlots && !!this.$scopedSlots[name] && this.$scopedSlots[name].length > 0)
  )
  // #endif
  // #ifndef MP-ALIPAY
  name = name ? name : 'default'
  return !!this.$slots[name] || !!this.$scopedSlots[name]
  // #endif
}

function getSlots() {
  return [...arguments].reduce((data, name) => {
    data[name] = hasSlots.call(this, name)
    return data
  }, {})
}

function getTrues() {
  return [...arguments].reduce((data, name) => {
    data[name] = isTrue(this[name])
    return data
  }, {})
}

function getNumbers() {
  return [...arguments].reduce((data, name) => {
    data[name] = Number(this[name])
    return data
  }, {})
}

async function getTempFileUrl(fileID) {
  if (!fileID || fileID.indexOf('cloud://') !== 0) {
    return fileID
  }
  let { fileList } = await uniCloud.getTempFileURL({ fileList: [fileID] })
  let { code, tempFileURL } = fileList[0]
  if (code === 'STORAGE_EXCEED_AUTHORITY') {
    doLog.error('该fileID不是当前客户端环境生成，需在服务端获取临时链接')
  }
  return tempFileURL ? tempFileURL : fileID
}

async function getTempFileURL(fileID) {
  if (!fileID) {
    return fileID
  }
  if (isString(fileID)) {
    return await getTempFileUrl(fileID)
  }
  let promises = fileID.map((item) => getTempFileUrl(item))
  return await Promise.all(promises)
}

export {
  sleep,
  getTempFileURL,
  isDev,
  log,
  warn,
  error,
  showTips,
  showToast,
  showModal,
  parsePx,
  getSafeArea,
  getLocalData,
  hasSlots,
  getSlots,
  getTrues,
  getNumbers
}
