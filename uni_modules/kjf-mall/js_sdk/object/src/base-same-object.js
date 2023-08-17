import { isObject, isArray } from '../../validate'

/**
 * @description 键名长度
 * @param {Object} obj
 */
function getLength(obj) {
  return Object.keys(obj).length
}

function CompareObj(objA, objB, flag) {
  if (getLength(objA) !== getLength(objB)) return false
  for (let key in objA) {
    if (!flag)
      //flag为false，则跳出整个循环
      break
    if (!objB.hasOwnProperty(key)) {
      //是否有自身属性，而不是继承的属性
      flag = false
      break
    }
    if (!isArray(objA[key])) {
      //子级不是数组时,比较属性值
      if (isObject(objA[key])) {
        if (isObject(objB[key])) {
          if (!flag)
            //这里跳出循环是为了不让递归继续
            break
          flag = CompareObj(objA[key], objB[key], flag)
        } else {
          flag = false
          break
        }
      } else {
        if (String(objB[key]) !== String(objA[key])) {
          //排除数字比较的类型差异
          flag = false
          break
        }
      }
    } else {
      if (!isArray(objB[key])) {
        flag = false
        break
      }
      var oA = objA[key],
        oB = objB[key]
      if (oA.length !== oB.length) {
        flag = false
        break
      }
      for (var k in oA) {
        if (!flag)
          //这里跳出循环是为了不让递归继续
          break
        flag = CompareObj(oA[k], oB[k], flag)
      }
    }
  }
  return flag
}

function isSameObject(objA, objB) {
  if (!isObject(objA) || !isObject(objB)) return false //判断类型是否正确
  if (getLength(objA) !== getLength(objB)) return false //判断长度是否一致
  return CompareObj(objA, objB, true) //默认为true
}

export { isSameObject }
