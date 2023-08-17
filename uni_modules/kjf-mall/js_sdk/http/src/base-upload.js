import { isFn, isNull, isJsonStr, isString } from '../../validate'
import { getValue } from '../../config'
import { getFullUrl } from './base-http-params.js'

class BatchUploader {
  constructor(tempFiles, config) {
    //临时文件路径
    this.tempFiles = tempFiles.map((item) => {
      if (isString(item)) {
        item = {
          path: item,
          name: item
        }
      }
      return {
        filePath: item.path,
        fileName: item.name
      }
    })

    //配置信息
    this.config = config

    //进度信息
    this.progressInfo = this.tempFiles.reduce((p, c) => {
      p[c.filePath] = {
        progress: 0, //进度
        totalBytesSent: 0,
        totalBytes: 0,
        task: null //上传任务对象
      }
      return p
    }, {})

    //当前上传进度
    this.progressData = {
      progress: 0,
      totalBytesSent: 0,
      totalBytes: 0
    }

    //进度更新回调
    this.onUpdate = config.onUpdate

    //开始上传
    this._start()
  }

  _start() {
    let config = this.config
    let promises = this.tempFiles.map((file, index) => {
      let { filePath, fileName } = file
      return new Promise((resolve, reject) => {
        let task = uploadByType(
          {
            ...config,
            filePath,
            fileName,
            success: (res) => {
              res.filePath = filePath
              if (isFn(config.success)) {
                res = config.success(res) || res
              }
              resolve({ ...res, isSuccess: true })
            },
            fail: (err) => {
              err.filePath = filePath
              this._fail(filePath)
              isFn(config.fail) && config.fail(err)
              resolve({ ...err, isSuccess: false })
            },
            onProgressUpdate: (res) => {
              this._setProgressInfo(filePath, res)
              isFn(config.onProgressUpdate) && config.onProgressUpdate({ ...res, index, filePath })
            }
          },
          config.apiType
        )

        this.progressInfo[filePath].task = task
      })
    })

    Promise.all(promises).then((resList) => {
      isFn(config.allComplete) && config.allComplete(resList)
      if (isFn(config.allSuccess)) {
        let res = resList.filter((c) => c.isSuccess)
        config.allSuccess(res)
      }
    })
  }

  _setProgressInfo(filePath, res) {
    if (filePath) {
      let { progress, totalBytesSent, totalBytesExpectedToSend: totalBytes } = res
      this.progressInfo[filePath] = {
        ...this.progressInfo[filePath],
        progress,
        totalBytesSent,
        totalBytes
      }
    }
    this._updateInfo('progress')
    this._updateInfo('totalBytesSent')
    this._updateInfo('totalBytes')
    isFn(this.onUpdate) && this.onUpdate(this.progressData)
  }

  _updateInfo(infoKey) {
    let keys = Object.keys(this.progressInfo)
    if (!keys || !keys.length) {
      this[infoKey] = 0
      return
    }
    let total = keys.reduce((total, key) => total + this.progressInfo[key][infoKey], 0)
    this.progressData[infoKey] = infoKey === 'progress' ? total / keys.length : total
  }

  _fail(filePath) {
    delete this.progressInfo[filePath]
    this._setProgressInfo()
  }

  abort() {
    for (let key in this.progressInfo) {
      this.progressInfo[key].task && this.progressInfo[key].task.abort()
    }
  }
}

function uploadByType(config, type) {
  if (type === 'uniCloud') {
    return uniCloudUpload(config)
  }
  return upload(config)
}

function upload(config = {}) {
  let {
    url,
    fileType,
    name,
    filePath,
    formData,
    header = {},
    success,
    fail,
    complete,
    onProgressUpdate
  } = config

  //获取完整的请求地址
  url = getFullUrl(url)

  //携带token
  let tokenKey = getValue('tokenKey')
  var token = uni.getStorageSync(tokenKey)

  let task = uni.uploadFile({
    url,
    fileType,
    filePath,
    name,
    formData,
    complete: (e) => {
      let isSuccess = e.statusCode === 200
      if (isNull(e.statusCode) || !isSuccess) {
        isFn(fail) && fail(e)
      } else if (isSuccess && isFn(success)) {
        if (isJsonStr(e.data)) {
          e.data = JSON.parse(e.data)
        }
        success(e)
      }
      isFn(complete) && complete(e)
    },
    header: {
      [tokenKey]: token,
      ...header
    }
  })

  task.onProgressUpdate(onProgressUpdate)

  return task
}

function uniCloudUpload(config = {}) {
  let { name, fileType, filePath, fileName, success, fail, complete, onProgressUpdate } = config

  let task = uniCloud.uploadFile({
    fileType,
    filePath,
    cloudPath: `${name}/${fileName}`,
    complete: (e) => {
      let isSuccess = !!e.fileID
      if (!isSuccess) {
        isFn(fail) && fail(e)
      } else {
        isFn(success) &&
          success({
            data: { url: e.fileID }
          })
      }
      isFn(complete) && complete(e)
    },
    onUploadProgress: (e) => {
      isFn(onProgressUpdate) &&
        onProgressUpdate({
          ...e,
          progress: Math.round((e.loaded * 100) / e.total),
          totalBytes: e.total,
          totalBytesSent: e.loaded
        })
    }
  })

  return task
}

function batchUpload(filePaths, config) {
  return new BatchUploader(filePaths, config)
}

export { upload, batchUpload }
