{
  "title": "搭建ghpage测试环境",
  "profile": "ghpage路径带前缀，所以搭建一个模拟环境在本地调试, 只有一个js代码文件",
  "create_at": "2018-12-31T12:10:01",
  "update_at": "2018-12-31T00:00:00"
}
# 模拟ghpage服务环境

## 说明
ghpage非hash模式不能刷新，而且总是路径前面带`ghpage/`作为前缀，
因此，如果使用绝对路径则请求文件则必须带`ghpage/`, 然后`static/js/*`
所以这里用`express`构建模拟环境调试。

## 使用
```
1. 安装express body-parser cookie-parser morgan 依赖
2. 修改文件中的`dist_directory`路径
3. 启动命令行`node ghpage`
4. 浏览器访问`localhost:6060/ghpage`
```

## 代码
```javascript
/* file: ghpage.js */
const http          = require('http');
const path          = require("path");
const body_parser   = require("body-parser");
const cookie_parser = require("cookie-parser");
const os            = require('os');
const fs            = require("fs");
const ifaces        = os.networkInterfaces();
const express       = require("express");
const app           = express();
const port          = 6060;
const morgan        = require('morgan');
var dist_directory  = '/home/greyhound/Documents/ghpage/dist';

app.use(morgan('dev'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(cookie_parser());
app.use(express.static(path.join(dist_directory)));
app.set('views', path.join(dist_directory, 'ghpage'));
app.set('view engine', 'html');
app.engine('html',require('ejs').renderFile);

app.get("/ghpage", function(req, res){
  console.log("/ called " + Math.floor(Math.random()*100));
  res.render("index");
});

app.get("*", function(req, res) {
  return res.status(404).render('404.html')
})

var iptable       = {};
app.listen(port,function(req, res){
  for (var dev in ifaces) {
    ifaces[dev].forEach(function(dt, alias) {
      if (dt.family == 'IPv4') {
        iptable[dev + (alias ? ':' + alias: '')] = dt.address;
      }
    });
  }

  console.log(iptable);
  console.log("start " + port);
});
```
