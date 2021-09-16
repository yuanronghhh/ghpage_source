{
  "title": "ubuntu 网络配置问题",
  "profile": "ubuntu 18 网络配置问题",
  "create_at": "2020-10-14T20:51:00",
  "update_at": "2020-10-14T20:51:00"
}
# ubuntu 网络配置问题

## 配置ip位置
`/etc/network/interfaces`

```bash
auto lo
iface lo inet loopback
auto wlp2s0
iface wlp2s0 inet dhcp
```

## 配置dns
由于`ubuntu 18` 改用了`netplan` 作为新配置方式，
`resolvconf` 服务会自动临时生成文件`/etc/resolv.conf`
并自动填入类似下面`127.0.0.53`,
因为`resolv.conf`是链接到`../run` 目录的位置， 所以修改重启覆盖失效。
```bash
nameserver 127.0.0.53
```

### 解决办法
#### 方法1: 链接一个实际文件  
1. 停用服务`resolvconf`, 防止重新生成
```
$ sudo systemctl disable resolvconf.service
```

2. 链接新文件
因为`resolvconf`之前就使用`/etc/resolvconf/resolv.conf.d/base` 这个文件，
所以，删掉旧的`/etc/resolv.conf`，重新链接一下。
```
$sudo rm -rf /etc/resolv.conf
$sudo ln -s /etc/resolvconf/resolv.conf.d/base /etc/resolv.conf
```
3. 填入自己的`dns`的`ip`
使用`vim`打开`/etc/resolvconf/resolv.conf.d/base`文件, 然后填入例如`nameserver 114.114.114.114`

#### 方法2: 使用`netplan`配置
参考`https://blog.csdn.net/superjunenaruto/article/details/105495183`
