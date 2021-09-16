{
  "title": "U盘挂载无法正确显示中文，且权限不够",
  "profile": "U盘里面的文件是在win下创建的，重新将挂载即可",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2021-06-13T20:55:00"
}
# U盘 在Ubuntu下挂载后出现权限不够, 仅root可以有写权限

## Code
```bash
#!/bin/bash
UBLOCK=`sudo fdisk -l | grep -A 8 'CoolFlash'|grep '/dev/'|awk '{print $1}'`

if [ "$1" == "-m" ]; then
  if [ "$2" != "" ]; then
    UBLOCK=$2
  fi

  sudo mount -t vfat ${UBLOCK} -o iocharset=utf8,uid=1000,gid=1000 /mnt/U_DISK
elif [ "$1" == "-u" ]; then
  sudo umount /mnt/U_DISK
fi
```
