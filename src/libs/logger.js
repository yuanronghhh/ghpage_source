import config from '../config/config'
import env from '../config/env'

class PollyFill {
  static strFormat(fmt, ...obj) {
    if(fmt.indexOf("%") === -1) {
      for (let arg of obj) {
        try {
          if (typeof(arg) === 'object') {
            fmt += JSON.stringify(arg)
          } else {
            fmt += arg
          }
        } catch (err) {
          fmt = "[error]" + err.message
        }
      }

      return fmt
    }

    return fmt.replace(/%d/g, (match, number) => {
      return typeof obj[number] !== 'undefined' ? obj[number] : match
    }).replace(/%s/g, (match, number) => {
      return typeof obj[number] !== 'undefined' ? obj[number] : match
    })
  }
}

class Toast {
  static toast(fmt, ...msg) {
    let rs = PollyFill.strFormat(fmt, ...msg)
    let dm = document.getElementById('toast-msg')
    let bd = document.getElementsByTagName('body')

    if (dm === null) {
      dm = document.createElement('div')
      dm.style.cssText = this.css
      dm.id = 'toast-msg'
      dm.outHTML = this.template
      bd[0].appendChild(dm)
    }

    let msg_dm = document.createElement('div')
    msg_dm.innerHTML = rs
    dm.appendChild(msg_dm)

    setTimeout(() => {
      msg_dm.remove()
    }, 7000)
  }
}
Toast.css = 'position: fixed; padding: 0 1%; bottom: 0; right: 0; z-index: 999; color: black; background: white;'

class Logger {
  static log_out(fmt, ...obj) {
    if (!config.is_debug) {
      return
    }

    const is_phone = ['android', 'iphone', 'ipad', 'windows phone'].indexOf(env.browser.platform) > -1 ? true: false
    if (is_phone) {
      Toast.toast(fmt, ...obj)
    }
    console.log(fmt, ...obj)
  }

  static debug(fmt, ...obj) {
    this.log_out(fmt, ...obj)
  }

  static debug_json(fmt, ...obj) {
    for (let i = 0 ; i < obj.length; i++) {
      obj[i] = JSON.stringify(obj[i])
    }

    this.log_out(fmt, ...obj)
  }
}

export default Logger
