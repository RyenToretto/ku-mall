import { toParams } from '../../http'

function getLastPage() {
  let pages = getCurrentPages()
  if (!pages || !pages.length) {
    return
  }
  return pages[pages.length - 1]
}

function getCurPage() {
  return new Promise((resolve, reject) => {
    let page = getLastPage()
    if (page) {
      resolve(page)
      return
    }
    setTimeout(function () {
      let page = getLastPage()
      resolve(page)
    }, 20)
  })
}

async function getCurrentPage() {
  let page = await getCurPage()
  if (page) {
    return page
  }
  return await getCurrentPage()
}

/**
 * @description 获取页面对象
 * @return {Object} path , params , route
 */
async function getPage() {
  let curPage = await getCurrentPage()
  if (!curPage) {
    return {}
  }
  let params = curPage.options
  let path = '/' + curPage.route
  let kv = toParams(params)
  let route = kv ? path + '?' + kv : path
  return { path, params, route }
}

/**
 * 获取页面的参数
 * @param {Object} e
 */
async function getPageParams(e) {
  return (await getPage()).params
}

/**
 * @description 获取当前页面含参数的完整路径
 * @return {String} 返回/pages/xxx/xxx?k=v形式的字符串，当前页面路径
 */
async function getPageRoute() {
  return (await getPage()).route
}

async function getPagePath(e) {
  return (await getPage()).path
}

async function getRoot() {
  let page = await getCurrentPage()
  return page ? page.$vm : null
}

export { getCurrentPage, getPage, getPageParams, getPageRoute, getPagePath, getRoot }
