{
  "title": "找回win7下的window photo viewer",
  "profile": "感觉win10下的图片浏览器启动很慢，所以下面是找回win7下图片浏览器的方法",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2018-12-31T16:47:01"
}
# 找回window photo viewer

本以为win10以后没有这个了, 突然发现还有, 用网上找的注册表改了一下.
```bat
Windows Registry Editor Version 5.00
; Change Extension's File Type
[HKEY_CURRENT_USER\Software\Classes\.jpg]
@="PhotoViewer.FileAssoc.Tiff"
; Change Extension's File Type
[HKEY_CURRENT_USER\Software\Classes\.jpeg]
@="PhotoViewer.FileAssoc.Tiff"
; Change Extension's File Type
[HKEY_CURRENT_USER\Software\Classes\.gif]
@="PhotoViewer.FileAssoc.Tiff"
; Change Extension's File Type
[HKEY_CURRENT_USER\Software\Classes\.png]
@="PhotoViewer.FileAssoc.Tiff"
; Change Extension's File Type
[HKEY_CURRENT_USER\Software\Classes\.bmp]
@="PhotoViewer.FileAssoc.Tiff"
; Change Extension's File Type
[HKEY_CURRENT_USER\Software\Classes\.tiff]
@="PhotoViewer.FileAssoc.Tiff"
; Change Extension's File Type
[HKEY_CURRENT_USER\Software\Classes\.ico]
@="PhotoViewer.FileAssoc.Tiff"
```
