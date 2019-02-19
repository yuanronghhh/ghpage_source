{
  "title": "开发时调试的日志类",
  "profile": "js日志类，用于调试输出，手机上会在右下角显示输出内容",
  "create_at": "2019-02-19T00:00:00",
  "update_at": "2019-02-19T00:00:00"
}
# js日志浏览器端调试类

## 实现

说明
1. 日志需要判断`browser.js`配合使用, 这个代码来自`flv.js`的代码库，当然也可以自己写，用于判断系统的平台和版本。
2. 还要引入`config.js`，通过判断`is_debug`这个值是否输出。
3. 日志通过添加`div`到`body`标签上实现日志输出。

> 日志仅实现了`debug`, 没有实现`info`, `warning`等级。

## 使用
1. 引入入`logger.js`, `browser.js`。
2. 在`config`里面开启`is_debug`设置为`true`。
3. 使用`Logger.debug`, `Logger.debug_json`输出, 格式化输出仅支持`%s`, `%d` 两种，不能输出自引用对象，会抛异常。
4. 手机端在调试模式下会在右下角显示内容。

## 代码
### logger.js
```javascript
/* file: logger.js */
import config from '../config/config'
import browser from '../config/browser'

class PollyFill {
  static strFormat(fmt, ...obj) {
    if(fmt.indexOf("%") === -1) {
      for (let arg of obj) {
        try {
          if (typeof(arg) === 'object') {
            fmt += JSON.stringify(arg)
          } else {
            fmt += arg
          }
        } catch (err) {
          fmt = "[error]" + err.message
        }
      }

      return fmt
    }

    return fmt.replace(/%d/g, (match, number) => {
      return typeof obj[number] !== 'undefined' ? obj[number] : match
    }).replace(/%s/g, (match, number) => {
      return typeof obj[number] !== 'undefined' ? obj[number] : match
    })
  }
}

class Toast {
  static toast(fmt, ...msg) {
    let rs = PollyFill.strFormat(fmt, ...msg)
    let dm = document.getElementById('toast-msg')
    let bd = document.getElementsByTagName('body')

    if (dm === null) {
      dm = document.createElement('div')
      dm.style.cssText = this.css
      dm.id = 'toast-msg'
      dm.outHTML = this.template
      bd[0].appendChild(dm)
    }

    let msg_dm = document.createElement('div')
    msg_dm.innerHTML = rs
    dm.appendChild(msg_dm)

    setTimeout(() => {
      msg_dm.remove()
    }, 7000)
  }
}
Toast.css = 'position: fixed; padding: 0 1%; bottom: 0; right: 0; z-index: 999; color: black; background: white;'

class Logger {
  static log_out(fmt, ...obj) {
    if (!config.is_debug) {
      return
    }

    // 判断平台这里
    const is_phone = ['android', 'iphone', 'ipad', 'windows phone'].indexOf(browser.platform) > -1 ? true: false
    if (is_phone) {
      Toast.toast(fmt, ...obj)
    }
    console.log(fmt, ...obj)
  }

  static debug(fmt, ...obj) {
    this.log_out(fmt, ...obj)
  }

  static debug_json(fmt, ...obj) {
    for (let i = 0 ; i < obj.length; i++) {
      obj[i] = JSON.stringify(obj[i])
    }

    this.log_out(fmt, ...obj)
  }
}

export default Logger
```

### browser.js
```javascript
/* eslint-disable */
/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let Browser = {};

function detect() {
    // modified from jquery-browser-plugin

    let ua = self.navigator.userAgent.toLowerCase();

    let match = /(edge)\/([\w.]+)/.exec(ua) ||
        /(opr)[\/]([\w.]+)/.exec(ua) ||
        /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(iemobile)[\/]([\w.]+)/.exec(ua) ||
        /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
        ua.indexOf('compatible') < 0 && /(firefox)[ \/]([\w.]+)/.exec(ua) ||
        [];

    let platform_match = /(ipad)/.exec(ua) ||
        /(ipod)/.exec(ua) ||
        /(windows phone)/.exec(ua) ||
        /(iphone)/.exec(ua) ||
        /(kindle)/.exec(ua) ||
        /(android)/.exec(ua) ||
        /(windows)/.exec(ua) ||
        /(mac)/.exec(ua) ||
        /(linux)/.exec(ua) ||
        /(cros)/.exec(ua) ||
        [];

    let matched = {
        browser: match[5] || match[3] || match[1] || '',
        version: match[2] || match[4] || '0',
        majorVersion: match[4] || match[2] || '0',
        platform: platform_match[0] || ''
    };

    let browser = {};
    if (matched.browser) {
        browser[matched.browser] = true;

        let versionArray = matched.majorVersion.split('.');
        browser.version = {
            major: parseInt(matched.majorVersion, 10),
            string: matched.version
        };
        if (versionArray.length > 1) {
            browser.version.minor = parseInt(versionArray[1], 10);
        }
        if (versionArray.length > 2) {
            browser.version.build = parseInt(versionArray[2], 10);
        }
    }

    if (matched.platform) {
        browser[matched.platform] = true;
    }

    if (browser.chrome || browser.opr || browser.safari) {
        browser.webkit = true;
    }

    // MSIE. IE11 has 'rv' identifer
    if (browser.rv || browser.iemobile) {
        if (browser.rv) {
            delete browser.rv;
        }
        let msie = 'msie';
        matched.browser = msie;
        browser[msie] = true;
    }

    // Microsoft Edge
    if (browser.edge) {
        delete browser.edge;
        let msedge = 'msedge';
        matched.browser = msedge;
        browser[msedge] = true;
    }

    // Opera 15+
    if (browser.opr) {
        let opera = 'opera';
        matched.browser = opera;
        browser[opera] = true;
    }

    // Stock android browsers are marked as Safari
    if (browser.safari && browser.android) {
        let android = 'android';
        matched.browser = android;
        browser[android] = true;
    }

    browser.name = matched.browser;
    browser.platform = matched.platform;

    for (let key in Browser) {
        if (Browser.hasOwnProperty(key)) {
            delete Browser[key];
        }
    }
    Object.assign(Browser, browser);
}

detect();

export default Browser;
```
