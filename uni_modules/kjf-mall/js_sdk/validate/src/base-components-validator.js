import doLog from '../../doLog'
import { isNull } from './base-type.js'

export function isOneOf(prop, value, values) {
  if (isNull(value)) {
    return true
  }
  let isValid = values.indexOf(value) > -1
  if (!isValid) {
    doLog.error(`prop ${prop} must be one of ${JSON.stringify(values)}, got ${value}`)
  }
  return isValid
}
