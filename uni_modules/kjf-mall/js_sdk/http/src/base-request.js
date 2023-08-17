import { deepMerge } from '../../object'
import { isNull, isObject, isArray } from '../../validate'
import { isDev } from '../../tool'
import { setCache, getCache, clearTargetCache } from '../../cache/src/base-cache.js'
import { getValue } from '../../config'
import { localeB } from '../../locale'
import doLog from '../../doLog'
import { setParamsToData } from './base-http-params.js'

class Request {
  /**
   * @param {Array} params
   * @param apiType
   */
  constructor(params, apiType) {
    let config = this.getConfig()
    let args = []
    for (var i = 0; i < params.length; i++) {
      let arg = params[i]
      let { loading = {}, url, data = {} } = arg

      //加载状态,后者会覆盖前者
      this.loading = deepMerge({}, config.loading, this.loading || {}, loading)

      //请求地址，参数
      if (apiType !== 'http') {
        url = setParamsToData(url, data)
      }

      //处理请求地址
      let res = this.dealUrl(url)

      //缓存
      if (isArray(config.caches[url])) {
        arg.cache = true
      }

      args.push({
        ...arg,
        url,
        data,
        ...res
      })
    }
    //请求信息
    this.args = args
  }

  dealUrl() {
    return {}
  }

  /**
   * @description 执行请求
   * @return {Promise}
   */
  next() {
    this.showLoading()

    var promises = this.args.map((arg) => {
      let { cache, url, data: params } = arg

      //从临时缓存中取数据
      if (cache) {
        let dataInCache = getCache(url, params)
        if (!isNull(dataInCache)) {
          if (isDev()) {
            arg.isCacheData = true //缓存标记字段，请求响应结果中使用
            doLog.info(`已停止请求服务端${url}，找到本地缓存数据：`)
            doLog.info(params)
            doLog.info(dataInCache.result)
          }
          return dataInCache
        }
      }

      //发送请求
      return this.getRequest(arg)
    })

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then((res) => {
          this.hideLoading()

          let datas = res.map((item, index) => {
            this.setCacheData(this.args[index], item)
            return item.result || item.data
          })

          //自动刷新token
          this.setToken(datas)

          //返回数据
          resolve(datas)
        })
        .catch((err) => {
          uni.hideLoading()

          //返回错误信息
          reject(err)
        })
    })
  }

  getRequest() {}

  getConfig() {
    return getValue('request', {})
  }

  /**
   * @description 设置临时缓存
   */
  setCacheData({ cache, data, url, isCacheData }, value) {
    if (cache && !isCacheData) {
      //设置临时缓存
      setCache(url, data, value)
    }
    //清除临时缓存
    clearTargetCache(url)
  }

  /**
   * @description 显示loading状态
   */
  showLoading() {
    this.loadingStart = Date.now() + this.loading.time
    this.loadingTimer = setTimeout((e) => {
      if (this.loading.show) {
        uni.showLoading({
          title: this.loading.title || localeB('loadingText'),
          // #ifndef MP-TOUTIAO
          mask: this.loading.mask
          // #endif
        })
      }
    }, this.loading.time)
  }

  hideLoading() {
    if (!this.loading.show) {
      return
    }
    clearTimeout(this.loadingTimer)
    //请求未能提前结束，清除loading状态
    let time = (this.loading.keepTime ?? 1000) - (Date.now() - this.loadingStart)
    setTimeout(
      () => {
        uni.hideLoading()
      },
      time < 0 ? 1 : time
    )
  }

  /**
   * @description 自动刷新本地token
   * @param {Array} dataList
   */
  setToken(dataList) {
    let tokenKey = getValue('tokenKey', 'uniIdToken')
    let expiredKey = getValue('tokenExpiredKey', 'uniTokenExpired')
    dataList.map((data) => {
      if (isObject(data) && data.refreshUniIdToken) {
        uni.setStorageSync(tokenKey, data.refreshUniIdToken)
        uni.setStorageSync(expiredKey, data.refreshTokenExpired)
      }
    })
  }
}

export { Request }
