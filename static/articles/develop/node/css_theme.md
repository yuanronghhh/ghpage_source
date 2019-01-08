{
  "title": "网页切换主题颜色的实现",
  "profile": "将webpack打包成分开的style, 实现的的css主题切换",
  "create_at": "2018-12-31T12:10:01",
  "update_at": "2017-12-31T12:10:01"
}
# 关于主题切换的实现

## 实现原理
1. 将webpack的`style-loader`的`extract`设置成`false`, css将分开写入到网页的header上面
2. 配合已经在`css`文件里面写入的注释`/* theme: dark */`, 扫描头部的样式, 
把不需要的主题的`disabled`属性设置成`true`。
3. 通过`require`引入需要的主题即可。

## 具体实现

### 配置`webpack`
```javascript
rules: utils.styleLoaders({
  sourceMap: config.build.productionSourceMap,
  extract: false, /* disable this */
  usePostCSS: true
})
```

### 配置`css`文件, 编写函数
在**`css`文件开头**写`/* theme: dark */`, 标注这个主题名称, 例如:  
```javascript
/* file: dark.css */
/* theme: dark */
body {
  background-color: #434343 !important;
}
...
```

通过正则匹配出来, 然后禁用掉与`准备切换的主题`名称不一致的样式.  
```javascript
static disableTheme(theme) {
  let stys = document.querySelectorAll('style')

  if (stys === null || stys.length === 0) {
    return
  }

  for(let i = 0; i < stys.length; i++) {
    let sty = stys[i]
    /* 匹配主题的正则 */
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
```

### 代码写好所有样式
```javascript
let themes = {
  light: require('../assets/css/light.scss'),
  dark: require('../assets/css/dark.scss')
  /* glass: require('../assets/css/glass.scss') */
}
```
> 注意: 这里`require`里面一定是路径，不能是变量，因为`require`不能在编译后工作.

### 启用样式
```javascript
let succ = themes[theme]
if (!succ) {
  return
}
```

## 完整代码
```javascript
/* file: theme.js */
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
```
