{
  "title": "linux下使用wifi扫描连接",
  "profile": "ubuntu下使用wifi扫描的脚本",
  "create_at": "2018-06-05T01:15:03",
  "update_at": "2018-12-13T15:27:34"
}
# ubuntu扫描wifi连接

## 说明
这个脚本适应在没有`gui`情况下执行， 需要预先有`wpa`程序才行，如果要密码，
`/etc/wpa_supplicant/wpa_supplicant.conf` 添加一个, 如果有问题，可以修改
一下`51`行，可能设备不是`wlan0`。

> 如果你电脑没有`wpa`，那你需要试一下注释里面的`nmcli`命令，如果你安装了`nmclitui`，
直接用这个命令吧，这是`nmcli`的界面版本。

```bash
#!/bin/bash

# nmcli dev wifi connect <name> password <password> iface wlan1 [profile name]
# wpa_supplicant.conf format:
#
#   network={
#     ssid="zhangyida"
#     psk="123123123"
#     key_mgmt=WPA-PSK
#     priority=1
#   }
#

# show dev name
device_name=`iw dev |grep "Interface"|awk '{print $2}'`

# set device up
sudo ip link set $device_name up

# disconnect
echo "want disconnect?(y|n): "
read FLAG
if [ $FLAG = "y" ]; then
  SSID=`sudo iw dev|grep 'ssid'|awk '{print $2}'`;
  if [ ! -z "$SSID" ]; then
    sudo iw dev $device_name disconnect
    echo "$SSID 断开成功";
  else 
    echo "设备并没有连接";
  fi
  return;
fi

# scanning
echo "扫描设备: "
wdev=`iw dev|grep "Interface"|awk -F ' ' '{print $2}'`
sudo iw dev $wdev scan |grep "SSID"|awk -F 'SSID:' '{print $2}'

# connect
echo "if wifi locked, please change script"
echo "输入SSID名称(don't need the whole name): "
read name

OPEN="n"
if [ $OPEN = "y" ]; then
  SSID=`sudo iw dev $device_name scan |grep -e "SSID: .*$name.*"|awk -F ": " '{print $2}'|head -1`
  echo "connecting: $SSID"
  sudo iw dev $device_name connect -w $SSID
else
  # dhclient for get ip automaticly
  sudo wpa_supplicant -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf
  dhclient
fi
```
