import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function getOpenIds(mids, activeId, ids = []) {
  let parentId = mids[activeId]
  if (!parentId) {
    return ids
  }
  ids.push(parentId)
  return getOpenIds(mids, parentId, ids)
}

function getSameLevels(mid, mids) {
  let parentId = mids[mid]
  let ids = []
  for (let key in mids) {
    let pid = mids[key]
    if (pid === parentId && key !== mid) {
      ids.push(key)
    }
  }
  return ids
}

const store = new Vuex.Store({
  state: {},
  mutations: {
    init(state, name) {
      Vue.set(state, name, {
        openIds: [],
        mids: {},
        activeId: '',
        pagePath: '',
        collapsed: false
      })
    },
    setMids(state, { name, mid, parentId }) {
      let data = state[name]
      if (!data) {
        return
      }
      data.mids[mid] = parentId
    },
    setOpenIds(state, { name, ids }) {
      let data = state[name]
      if (!data) {
        return
      }
      data.openIds = ids
    },
    setCollapsed(state, { name, collapsed }) {
      let data = state[name]
      if (!data) {
        return
      }
      data.collapsed = collapsed
    },
    setActiveId(state, { name, mid }) {
      let data = state[name]
      if (!data) {
        return
      }
      data.activeId = mid
      let openIds = getOpenIds(data.mids, data.activeId)
      data.openIds.push(...openIds)
    },
    toggle(state, { name, mid, singleOpened, allOpened }) {
      let data = state[name]
      if (!data) {
        return
      }
      //全部
      if (!mid) {
        if (data.openIds.length === 0) {
          data.openIds = Object.keys(data.mids)
        } else {
          data.openIds = []
        }
        return
      }
      let index = data.openIds.findIndex((c) => c === mid)
      let isOpened = index > -1
      if (isOpened) {
        data.openIds = data.openIds.filter((item) => item !== mid)
      } else {
        if (singleOpened) {
          //移除同级的mid
          let sameLevels = getSameLevels(mid, data.mids)
          data.openIds = data.openIds.filter((item) => !sameLevels.includes(item))
        }
        data.openIds.push(mid)
      }
    },
    setPagePath(state, { name, route }) {
      let data = state[name]
      if (!data) {
        return
      }
      data.pagePath = route
    }
  }
})

export { store }
