{
  "title": "搭建gitweb",
  "profile": "使用gitweb浏览git项目, 方便浏览项目历史",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2017-03-10T12:10:01"
}
## 搭建gitweb

### 安装`fcgiwrap`和`spawn-fcgi`

```shell
sudo apt install fcgiwrap spawn-fcgi
```

### 编辑并启动fcgiwrap
创建文件`/usr/lib/systemd/system/fcgiwrap.service`

```
[Unit]
Description=Simple server for running CGI applications over FastCGI
After=syslog.target network.target

[Service]
Type=forking
Restart=on-abort
PIDFile=/var/run/fcgiwrap.pid
ExecStart=/usr/bin/spawn-fcgi -s /var/run/fcgiwrap.sock -P /var/run/fcgiwrap.pid -u http -g http -- /usr/sbin/fcgiwrap
ExecStop=/usr/bin/kill -15 $MAINPID

[Install]
WantedBy=multi-user.target
```

启动
```
service --status-all 查看一下状态.
service fcgiwrap start.  
```

### 配置nginx
注意: `fastcgi_pass`换成socket,否则报404错误,
include 也可以用`fastcgi_params`;

编辑文件: `/etc/nginx/conf.d/my.conf`, 因为nginx.conf里面有`include conf.d/*.conf`, 所以可以在这里配置可以生效.

```config
server {
    listen [::]:80 default_server;
    set $root_directory "/usr/share/gitweb";

    location /gitweb.cgi {
        include       fastcgi.conf; # 403 forbidden
        gzip off;

        root $root_directory;
        fastcgi_param SCRIPT_FILENAME /usr/share/gitweb/gitweb.cgi;
        fastcgi_param GITWEB_CONFIG /etc/gitweb.conf;
        fastcgi_pass unix:/var/run/fcgiwrap.socket; # sock --> socket
    }

    location / {
        root $root_directory;
        index gitweb.cgi;
    }
}
```

### 配置gitweb.conf

编辑文件: `/etc/gitweb.conf`
```
# The directories where your projects are. Must not end with a slash.
our $projectroot = "/mnt/D/python/python_package";
our @git_base_url_list = qw(git://localhost http://git@localhost);
our $default_text_plain_charset = 'utf8';
our $project_maxdepth = 2;
our $default_blob_plain_mimetype = 'text/plain';
our $site_name = "Git Web";

$feature{'timed'}{'default'} = [1];
$feature{'show-sizes'}{'default'} = [1];
$feature{'patches'}{'default'} = [1];

$feature{'blame'}{'default'} = [1];
# $feature{'highlight'}{'default'} = [1];
$feature{'snapshot'}{'default'} = ['zip', 'tgz'];
$feature{'snapshot'}{'override'} = 1;
```
> __注意__: 
>  1. 高亮已经被注释掉了,因为如果没有安装高亮库就会显示无法读取blob文件.
>  2. 字符集需要设定为utf8,否则raw模式显示时可能出现乱码.


### 访问

浏览器输入`http://localhost/gitweb.cgi`, 不是`http://localhost/gitweb`,否则找不的css和js文件的.

### 其他

1. 高亮库需要到这里下载. [highlight](https://github.com/andre-simon/highlight).
2. 也可以美化一下`gitweb` [gitweb-theme](https://github.com/kogakure/gitweb-theme). 

### 参考链接 
[gitweb.conf](https://git-scm.com/docs/gitweb.conf.html)

[gitweb-archlinux](https://wiki.archlinux.org/index.php/Gitweb)
