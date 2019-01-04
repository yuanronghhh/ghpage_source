import Storage from '../libs/storage'

let config = {
  theme: ''
}

Object.keys(config).forEach((key) => {
  Object.defineProperty(config, key, {
    get: () => {
      return this[key]
    },
    set: (val) => {
      this[key] = val
      Storage.setItem('config', config)
    }
  })
})

export default config
