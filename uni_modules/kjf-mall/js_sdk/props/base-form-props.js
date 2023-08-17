import { isOneOf } from '../validate'
import { getValue } from '../config'

const labelProps = {
  props: {
    title: String,
    titleClass: [String, Array],
    titleStyle: String,
    errorContent: String,
    titleWidth: [String, Number],
    scale: [String, Number],
    required: {
      type: [String, Boolean],
      default: undefined
    },
    requiredMark: {
      type: [String, Boolean],
      default: undefined
    },
    align: String,
    position: [String, Array]
  }
}

export default {
  ...labelProps,
  name: String,
  value: {
    type: [String, Boolean, Number, Object, Array],
    default: ''
  },
  disabled: {
    type: [Boolean, String],
    default: undefined
  },
  focus: {
    type: [Boolean, String],
    default: false
  },
  valueType: [String, Function],
  scale: [String, Number],
  validateTitle: String,
  pattern: [String, RegExp],
  validator: [String, Function],
  confirmName: String,
  blurCheck: {
    type: [String, Boolean],
    default: undefined
  },
  errorType: {
    //错误提示方式
    type: String,
    validator(v) {
      return isOneOf('error', v, ['toast', 'underline'])
    }
  },
  emptyPrefix: String, //值为空时，提示信息的前缀
  errorMsg: [String, Object], //校验失败时的提示语
  autoPlaceholder: {
    type: [String, Boolean],
    default: undefined
  },
  placeholderStyle: String,
  placeholderClass: String,
  placeholder: String,
  sign: {
    type: [Boolean, String],
    default() {
      return getValue('components.form.sign', false)
    }
  }
}
