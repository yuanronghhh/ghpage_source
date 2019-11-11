{
  "title": "mysql ssl 生成，配置连接",
  "profile": "一个脚本生成mysql的ssl，用的时候再改稍微改一下",
  "create_at": "2019-03-26T00:00:00",
  "update_at": "2019-11-11T00:00:00"
}
# Mysql 生成SSL连接文件的脚本

```bash
#!/bin/bash

read -p "gen_cert(y/n):" gen_cert
if [[ -n "$gen_cert" && $gen_cert = "y" ]]; then
  openssl genrsa -out ca-key.pem 2048
  openssl req -new -x509 -nodes -days 3650 -key ca-key.pem -out ca-cert.pem -subj "//C=US/ST=NY/O=GHCompany/CN=ca"
  
  openssl req -newkey rsa:2048 -nodes -days 3650 -keyout server-key.pem -out server-req.pem -subj "//C=US/ST=NY/O=GHCompany/CN=server"
  openssl rsa -in server-key.pem -out server-key.pem
  openssl x509 -req -in server-req.pem -CA ca-cert.pem -CAkey ca-key.pem -set_serial 01 -out server-cert.pem
  
  openssl req -newkey rsa:2048 -nodes -days 3650 -keyout client-key.pem -out client-req.pem -subj "//C=US/ST=NY/O=GHCompany/CN=client"
  openssl rsa -in client-key.pem -out client-key.pem
  openssl x509 -req -in client-req.pem -CA ca-cert.pem -CAkey ca-key.pem -set_serial 01 -out client-cert.pem
  mysql -uroot -proot -e 'show variables like "%ssl%"'
fi

read -p "mysql ssl user:" mysql_ssl_user
read -p "ssl user pass:" mysql_ssl_pass
mysql -h localhost -u$mysql_ssl_user -p$mysql_ssl_pass --ssl-cert=client-cert.pem --ssl-key=client-key.pem
```
