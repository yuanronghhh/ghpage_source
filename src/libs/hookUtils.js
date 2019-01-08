class HookUtils {
  static hookObject(obj) {
    let proxy = Object.create({})

    Object.keys(obj).forEach((key) => {
      if (typeof(obj[key]) === 'function') {
        return
      }

      Object.defineProperty(proxy, key, {
        enumerable: true,
        configurable: true,
        writetable: true,
        get: () => {
          return obj.get.call(this, key)
        },
        set: (value) => {
          obj.set.call(this, key, value)
        }
      })

      proxy[key] = obj[key]
    })

    return proxy
  }
}

export default HookUtils
