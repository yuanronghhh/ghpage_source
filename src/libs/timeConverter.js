
class TimeConverter {
  constructor(val) {
    var tm = new Date(val)
    var yr = tm.getFullYear()
    var month = (tm.getMonth() + 1) < 10 ? '0' + (tm.getMonth() + 1) : tm.getMonth() + 1
    var day = tm.getDate() < 10 ? '0' + tm.getDate() : tm.getDate()
    var hours = tm.getHours()
    var minutes = tm.getMinutes()
    var seconds = tm.getSeconds()

    this.tm = { year: yr, month: month, day: day, hours: hours, minutes: minutes, seconds: seconds }
  }

  padNum (num, size) {
    var s = num + ''
    while (s.length < (size || 2)) {
      s = '0' + s
    }
    return s
  }

  formatDateWithSecond() {
    let tm = this.tm
    return this.padNum(tm.year, 4) + '年' + this.padNum(tm.month, 2) + '月' + this.padNum(tm.day, 2) + '日' + ' ' + this.padNum(tm.hours, 2) + ':' + this.padNum(tm.minutes, 2) + ':' + this.padNum(tm.seconds, 2)
  }

  formatDate() {
    let tm = this.tm
    return tm.year + '年' + tm.month + '月' + tm.day + '日'
  }
}

export default TimeConverter
