var CheckIdCard = {
  //Wi 加权因子 Xi 余数0~10对应的校验码 Pi省份代码
  Wi: [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
  Xi: [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],
  Pi: [
    11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52,
    53, 54, 61, 62, 63, 64, 65, 71, 81, 82, 91
  ],

  //检验18位身份证号码出生日期是否有效
  //parseFloat过滤前导零，年份必需大于等于1900且小于等于当前年份，用Date()对象判断日期是否有效。
  brithday18(sIdCard) {
    var year = parseFloat(sIdCard.substr(6, 4))
    var month = parseFloat(sIdCard.substr(10, 2))
    var day = parseFloat(sIdCard.substr(12, 2))
    var checkDay = new Date(year, month - 1, day)
    var nowDay = new Date()
    if (
      1900 <= year &&
      year <= nowDay.getFullYear() &&
      month == checkDay.getMonth() + 1 &&
      day == checkDay.getDate()
    ) {
      return true
    }
  },

  //检验15位身份证号码出生日期是否有效
  brithday15(sIdCard) {
    var year = parseFloat(sIdCard.substr(6, 2))
    var month = parseFloat(sIdCard.substr(8, 2))
    var day = parseFloat(sIdCard.substr(10, 2))
    var checkDay = new Date(year, month - 1, day)
    if (month == checkDay.getMonth() + 1 && day == checkDay.getDate()) {
      return true
    }
  },

  //检验校验码是否有效
  validate(sIdCard) {
    var aIdCard = sIdCard.split('')
    var sum = 0
    for (var i = 0; i < CheckIdCard.Wi.length; i++) {
      sum += CheckIdCard.Wi[i] * aIdCard[i] //线性加权求和
    }
    var index = sum % 11 //求模，可能为0~10,可求对应的校验码是否于身份证的校验码匹配
    if (CheckIdCard.Xi[index] == aIdCard[17].toUpperCase()) {
      return true
    }
  },

  //检验输入的省份编码是否有效
  province(sIdCard) {
    var p2 = sIdCard.substr(0, 2)
    for (var i = 0; i < CheckIdCard.Pi.length; i++) {
      if (CheckIdCard.Pi[i] == p2) {
        return true
      }
    }
  }
}

/**
 * @description 判断是否为身份证号
 * @param {String} maybeIdcard
 */
function isIdcard(maybeIdcard) {
  maybeIdcard = maybeIdcard.replace(/^\s+|\s+$/g, '') //去除字符串的前后空格，允许用户不小心输入前后空格
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!reg.test(maybeIdcard)) {
    //判断是否全为18或15位数字，最后一位可以是大小写字母X
    return false
  }
  if (maybeIdcard.length === 18) {
    return (
      CheckIdCard.province(maybeIdcard) &&
      CheckIdCard.brithday18(maybeIdcard) &&
      CheckIdCard.validate(maybeIdcard)
    )
  }
  return CheckIdCard.province(maybeIdcard) && CheckIdCard.brithday15(maybeIdcard)
}

export default isIdcard
