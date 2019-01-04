{
  "title": "source_insight使用",
  "profile": "因为要看源码，于是试用了一下source insight，感觉不错",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2017-03-10T00:00:00"
}
# Source Insight查看源代码

## 介绍
`source insight`是`Source Dynamics, Inc`开发的一款强大的, 支持多语言代码分析的商业编辑器。
支持快速导航，快速定位，智能编辑，多语言动态分析和高亮等功能，方便程序员快速理解分析程序。

[软件下载地址](https://www.sourceinsight.com/download/)
> 软件并非免费，可以先试用30天。

## 软件配置

- 新建一个工程`CodeView`
1. 打开选项(或者`alt+shift+N`) Project --> New Project 进入Project settings
2. Project settings里面改一下路径, 其他默认即可, 下一步添加项目文件。
3. 选择需要查看的源码目录, 然后点击Add Tree, 添加完后点close到主界面。
4. 点击View --> Project Window 和 Relation Window, 得到工程目录和调用关系窗口, 点击工程窗口下面的第一个Project FileList图标(鼠标悬停可以看到)。
5. 点击工程下面的Directory, 让文件列表按文件夹排序。
6. 双击代码，在需要查看的地方鼠标右键菜单查看需要的功能。

- 选择一个暗色主题
[参考链接](http://www.cnblogs.com/JonnyLulu/p/3871413.html)

## 疑问
> 如何显示文件夹源代码文件夹？

有一个工程下面有一个Project Browser，但显示的是整个c:\\盘目录，没用，根据上面软件配置5，按文件夹排序可以达到效果。

> 为何点击函数，调用关系图没有更新？

要点一下关系图下面的刷新按钮。

> 浏览源代码时如何锁定调用关系图？

调用关系图下面有一个锁的图标，点击即可，不需要时。
