import { getValue } from '../config'

export default {
  list: {
    type: Array,
    default: () => []
  },
  titleKey: {
    type: String,
    default: () => getValue('components.titleKey')
  },
  valueKey: {
    type: String,
    default: () => getValue('components.valueKey')
  },
  disabledKey: {
    type: String,
    default: () => getValue('components.disabledKey')
  }
}
