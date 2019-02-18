# Vue博客源码

## 说明
vue编写的博客，主要自己记录一下东西

地址：[https://yuanronghhh.github.io/ghpage](https://yuanronghhh.github.io/ghpage)

## 功能
1. 页内搜索。
2. 简易的markdown编辑, 目录索引。
3. 黑白两个主题，可自己定义。
4. 主要适应手机和PC浏览，几乎没有什么特效。
5. 将`config`里的`debug`设置为`true`，手机右下角会有一个输出可以看到, 具体看`libs/logger.js`。

## 使用

### 开发
```bash
make dev
```

### 本地发布
```bash
make ghpage
```
然后将`dist/ghpage`目录下文件提交到`github`项目的`ghpage`分支即可。

