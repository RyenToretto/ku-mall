import { clone } from '../../object'

const devicesData = [
  {
    minWidth: 0,
    maxWidth: 768,
    name: 'phones'
  },
  {
    minWidth: 768,
    maxWidth: 992,
    name: 'ipad'
  },
  {
    minWidth: 992,
    maxWidth: 1200,
    name: 'smallPc'
  },
  {
    minWidth: 1200,
    maxWidth: 1921,
    name: 'pc'
  },
  {
    minWidth: 1921,
    maxWidth: 99999,
    name: 'landscapePc'
  }
]

/**
 * @description 获取设备类型数据
 */
export function _getDeviceData() {
  return clone(devicesData)
}

/**
 * @description 查询媒体设备类型
 * @return {Object} name:媒体类型，minWidth宽度下限，maxWidth媒体宽度上限
 */
export function getDeviceType(width) {
  width = width || getApp().globalData.sysInfo.windowWidth
  for (let device of devicesData) {
    if (width >= device.minWidth && width < device.maxWidth) {
      return { ...device }
    }
  }
}

/**
 * @description 判断是否是宽屏PC设备
 */
export function isPc() {
  let device = getDeviceType()
  return ['pc', 'landscapePc', 'smallPc'].indexOf(device.name) > -1
}
