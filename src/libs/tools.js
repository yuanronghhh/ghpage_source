import PathUtils from './pathUtils'
import Storage from './storage'

class Tools {
  static getTime (tm) {
    let yr = tm.getFullYear()
    let month = (tm.getMonth() + 1)
    let day = tm.getDate()
    let hours = tm.getHours()
    let minutes = tm.getMinutes()
    let seconds = tm.getSeconds()

    return yr + "年" + month + "月" + day + "日" + " " + hours + ":" + minutes + ":" + seconds
  }

  static getFile(path, cb) {
    if(!path) {
      throw new Error("[Error] not find path")
    }

    path = PathUtils.toPagePath(path)

    Storage.getItemAsync(path, (err, data) => {
      if (err) {
        return cb(err, null)
      }

      if(data) {
        return cb(null, data)
      }

      window.fetch(path).then((res) => {
        return res.text()
      }).then((data) => {
        Storage.setItemAsync(path, data, (err) => {
          if (err) {
            return cb(err)
          }

          return cb(null, data)
        })
      }).catch((err) => {
        err.message = `Failed to fetch ${path}`
        return cb(err, null)
      })
    })
  }

  static searchInArray (key, list) {
    let key_reg = (key || '')
    // if(app.config.getConfig("s_ignore_case")){
    key_reg = key_reg.toLowerCase()
    // }

    let search_list = list || []

    return search_list.filter(function(ele){
      let s_ele = JSON.stringify(ele)

      // if(app.config.getConfig("s_ignore_case")){
      s_ele = s_ele.toLowerCase()
      // }

      if(s_ele.search(key_reg) > -1){
        return true
      }
    })
  }
}

export default Tools
