require('./localforage')
const localForage = window.localforage

class Storage {
  /**
   * 操作持久化存储类
   */

  static clearAll() {
    localForage.clear()
    window.localStorage.clear()
  }

  static hasKey(key) {
    return window.localStorage.hasOwnProperty(key)
  }

  static setItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  static getItem(key) {
    return JSON.parse(window.localStorage.getItem(key))
  }

  static setItemAsync(key, value, cb) {
    localForage.setItem(key, value, (err) => {
      return cb(err)
    })
  }

  static getItemAsync(key, cb) {
    localForage.getItem(key, cb)
  }
}
localForage.clear()

export default Storage
