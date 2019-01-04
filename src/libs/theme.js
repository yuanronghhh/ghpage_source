import Logger from '../libs/logger'
import config from '../config/config'

let themes = {
  light: require('../assets/css/light.scss'),
  dark: require('../assets/css/dark.scss')
}

class Theme {
  static switchTheme(theme) {

    if(this.theme === theme) {
      return
    }

    this.disableTheme(theme)

    if(themes.hasOwnProperty(theme)) {
      let rs = themes[theme]

      if (!rs) {
        return
      }
    }

    config.theme = this.theme = theme
  }

  static disableTheme(theme) {
    let stys = document.querySelectorAll('style')

    if (stys === null || stys.length === 0) {
      return
    }

    for(let i = 0; i < stys.length; i++) {
      let sty = stys[i]
      let mt = sty.textContent.match(/theme: (\w+){1}/)
      let name

      if (mt === null) {
        continue
      }

      name = mt[1]

      if (name === theme) {
        Logger.debug('[swith theme]', name)
        sty.disabled = false
      } else {
        sty.disabled = true
      }
    }
  }
}

Theme.theme = 'default'
Theme.auto_switch = 'on'

export default Theme
