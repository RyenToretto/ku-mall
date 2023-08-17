import { isFn } from '../../validate'
import { getValue } from '../../config'
import { Request } from './base-request.js'
import { getFullUrl } from './base-http-params.js'

class Http extends Request {
  constructor(arg) {
    super(arg, 'http')
  }

  /**
   * @override
   * @description 处理请求地址
   */
  dealUrl(url) {
    return {
      url: getFullUrl(url)
    }
  }

  /**
   * @override
   * 获取单次请求的promise对象
   */
  getRequest({ url, data, method, header = {}, success, fail, complete }) {
    let tokenKey = getValue('tokenKey')
    let sign = getValue('request.sign')
    let signData = isFn(sign) ? sign(data) : {}
    return new Promise((resolve, reject) => {
      uni.request({
        url,
        data,
        method,
        header: {
          ...signData,
          ...header
        },
        success: (res) => {
          isFn(success) && success(res)
          resolve(res)
        },
        fail: (err) => {
          isFn(fail) && fail(err)
          reject(err)
        },
        complete: (res) => {
          isFn(complete) && complete(res)
        }
      })
    })
  }
}

export { Http }
