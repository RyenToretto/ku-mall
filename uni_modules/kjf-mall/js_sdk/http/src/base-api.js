import { call, http } from './base-call.js'

export function requestByApiType(apiType, params) {
  if (apiType === 'uniCloud') {
    return call(params)
  }
  return apiType === 'uniCloud' ? call(params) : http(params)
}
