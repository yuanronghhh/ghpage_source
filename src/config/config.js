import Storage from '../libs/storage'
import HookUtils from '../libs/hookUtils'

let config = {
  theme: 'light',
  is_debug: false,
  auto_switch: 'off',
  get: (key) => {
    return this[key]
  },
  set: (key, value) => {
    this[key] = value
    Storage.setItem('config', config)
  }
}

/* recover config theme */
let store = Storage.getItem('config')
if (store) {
  Object.assign(config, {
    "theme": store["theme"]
  })
}

config = HookUtils.hookObject(config)
export default config
