{
  "title": "几种Node的调试方法",
  "profile": "Node有内置调试和三方调试方式, 现在三方调试基本已经不推荐了，请尽量使用chrome",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2018-12-30T12:10:01"
}
# node调试方法

记录几种node调试方法，后面两个调试比较友好。
~~这里Node版本是`v4.5`, 推荐使用`node-inspector`进行调试~~。  
现在node版本已经是`v8.0+`了，官方推荐使用`--inspect`参数配合`chrome`进行调试。

## 自带debug模块
### 自带debug参数
1. 新建文件`app.js`
2. 项目目录打开cmd, `node debug app.js`即可调试
3. 输入`n`回车可以执行下一步，输入`repl`后进入交互环境, 然后就可以执行`js`打印任意值.
```javascript
F:\tmp>node debug tmp.js
< Debugger listening on [::]:5858
connecting to 127.0.0.1:5858 ... ok
break in F:\tmp\tmp.js:1
> 1 "use strict";
  2 var Promise = require('bluebird');
  3
```

### 使用监听模式调试
1. 项目目录打开cmd, 启动一个监听, `node --debug app.js localhost: 8080`
2. 新开一个cmd，使用`node debug localhost: 8080`
```javascript
F:\tmp>node --debug-brk tmp.js
Debugger listening on [::]:5858
...
...
然后新开一个cmd
F:\tmp>node debug localhost:5858
connecting to localhost:5858 ... ok
break in F:\tmp\tmp.js:1
> 1 "use strict";
  2 var Promise = require('bluebird');
  3
```

### 代码中插入debugger
1. 在代码中写入`debugger;`
2. 项目目录打开cmd, 输入`node debug app.js`即可调试
3. 和方法一类似，不过输入c回车可以跳到`debugger;`的地方,比较方便。
4. 在行号上面可以点击打断点，左边导航,后边是调用栈和watch窗口
```javascript
F:\tmp>node debug tmp.js
< Debugger listening on [::]:5858
connecting to 127.0.0.1:5858 ... ok
break in F:\tmp\tmp.js:1
> 1 "use strict";
  2 var Promise = require('bluebird');
  3
c
break in F:\tmp\tmp.js:4
  2 var Promise = require('bluebird');
  3
> 4 debugger;
  5 for(var i = 0; i < 5; i++) {
  6   (function(i){
```

### 使用node自带--inspect调试, ~~实验功能~~
> 现在已经是推荐调试的功能了，打开如果chrome和node均为最新，这种方式推荐。
1. 项目目录打开cmd, 命令行输入`node --inspect-brk app.js`, 加`brk`是停在第一行，否则直接运行。
2. 然后打开`chrome开发者工具`, `chrome`下的快捷键是`ctrl+shift+i`。
3. 新版浏览器可以看到左上角有个`node图标`, 点击后就可以看到调试窗口了。

## IDE中调试
### 在webstorm等IDE中调试
```javascript
自己未尝试过，不作介绍了
```

## 第三方调试库
### 使用node-inspector调试(仅支持chrome, opera)
1. 项目目录打开cmd, 启动监听`node --debug-brk app.js`
2. 新开一个cmd输入`node-inspector`
3. 打开chrome，输入`localhost:8080`, 比较慢，高版本的node(例如6.9)可能打不开
4. 之前在4.x中尝试可以,升级5.0后报错，如果成功, 就和调试js一样了

## 其他

1. 项目目录打开方法(win7及以上)
```bash
shift + 鼠标右键
```

2. node-inspector安装
```bash
npm install -gd node-inspector
```

3. inspector链接
[node-inspector](https://github.com/node-inspector/node-inspector)

4. 官方debugger链接
[debugger](https://nodejs.org/api/debugger.html)
