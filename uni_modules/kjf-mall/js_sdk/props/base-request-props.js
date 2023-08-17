import { isOneOf } from '../validate'
import { getValue } from '../config'

export default {
  checkAuth: {
    type: [Boolean, String],
    default() {
      return getValue('checkAuth', false)
    }
  },
  authUrl: [String, Array],
  usable: {
    type: [Boolean, String],
    default: true
  },
  apiType: {
    default() {
      return getValue('apiType', 'uniCloud')
    },
    validator(v) {
      return isOneOf('apiType', v, ['uniCloud', 'http'])
    }
  },
  url: String,
  params: {
    type: Object,
    default() {
      return {}
    }
  },
  pageParams: [Boolean, String],
  cache: {
    type: [String, Boolean],
    default: false
  },
  handled: {
    type: [Boolean, String],
    default: true
  },
  loading: {
    type: Object,
    default() {
      return {}
    }
  },
  method: {
    type: String,
    default: 'get',
    validator(v) {
      return isOneOf('method', v, ['post', 'get'])
    }
  },
  header: {
    type: Object,
    default() {
      return {}
    }
  },
  callOnCreated: {
    type: [Boolean, String],
    default: true
  },
  hideOnLoading: {
    type: [String, Boolean],
    default: undefined
  },
  rate: {
    type: [Number, String],
    default: 300
  },
  options: {
    //兼容小程序
    type: [Object, Array],
    default() {
      return {}
    }
  }
}
