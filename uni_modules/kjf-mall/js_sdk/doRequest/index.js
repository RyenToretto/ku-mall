import { generateOK, generateError, queryString, deepClone, parseTime, md5 } from '../tool'
import doLog from '../doLog'

class DoRequest {
  constructor({ salt, baseUrl, loginApi, apiVersion, userInfoApi }) {
    this.glbParams = {}

    this.SALT = salt
    this.BASE_URL = baseUrl
    this.loginApi = loginApi
    this.API_VERSION = apiVersion
    this.userInfoApi = userInfoApi

    // #ifdef H5
    if (process.env.NODE_ENV === 'development') {
      this.BASE_URL = ''
      this.loginApi = '/user/anonymousUserLogin'
    }
    // #endif

    this.glbHeader = {
      accessToken: ''
    }
    this.init()
  }
  request(
    {
      url,
      data,
      header,
      params,
      method = 'GET',
      dataType = 'json',
      apiVersion,
      baseUrl,
      vcCallback = null,
      isTrack = false,
      isXH = false
    },
    canLog = false
  ) {
    const theApi = url
    const originUrl = url.startsWith('http')
      ? url
      : (baseUrl || this.BASE_URL) + (apiVersion || this.API_VERSION) + url

    let abort = null
    const abortPromise = new Promise((resolve, reject) => {
      abort = reject
    })
    const reqPromise = new Promise(async (resolve, reject) => {
      if (!originUrl) {
        reject(new Error('地址不存在。'))
        return
      }

      const gp = await this.getGlbParams()
      const urlParams = { ...gp, ...params }
      if (vcCallback) {
        urlParams.vc = vcCallback(originUrl)
      }
      const urlWithParams = queryString(originUrl, urlParams)
      canLog &&
        doLog.info(
          `\n\n===> (${method}) ${originUrl}\n===> 请求参数: `,
          JSON.stringify(urlParams, null, 4)
        )
      const theHeader = deepClone(
        { ...this.glbHeader, ...header, 'Access-Control-Allow-Origin': '*' },
        true
      )

      canLog &&
        JSON.stringify(theHeader) !== '{}' &&
        doLog.info('===> header: ', JSON.stringify(theHeader, null, 4), '\n\n')
      const theData = isTrack
        ? isXH
          ? [{ ...data, ts: urlParams.ts }]
          : [{ ...data, todayTime: urlParams.ts, ts: urlParams.ts }]
        : { ...data }
      canLog && theData && doLog.info('===> 请求体: ', JSON.stringify(theData, null, 4))
      uni.request({
        url: urlWithParams,
        data: theData,
        header: theHeader,
        method,
        dataType,
        withCredentials: true,
        success(response) {
          canLog &&
            doLog.info(`===> ${originUrl} 's response: ${JSON.stringify(response, null, 4)}`)
          resolve({ ...response })
        },
        fail(error, code) {
          generateError(`(${theApi})ajax error`, error, code)
          reject(error, code)
        }
      })
    })
    const promise = Promise.race([reqPromise, abortPromise])
    promise.abort = abort
    return promise
  }
  setGlbHeader(obj) {
    for (const [key, value] of Object.entries(obj)) {
      this.glbHeader[key] = value
      if (key === 'accessToken') {
        try {
          uni.setStorageSync('access_token', value)
        } catch (e) {}
      }
    }
    return this.glbHeader
  }
  setGlbParams() {
    return new Promise((resolve) => {
      uni.getSystemInfo({
        success: (uniInfo) => {
          try {
            const vToken = uni.getStorageSync('ku_token')
            const token = vToken || md5(uniInfo.deviceId)
            this.glbParams.tk = token
            uni.setStorageSync('ku_token', token)
          } catch (e) {
            doLog.info(e)
          }
          this.glbParams.udid = this.glbParams.tk
          this.glbParams.userid = this.glbParams.tk
          // glbParams.pkg = uniInfo.appId
          this.glbParams.pkg = 'com.hnzht.lucky.novel'
          this.glbParams.appv = uniInfo.appVersionCode
          this.glbParams.v = uniInfo.appVersionCode // 版本号
          this.glbParams.vn = uniInfo.appVersion
          this.glbParams.appvn = uniInfo.appVersion
          this.glbParams.lang = uniInfo.appLanguage
          this.glbParams.brand = uniInfo.deviceBrand // 品牌
          this.glbParams.vendor = uniInfo.vendor // 厂商
          this.glbParams.model = uniInfo.deviceModel // 型号
          this.glbParams.os = uniInfo.osName // 操作系统
          this.glbParams.sdk = uniInfo.osVersion // osVersionCode 操作系统版本号
          this.glbParams.vs = uniInfo.osVersion // device.getInfo(OBJECT) 的 platformVersionName
          this.glbParams.locale = '' // 地区
          this.glbParams.w = uniInfo.screenWidth // 屏宽
          this.glbParams.h = uniInfo.screenHeight // 屏高
          this.glbParams.dpi = uniInfo.devicePixelRatio // 像素比
          this.glbParams.immd5 = '' // device.getId(OBJECT)  的 device的md5
          this.glbParams.imnewmd5 = '' // device.getId(OBJECT)  的 device的md5
          this.glbParams.anid = '' // device.getId(OBJECT)  的 user
          this.glbParams.mac = '' // device.getId(OBJECT)  的 mac
          this.glbParams.ntt = '' // 网络类型
          this.glbParams.op = '' // 获取SIM卡的拜访地信息 network.getNetworkOperator(OBJECT) 的 operator
          this.glbParams.oaid = '' // device.getOAID(OBJECT)
          this.glbParams.dl_source = 'uni-app' // 带量来源
          this.glbParams.channel = this.glbParams.dl_source
          uni.$emit('app-ready', uniInfo)
          resolve(uniInfo)
        },
        fail: () => resolve({})
      })
    })
  }
  async getGlbParams() {
    if (!this.glbParams.channel) {
      await this.setGlbParams()
    }
    this.glbParams.ts = Date.now()
    const { tk, pkg, vn, lang, ts } = this.glbParams
    this.glbParams.vc = md5(tk + pkg + vn + lang + ts + this.SALT)
    return this.glbParams
  }
  xhReport(url, key, data = {}, mustReport = false, shouldLog = false) {
    return new Promise(async (resolve) => {
      try {
        if (!mustReport) {
          const sValue = uni.getStorageSync(key)
          if (+sValue === 1) {
            resolve(generateOK())
            return true
          }
        }

        const res = await this.request(
          {
            url,
            data: { ...data, key },
            method: 'POST',
            params: {},
            header: {
              'Content-Type': 'application/json',
              'Content-Encoding': 'application/gzip',
              'Accept-Encoding': 'gzip,deflate'
            },
            isTrack: true,
            isXH: true
          },
          shouldLog
        )
        doLog.info(`${key} 上报 code: ${res && res.code}`)
        if (!mustReport) {
          uni.setStorageSync(key, 1)
        }
        resolve(res)
      } catch (e) {
        resolve(generateError('do Qtils: xh Report', e))
      }
    })
  }
  get(url, params, options = {}, shouldLog = false) {
    return this.request({ url, params, method: 'GET', ...options }, shouldLog)
  }
  post(url, data, options = {}, params = {}, shouldLog = false) {
    options.header = {
      'Content-Type': 'application/json'
    }
    return this.request({ url, data, method: 'POST', params, ...options }, shouldLog)
  }
  requestText(url, shouldLog = false) {
    return this.request({ url, method: 'GET', apiVersion: '/book' }, shouldLog)
  }
  checkHeart() {
    try {
      const heartKey = 'xh_heartbeat'
      const sHeart = uni.getStorageSync(heartKey)
      const now = parseTime(Date.now(), 'yyyy-MM-dd')
      if (sHeart !== now) {
        uni.setStorageSync(heartKey, now)
        // this.xhReport('https://xe.xdplt.com/adtrack', heartKey, {}, true); // TODO 心跳上报
      }
    } catch (e) {}
    try {
      const hasAlive = uni.getStorageSync('has_alive')
      if (+hasAlive !== 1) {
        // this.xhReport('https://xe.xdplt.com/adtrack', 'xh_alive', {}, true); // TODO 上报
        uni.setStorageSync('has_alive', 1)
      }
    } catch (e) {}
  }
  requestUserInfo(shouldLog = false) {
    const loginInfo = { userInfo: {} }
    if (!this.userInfoApi) {
      Promise.resolve(loginInfo)
      return
    }
    return new Promise((resolve) => {
      this.get(this.userInfoApi, {}, {}, shouldLog)
        .then(({ data }) => {
          if (data.message && +data.message.code === 200 && data.result) {
            loginInfo.userInfo = data.result
            loginInfo.userInfo.nickname = data.result.name || ''
            loginInfo.userInfo.avatar = data.result.avatar || ''
          }
          resolve(loginInfo)
        })
        .catch((e) => {
          resolve(generateError('req User Info', e))
        })
    })
  }
  requestAccessToken() {
    return new Promise(async (resolve) => {
      let isOk = false
      try {
        const res = await this.post(this.loginApi, {}, { apiVersion: '/api/v1' }, {})
        doLog.info(
          `匿名登陆${res && res.code ? res && res.code : ' '}${
            res && JSON.stringify(res.data, null, 4)
          }`
        )
        const { data } = res
        if (data.message && +data.message.code === 200 && data.result) {
          isOk = true
          this.setGlbHeader(data.result)
        } else {
          generateError('匿名登录，服务异常', data, data.message && data.message.code)
        }
        resolve(isOk)
      } catch (e) {
        generateError('req Access Token', e)
        resolve(isOk)
      }
    })
  }
  async init() {
    try {
      const accessToken = uni.getStorageSync('access_token')
      if (accessToken) {
        this.setGlbHeader({ accessToken })
      } else {
        await this.requestAccessToken()
      }
    } catch (e) {
      generateError('do Qtils.set Access Token', e)
    }
    this.checkHeart()
  }
}

const doRequest = new DoRequest({
  salt: '4582d6815e095be3d83fxvez6iuc4oer1mcff3844bba6c5f703dae669a9a6647',
  baseUrl: 'https://oe-book.xdplt.com', // 线上域名
  loginApi: 'https://oe-book.xdplt.com/api/v1/user/anonymousUserLogin', // 线上匿名登录接口
  // baseUrl: 'http://10.48.0.82:9010', // 沙盒域名
  // loginApi: 'http://10.48.0.82:9010/api/v1/user/anonymousUserLogin', // 沙盒匿名登陆的接口
  apiVersion: '/api/v1',
  userInfoApi: '/user/info',
  mediationLicense: '8e5fec434c29448082c5f80ed146147f' // 巨赢 App License 应用ID
})

export default doRequest
