class Logger {
  static debug(fmt, ...obj) {
    console.log(fmt, ...obj)
  }

  static debug_json(fmt, ...obj) {
    for (let i = 0 ; i < obj.length; i++) {
      obj[i] = JSON.stringify(obj[i])
    }

    console.log(fmt, ...obj)
  }
}

export default Logger
