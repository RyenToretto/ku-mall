import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  mutations: {
    init(state, { name, value = [] }) {
      Vue.set(state, name, {
        values: [],
        checkedValues: value
      })
    },
    setValue(state, { name, value }) {
      let data = state[name]
      if (!data) {
        return
      }
      if (!data.values.includes(value)) {
        data.values.push(value)
      }
    },
    removeValue(state, { name, value }) {
      let data = state[name]
      if (!data) {
        return
      }
      let index = data.values.findIndex((v) => v === value)
      if (index > -1) {
        data.values.splice(index, 1)
      }
    },
    checkValue(state, { name, value }) {
      let data = state[name]
      if (!data) {
        return
      }
      let index = data.checkedValues.findIndex((v) => v === value)
      if (index > -1) {
        data.checkedValues.splice(index, 1)
      } else {
        data.checkedValues.push(value)
      }
    },
    resetCheckedValues(state, { name, value }) {
      let data = state[name]
      if (!data) {
        return
      }
      data.checkedValues = value
    },
    unselectAll(state, { name }) {
      let data = state[name]
      if (!data) {
        return
      }
      data.checkedValues = []
    },
    selectAll(state, { name }) {
      let data = state[name]
      if (!data) {
        return
      }
      data.checkedValues = [...data.values]
    }
  }
})

export { store }
