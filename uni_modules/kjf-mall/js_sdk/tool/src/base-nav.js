import { toUrl } from '../../http'
import doLog from '../../doLog'

function to(config = {}, name) {
  name = name || 'navigateTo'
  let { url, params, keepKeys } = config
  if (name === 'navigateBack') {
    return navigateBack(config)
  }
  url = toUrl(url, params, keepKeys)

  // #ifdef H5 || APP-PLUS
  uni[name]({
    url,
    fail: (e) => {
      if (name !== 'switchTab' && e.errMsg && e.errMsg.indexOf('tabbar') > -1) {
        to({ url }, 'switchTab')
        return
      }
      doLog.error(e)
    }
  })
  // #endif

  // #ifndef APP-PLUS || H5
  let data = {
    url,
    fail: (e) => {
      if (e.errMsg && e.errMsg.indexOf('tabbar') > -1) {
        to({ url }, 'switchTab')
        return
      }
      doLog.error('e: ', e)
    }
  }
  if (name === 'navigateTo') {
    uni.navigateTo(data)
  } else if (name === 'redirectTo') {
    uni.redirectTo(data)
  } else if (name === 'reLaunch') {
    uni.reLaunch(data)
  } else {
    uni.switchTab({
      url,
      fail: (e) => {
        doLog.error(e)
      }
    })
  }
  // #endif
}

function navigateBack(config = {}) {
  let { delta = 1, title, url } = config

  //返回上一页或默认页
  if (getCurrentPages().length <= delta && url) {
    if (!config.openType || config.openType === 'navigateBack') config.openType = 'redirectTo'
    open(config)
  } else {
    uni.navigateBack({ delta })
  }

  //返回上一页，并显示提示信息
  if (title) {
    setTimeout((e) => {
      uni.showToast({
        title,
        icon: 'success'
      })
    }, 200)
  }
}

function openUrl(url, openType) {
  // #ifdef H5
  window.open(url, openType === '_blank' ? '_blank' : '_self')
  // #endif

  // #ifndef H5
  to({
    url: '/uni_modules/base-view/pages/web-view/web-view',
    params: {
      src: encodeURIComponent(url)
    }
  })
  // #endif
}

function open(config = {}) {
  let { url, openType, params, keepKeys } = config
  if (!url && openType !== 'navigateBack') {
    doLog.warn('url is undefined')
    return
  }

  // #ifdef H5
  if (openType === '_blank') {
    if (url.indexOf('http') !== 0) {
      let rootPath = location.href.split('#')[0]
      url = `${rootPath}#${url}`
    }
  }
  // #endif

  // #ifndef H5
  if (openType === '_blank') {
    openType = 'navigateTo'
  } else if (openType === '_self') {
    openType = 'redirectTo'
  }
  // #endif

  let isUrls = url.indexOf('http') === 0
  if (isUrls) {
    url = toUrl(url, params, keepKeys)
    openUrl(url, openType)
    return
  }

  to(config, openType)
}

function navigateTo(config) {
  to(config, 'navigateTo')
}

function redirectTo(config) {
  to(config, 'redirectTo')
}

function reLaunch(config) {
  to(config, 'reLaunch')
}

function switchTab(config) {
  to(config, 'switchTab')
}

export { navigateTo, redirectTo, reLaunch, switchTab, navigateBack, open }
