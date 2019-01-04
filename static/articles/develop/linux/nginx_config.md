{
  "title": "NGINX基本配置需求",
  "profile": "这里仅列了常见的NGINX反向代理配置",
  "tags": ["nginx"],
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2017-03-10T00:00:00"
}
# Nginx 配置文件

## CONFIG

### django配置
```perl
server {
  set $root_dir "g:/python/blogger/static_dir/";
  set $p_url http://127.0.0.1:8000;

  # set $root_dir "g:/python/blogger/static_dir/"

  listen [::]:80 default_server;

  location / {
    proxy_pass $p_url;
    root $root_dir;
    index index.html index.htm index.php;
  }

  location ~c^/images/(.*?)\.(gif|jpg|png)$ {
    root $root_dir;
  }

  location ~ ^/(css|js)(.*?)\.(css|js)$ {
    root $root_dir;
  }
}
```

### PHP配置
```perl
server {
  listen [::]:80 default_server;
  set $root_dir "g:/php/www/BBS/";
  location ~ \.php$ {
    root           $root_dir;
    fastcgi_pass   127.0.0.1:8000;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;  
    fastcgi_split_path_info     ^(.+\.php)(.*)$;
    fastcgi_param PATH_INFO     $fastcgi_path_info;
    include        fastcgi_params;
  }

  location / {
    root $root_dir;
  }

  location  ~ ^/images/(.*?)\.(gif|jpg|png)$ {
    root $root_dir;
  }

  location ~ ^/(css|js)(.*?)\.(css|js)$ {
    root $root_dir/tpl;
  }

  location ~ ^/(fonts)/(.*?)\.(ttf)$ {
    root $root_dir/tpl;
  }
}
```

### node配置
```perl
server {
  listen [::]:80 default_server;
  location /ghpage {
    # proxy_pass http://127.0.0.1:3000;
    root F:\html5\git\ghpage;
    index index.html index.htm;
    expires 1d;
  }
}
```

### 方便客户端查看目录
```perl
server {
  listen [::]:80 default_server;
  root "F:\html5\git\git_on_the_server\greyhound";
  autoindex on;
  autoindex_exact_size off;
  autoindex_localtime on;
}
```
