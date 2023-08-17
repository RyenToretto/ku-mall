class DoLogger {
  constructor() {
    this.loggerLevel = 1
    this.settledDown = false
  }
  info(...t) {
    this.setLevel()
    this.loggerLevel <= 1 && console.log(...t)
  }
  warn(...t) {
    this.setLevel()
    this.loggerLevel <= 2 && console.warn(...t)
  }
  error(...t) {
    this.setLevel()
    this.loggerLevel <= 3 && console.error(...t)
  }
  setLevel() {
    if (this.settledDown) {
      return
    }
    try {
      const level = +getApp().globalData.__logLevel || 1
      if (['info', 'warn', 'error'].includes(level)) {
        switch (level) {
          case 'info':
            this.loggerLevel = 1
            break
          case 'warn':
            this.loggerLevel = 2
            break
          case 'error':
            this.loggerLevel = 3
            break
        }
      }
      this.settledDown = true
    } catch (e) {
      this.settledDown = false
    }
  }
}

const doLog = new DoLogger()
export default doLog
