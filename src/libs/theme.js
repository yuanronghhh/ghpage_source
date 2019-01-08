import config from '../config/config'
import Logger from '../libs/logger'

let themes = {
  light: require('../assets/css/light.scss'),
  dark: require('../assets/css/dark.scss')
  /* glass: require('../assets/css/glass.scss') */
}

class Theme {
  static switchTheme(theme) {

    if(this.theme !== '' && this.theme === theme) {
      return
    }

    this.disableTheme(theme)

    if(!themes.hasOwnProperty(theme)) {
      return
    }

    let succ = themes[theme]
    if (!succ) {
      return
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
        Logger.debug("[switch theme]", name)
        sty.disabled = false
      } else {
        sty.disabled = true
      }
    }
  }
}

Theme.themes = Object.keys(themes)
Theme.theme = ''
Theme.auto_switch = 'on'

export default Theme
