import { isObject, isNull } from '../../validate'

/**
 * @description 判断对象是否有指定的属性，不支持深层属性
 * @param {Object} obj
 * @param {Object} key
 * @return {Boolean} 返回是否有该属性
 */
function hasOwn(obj, key) {
  return isObject(obj) && Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * @description 从对象中取出指定的键值，判断对象是否有指定的，若没有则可进行赋予默认值，注意不支持
 * @param {Object} obj
 * @param {Object} key
 * @param {Object} defaultValue
 * @return {Boolean} 返回是否有该属性
 */
function getOwn(obj, key, defaultValue) {
  if (!hasOwn(obj, key) && defaultValue !== undefined) {
    obj[key] = defaultValue
  }
  return obj[key]
}

/**
 * @description 将一个或多个对象深度合并到第一个对象中
 * @param {Object...} 一个或多个需要深度合并的对象，后者覆盖前者
 * @return {Object} 返回深度合并后的对象
 */
function deepMerge() {
  var args = [...arguments]
  var originObj = args[0]
  var mergeObj = args[1]
  for (var key in mergeObj) {
    isObject(originObj[key])
      ? deepMerge(originObj[key], mergeObj[key])
      : (originObj[key] = mergeObj[key])
  }
  args.splice(0, 2, originObj)
  return args.length === 1 ? originObj : deepMerge(...args)
}

/**
 * @description 根据“a.b.c”形式的键名，以及一个值，创建一个json深层对象
 * @param {Object} keys “a.b.c”形式的多个键的键名
 * @param {Object} value 键值
 * @return {Object} 返回深层json对象
 */
function createDeepJson(keys, value) {
  var data = {}
  var lastDot = keys.lastIndexOf('.')
  if (lastDot === -1) {
    data[keys] = value
    return data
  }
  //内部data
  var innerKey = keys.substr(lastDot + 1)
  var innerData = {}
  innerData[innerKey] = value

  //剩余data
  var key = keys.substr(0, lastDot)
  return createDeepJson(key, innerData)
}

/**
 * @description 为json对象中的深层键赋值，规避中层键值为空的异常
 * @param {Object} json 对象
 * @param {String} deepKeys 多个键名使用.连接
 * @param {Object} value 赋值
 */
function setDeepValue(json, deepKeys, value) {
  var innerJson = createDeepJson(deepKeys, value)
  return deepMerge(json, innerJson)
}

/**
 * @description 根据深层路径，从对象中取值
 * @return {Object} 返回键值
 * @param jsonObj
 * @param deepPath
 * @param defaultValue
 */
function getDeepVal(jsonObj, deepPath, defaultValue) {
  if (!deepPath) {
    return
  }
  let paths = deepPath.split('.')
  let innerObj = jsonObj
  for (let key of paths) {
    if (!hasOwn(innerObj, key) || isNull(innerObj[key])) {
      if (defaultValue !== undefined) {
        //无值则赋予默认值，继续下次循环取值
        setDeepValue(jsonObj, deepPath, defaultValue)
        innerObj = innerObj[key]
        continue
      }
      //无值直接返回
      return
    }
    //内部对象
    innerObj = innerObj[key]
  }
  return innerObj
}

/**
 * @description 深度复制一个json、array对象，仅限json、array对象
 * @param {Object} obj
 * @return {Object} 返回复制的对象
 */
function clone(obj) {
  return isNull(obj) ? obj : JSON.parse(JSON.stringify(obj))
}

export { deepMerge, createDeepJson, setDeepValue, getDeepVal, clone, hasOwn, getOwn }
