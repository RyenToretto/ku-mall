import { isString } from '../../validate'
import { select } from './base-select.js'
import { getPageRoute } from './base-page-route.js'

const scrollData = {}
async function setScroll({ scrollTop }) {
  let pages = await getPageRoute()
  scrollData[pages] = scrollTop
}

async function getScroll() {
  let pages = await getPageRoute()
  return scrollData[pages] || 0
}

/**
 * @description 页面滚动到指定的元素
 * @param {Object} res
 */
async function scrollTo(config, vm) {
  if (isString(config)) {
    config = { selector: config }
  }
  let { selector, top = 0, duration = 100, success, fail, complete } = config
  let scrollTop = await getScroll()
  select(selector, vm).then((data) => {
    if (data.fail) {
      return
    }
    uni.pageScrollTo({
      scrollTop: scrollTop + data.top - top,
      duration,
      success,
      fail,
      complete
    })
  })
}

export { setScroll, getScroll, scrollTo }
