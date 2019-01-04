{
  "title": "windows下找回鼠标右键cmd命令",
  "profile": "鼠标右键是一个非常方便的功能，可以通过修改注册表方式添加",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2018-12-31T16:35:01"
}

# windows 添加右键打开命令行

### 步骤
#### 添加快捷方式
新建文件`right_cmd.reg`, 添加下面的内容, 双击执行合并.
其中:
`Directory`表明是在文件夹下的菜单.
`Background`表明在非选中状态下的菜单.
```sh
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Shell\OpenCmdHere]
@="open command here"

"Icon"="cmd.exe"
[HKEY_CLASSES_ROOT\Directory\Shell\OpenCmdHere\command]
@="cmd.exe /k pushd %L"

[HKEY_CLASSES_ROOT\Directory\Background\Shell\OpenCmdHere]
@="open command here"

"Icon"="cmd.exe"
[HKEY_CLASSES_ROOT\Directory\Background\Shell\OpenCmdHere\Command]
@="cmd.exe /s /k pushd %V"

[HKEY_CLASSES_ROOT\Drive\Shell\OpenCmdHere]
@="open command here"

"Icon"="cmd.exe"
[HKEY_CLASSES_ROOT\Drive\Shell\OpenCmdHere\command]
@="cmd.exe /k pushd %V"
```

### 删除快就方式
移除注册表，新建`remove_right_cmd.reg`文件, 粘贴下面代码，然后双击执行。
即在之前注册表前添加横线`-`
```remove
Windows Registry Editor Version 5.00

[-HKEY_CLASSES_ROOT\Directory\shell\OpenCmdHere]
[-HKEY_CLASSES_ROOT\Directory\shell\OpenCmdHere\command]

[-HKEY_CLASSES_ROOT\Directory\Background\shell\OpenCmdHere]
[-HKEY_CLASSES_ROOT\Directory\Background\shell\OpenCmdHere\Command]

[-HKEY_CLASSES_ROOT\Drive\shell\OpenCmdHere]
[-HKEY_CLASSES_ROOT\Drive\shell\OpenCmdHere\command]
```

### 其他
c#编程可以用Microsoft.Win32下的Registry改注册表，和reg文件作用一样
__[编程参考c#实现](https://github.com/yanxyz/OpenTCHere.git)__
