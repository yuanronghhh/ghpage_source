{
  "title": "U盘挂载无法正确显示中文，且权限不够",
  "profile": "U盘里面的文件是在win下创建的，重新将挂载即可",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2018-12-31T16:35:01"
}
# U盘 在Ubuntu下挂载后出现权限不够, 仅root可以有写权限

## Code
```bash
sudo mount -t vfat /dev/sdb1 -o iocharset=utf8,uid=1000,gid=1000 /mnt/U_DISK
```
