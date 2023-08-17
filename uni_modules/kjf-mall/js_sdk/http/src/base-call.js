import { isObject, isArray, isFn, isFalse, isString } from '../../validate'
import { getDeepVal } from '../../object'
import { getValue } from '../../config'
import { showTips } from '../../tool'
import doLog from '../../doLog'
import { Http } from './base-http.js'
import { Caller } from './base-caller.js'

function setArgs(args, data, showLoading) {
  if (isString(args)) {
    args = { url: args }
    if (isObject(data)) {
      args.data = data
    }
  }
  if (!isObject(args) && !isArray(args)) {
    throw new Error('parameter error occurs')
  }
  return isObject(args) ? [args] : args
}

function request(args, _this) {
  let invoker = getValue('request.inters')
  if (!isFn(invoker)) {
    throw new Error('config.request.inters is not a function')
  }

  return new Promise((resolve, reject) => {
    invoker
      .call(_this)
      .then((res) => {
        if (!res) {
          return
        }

        //单次请求返回object，批量请求返回array
        let data = isArray(res) && res.length === 1 ? res[0] : res
        let notHandled = args.some((item) => isFalse(item.handled)) //不做默认业务处理
        if (isArray(data) || notHandled) {
          resolve(data)
          return
        }

        //判断单次请求的请求状态
        let isFailState = getValue('response.isFailState')(data)
        if (!isFailState) {
          resolve(data)
          return
        }

        //提示错误信息
        let msg = getDeepVal(data, getValue('response.msgKey', 'message'))
        showTips(msg)
      })
      .catch((err) => {
        doLog.error('err: ', err)
        reject(err)
      })
      .finally(() => {
        //特殊场景通过设置stopPullDownRefresh 为 false 来自定义停止下拉刷新效果的时机
        let stopPullDownRefresh = args.some((a) => a.stopPullDownRefresh === false)
        if (!stopPullDownRefresh) {
          uni.stopPullDownRefresh()
        }
      })
  })
}

/**
 * @description 请求云函数
 * @param {Object || Array} args 支持一个或多个请求
 * @return {Promise}
 */
function call(args, data) {
  args = setArgs(args, data)
  return request(args, new Caller(args))
}

function http(args, data) {
  args = setArgs(args, data)
  return request(args, new Http(args))
}

let methods = {
  call,
  http
}

function executeInCache(args, data, method) {
  args = setArgs(args, data)
  for (let arg of args) {
    arg.cache = true
  }
  return methods[method](args)
}

/**
 * @description 请求并缓存数据
 */
function callInCache(args, data) {
  return executeInCache(args, data, 'call')
}

function httpInCache(args, data) {
  return executeInCache(args, data, 'http')
}

function httpByMethod(args, data, method, isCache) {
  args = setArgs(args, data)
  for (let arg of args) {
    arg.method = method
    if (isCache === true) {
      arg.cache = true
    }
  }
  return http(args)
}

function get(args, data) {
  return httpByMethod(args, data, 'GET')
}

function getInCache(args, data) {
  return httpByMethod(args, data, 'GET', true)
}

function post(args, data) {
  return httpByMethod(args, data, 'POST')
}

function postInCache(args, data) {
  return httpByMethod(args, data, 'POST', true)
}

export { call, callInCache, http, httpInCache, get, getInCache, post, postInCache }
