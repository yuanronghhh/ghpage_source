class Storage {
  /**
   * 操作持久化存储类
   */

  static cache(path, data) {
    var has_data = window.localStorage.hasOwnProperty(path)

    if (has_data) {
      return JSON.parse(window.localStorage.getItem(path))
    } else {
      if (data) {
        const result = JSON.stringify(data)

        window.localStorage.setItem(path, result)
      }

      return null
    }
  }

  static hasItem(key) {
    return window.localStorage.getItem(key)
  }

  static setItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  static getItem(key) {
    return JSON.parse(window.localStorage.getItem(key))
  }

  static cleanCache() {
    window.localStorage.clear()
  }
}

export default Storage
