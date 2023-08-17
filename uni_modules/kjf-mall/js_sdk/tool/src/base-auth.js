import { isObject } from '../../validate'
import doLog from '../../doLog'

function hasWxApp() {
  // #ifdef APP-PLUS
  return plus.runtime.isApplicationExist({ pname: 'com.tencent.mm', action: 'weixin://' })
  // #endif
  // #ifdef H5
  return false
  // #endif
  // #ifdef MP-WEIXIN
  return true
  // #endif
}

/**
 * @param {Object} provider weixin | alipay
 */
function getCode(provider) {
  return new Promise((resolve, reject) => {
    // #ifndef APP-PLUS || MP-WEIXIN || MP-ALIPAY
    resolve('')
    return
    // #endif

    if (!hasWxApp()) {
      reject(new Error('尚未安装微信客户端'))
      return
    }

    // #ifdef MP-WEIXIN || MP-ALIPAY
    uni.login({
      provider,
      success(res) {
        resolve(res.code)
      },
      fail(err) {
        reject(new Error('登录失败'))
      }
    })
    // #endif

    // #ifdef APP-PLUS
    plus.oauth.getServices((services) => {
      let authService = services.find((service) => service.id === provider)
      if (!authService) {
        doLog.error('登录模块未启用')
        reject(new Error('登录模块未启用'))
        return
      }
      authService.authorize(
        (res) => {
          resolve(res.code)
        },
        function (err) {
          if (isObject(err)) {
            let { innerCode, code, message } = err
            err.cancel =
              innerCode === -2 ||
              innerCode === -4 ||
              code === -2 ||
              (message && message.indexOf('取消') > -1)
          }
          doLog.error(err)
          reject(err)
        }
      )
    })
    // #endif
  })
}

async function getWeixinCode() {
  return await getCode('weixin')
}

async function getAlipayCode() {
  return await getCode('alipay')
}

export { getCode, getWeixinCode, getAlipayCode }
