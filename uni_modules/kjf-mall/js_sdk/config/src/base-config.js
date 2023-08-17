import { deepMerge, getDeepVal } from '../../object'

const config = {}

/**
 * @description 配置全局配置信息
 */
function setConfig(myConfig = {}) {
  deepMerge(config, myConfig)
}

/**
 * @description 从配置信息中取值
 * @param {Object} keys 取值路径，多个使用英文.连接
 * @param {Object} defaultValue 可选参数，若不存在时，赋予并返回默认值
 */
function getValue(keys, defaultValue = undefined) {
  return getDeepVal(config, keys, defaultValue)
}

export { setConfig, getValue }
