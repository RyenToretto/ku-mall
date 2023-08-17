import { isNull, notNull } from '../../validate'

//将json类型的className转换为字符串
export function getClassName(obj, className) {
  let list = Object.keys(obj).map((key) => (obj[key] ? key : ''))
  list.push(className)
  return list.filter((item) => notNull(item)).join(' ')
}

//将json类型的style转换为字符串
export function getStyle(obj, style) {
  let list = Object.keys(obj).map((key) => (isNull(obj[key]) ? '' : `${key}:${obj[key]}`))
  list.push(style)
  return list.filter((item) => notNull(item)).join(';')
}
