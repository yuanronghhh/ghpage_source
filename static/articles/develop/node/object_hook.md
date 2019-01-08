{
  "title": "JavaScript使用Object.defineProperty绑定",
  "profile": "绑定对象的getter和setter",
  "create_at": "2018-12-31T12:10:01",
  "update_at": "2018-12-31T12:10:01"
}
# JavaScript绑定对象赋值

> 注意: 代码仅适用于简单的赋值，对于对象有多个层次结构
> 需要具体参考`vue`等源码实现

## hook的函数
使用`Object.keys`遍历, 使用`Object.defineProperty`重写`getter`和`setter`,
`proxy`是新创建的对象, 用于赋值后返回
```javascript
/* file: hookUtils.js */
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
```

## 使用
```javascript
/* file: config.js */
import HookUtils from '../libs/hookUtils'

let config = {
  is_debug: true,
  get: (key) => {
    return this[key]
  },
  set: (key, value) => {
    this[key] = value
  }
}
/* call */
config = HookUtils.hookObject(config)
export default config
```
通过调用 `HookUtils.hookObject(config)`, 接收返回值即可
此时当赋值时，这里的`set`就会被调用.
