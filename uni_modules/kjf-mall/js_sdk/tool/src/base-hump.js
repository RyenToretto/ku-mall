// 下划线转换驼峰
export function toHump(value) {
  return value.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

// 驼峰转换下划线
export function toLine(value, spliter = '_') {
  return value.replace(/([A-Z])/g, `${spliter}$1`).toLowerCase()
}
