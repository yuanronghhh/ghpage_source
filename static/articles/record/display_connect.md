{
  "title": "ubuntu使用HDMI接口",
  "profile": "ubuntu下xrandr程序可以直接调用进行投射屏幕",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2018-12-30T12:10:01"
}
ubuntu使用HDMI接口

将xrandr方法连接, 下面是例子。

```sh
#!/bin/sh
xrandr --output HDMI1  --same-as LVDS1 --mode 1360x768
#xrandr --output HDMI1 --same-as LVDS1 --auto
#         打开外接显示器(--auto:最高分辨率)，与笔记本液晶屏幕显示同样内容（克隆）
#xrandr --output HDMI1 --same-as LVDS1 --mode 1360x768
#         打开外接显示器(分辨率为1280x1024)，与笔记本液晶屏幕显示同样内容（克隆）
#
#xrandr --output HDMI1 --right-of LVDS1 --auto
#         打开外接显示器(--auto:最高分辨率)，设置为右侧扩展屏幕
#
#xrandr --output HDMI1 --left-of LVDS1 --auto
#         打开外接显示器(--auto:最高分辨率)，设置为左侧扩展屏幕
#
#xrandr --output HDMI1 --off
#          关闭外接显示器
#
#xrandr --output HDMI1 --auto --output LVDS1 --off
#        打开外接显示器，同时关闭笔记本液晶屏幕（只用外接显示器工作）
#
#xrandr --output HDMI1 --off --output LVDS1 --auto
#        关闭外接显示器，同时打开笔记本液晶屏幕 （只用笔记本液晶屏）
```
