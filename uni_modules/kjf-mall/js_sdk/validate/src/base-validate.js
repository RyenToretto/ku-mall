import { localeB } from '../../locale'
import doLog from '../../doLog'
import * as baseType from './base-type.js'

let { isNull, notNull, isEmpty, isFn, isString, isReg, isArray } = baseType

/**
 * @description 获取表单校验提示信息
 * @param {Object|String} errMsg 自定义提示信息
 * @param {Object} key 提示类型键名
 * @param {Object} defaultValue 默认值
 */
function getErrorMsg(errMsg, key, defaultValue) {
  if (isNull(errMsg)) {
    return defaultValue
  }
  if (isString(errMsg)) {
    return errMsg
  }
  try {
    return errMsg[key] || defaultValue
  } catch (e) {
    doLog.error(e)
    return defaultValue
  }
}

/**
 * @description 验证字符串类表单
 * @param {Object} value
 * @param {Object} minlength
 * @param {Object} maxlength
 * @param {Object} title
 */
function checkText(value, minlength, maxlength, title, errorMsg) {
  let noLimitMin = isNull(minlength) || minlength === -1
  let noLimitMax = isNull(maxlength) || maxlength === -1
  if (noLimitMin && noLimitMax) {
    return true
  }
  let length = isArray(value) || isString(value) ? value.length : (value + '').length

  if (noLimitMin) {
    return length <= maxlength
      ? true
      : getErrorMsg(errorMsg, 'maxLength', localeB('validate.maxlength', { title, maxlength }))
  }
  if (noLimitMax) {
    return length >= minlength
      ? true
      : getErrorMsg(errorMsg, 'minLength', localeB('validate.minlength', { title, minlength }))
  }
  if (minlength === maxlength) {
    return length === minlength
      ? true
      : getErrorMsg(errorMsg, 'length', localeB('validate.length', { title, length: minlength }))
  }
  return length >= minlength && length <= maxlength
    ? true
    : getErrorMsg(errorMsg, 'between', localeB('validate.between', { title, maxlength, minlength }))
}

/**
 * @description 验证数字类表单
 * @param {Object} value
 * @param {Object} min
 * @param {Object} max
 * @param {Object} title
 */
function checkNumber(value, min, max, title, errorMsg) {
  if (isNull(min) && isNull(max)) {
    return true
  }
  let val = Number(value)
  if (isNull(min)) {
    return val <= max
      ? true
      : getErrorMsg(errorMsg, 'maximum', localeB('validate.maximum', { title, max }))
  }
  if (isNull(max)) {
    return val >= min
      ? true
      : getErrorMsg(errorMsg, 'minimum', localeB('validate.minimum', { title, min }))
  }
  return val >= min && val <= max
    ? true
    : getErrorMsg(errorMsg, 'range', localeB('validate.range', { title, min, max }))
}

/**
 * @description 根据类型获取对应验证函数名
 * @param {String} type
 * @return {String} mobile => isMobile
 */
function getFnNameByType(type) {
  if (isNull(type)) {
    return
  }
  return `is${type.substr(0, 1).toUpperCase()}${type.substr(1)}`
}

/**
 * @description 表单单项验证
 * @param {Object} form
 *     @value name
 *     @value value
 *     @value type  	类型
 *     @value required  必填
 *     @value pattern   正则
 *     @value validator 验证函数
 *     @value title     表单标题
 *     @value prefix    表单为空时的提示信息前缀
 *     @value minlength 字符串最小长度
 *     @value maxlength 字符串最大长度
 *     @value min       最小值
 *     @value max       最大值
 * @return {String | Boolean} 验证失败提示信息，验证成功返回true
 */
export function validateForm({
  name,
  value,
  title,
  prefix,
  errorMsg,
  type = 'text',
  required,
  pattern,
  validator,
  minlength,
  maxlength,
  min,
  max
}) {
  if (isNull(name)) {
    return true
  }
  title = !isNull(title) ? title : name
  if (isFn(validator)) {
    return validator(value, name)
  }

  if (isEmpty(value)) {
    prefix = prefix ? prefix : localeB('validate.prefix')
    return required ? getErrorMsg(errorMsg, 'required', `${prefix}${title}`) : true
  }

  if (isReg(pattern)) {
    return pattern.test(value)
      ? true
      : getErrorMsg(errorMsg, 'format', localeB('validate.formatError', { title }))
  }
  if (notNull(minlength) || notNull(maxlength)) {
    let res = checkText(value, minlength, maxlength, title, errorMsg)
    if (res !== true) {
      return res
    }
  }
  if (['number', 'digist', 'int', 'amount'].includes(type)) {
    let isPass = checkNumber(value, min, max, title, errorMsg)
    if (isPass !== true) {
      return isPass
    }
  }
  let fnName = getFnNameByType(type)
  let validFn = baseType[fnName]
  if (!isFn(validFn)) {
    return true
  }
  let isValid = validFn(value)
  if (isValid) {
    return true
  }
  if (['weekPassword', 'mediumPassword', 'strongPassword'].includes(type)) {
    return getErrorMsg(errorMsg, 'format', localeB(`validate.${type}`, { title }))
  }
  return getErrorMsg(errorMsg, 'format', localeB('validate.formatError', { title }))
}

/**
 * @description 验证表单数据
 * @param {Array} datas
 * @param {String} name 指定校验的表单name
 */
export function validate(datas, name) {
  for (let formName in datas) {
    if (!!name && formName !== name) {
      continue
    }
    let form = datas[formName]

    //表单校验
    let result = validateForm(form)
    if (isString(result)) {
      return {
        valid: false,
        msg: result,
        name: form.name
      }
    }

    //确认表单值
    if (notNull(form.confirmName)) {
      let confirmName = form.confirmName
      let target = datas[confirmName]
      let confirmValue = target ? target.value : ''
      if (!isNull(confirmValue) && form.value !== confirmValue) {
        let targetTitle = target ? target.title : ''
        var title = targetTitle || form.title
        return {
          valid: false,
          msg: getErrorMsg(form.errorMsg, 'confirm', localeB('validate.confirm', { title })),
          name: form.name
        }
      }
    }
  }
  return { valid: true, msg: '' }
}
