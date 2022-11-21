---
title: nginx配置文件
date: 2022-11-21 18:47:59
tags: nginx
categories: nginx
description: 云服务器到期了，备份一下`nginx`的配置文件😊
---

云服务器到期了，备份一下`nginx`的配置文件😊

```nginx

#user  nobody;
# 启动进程，通常设置成和cpu数量相等
worker_processes  6;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

# 起到 ulimit -a 的作用
worker_rlimit_nofile 65535;

events {
	# epoll 是多路复用IO(I/O Multiplexing)中的一种方式
	# use epoll;
	# 单个worker processes 进程最大并发连接数，worker_connections小于work_rlimit_nofile
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

  # 关闭在错误页面中nginx的版本信息
  server_tokens   off;

  # 反向代理设置为on, fastdfs设置为off
  sendfile        on;
  # 在一个数据包里发送所有头文件
  tcp_nopush     on;

   keepalive_timeout  65;
	 tcp_nodelay        on;

    gzip  on;
	gzip_static on;


	gzip_min_length 1k;
	gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
	gzip_disable "MSIE [1-6].";
	# 打开缓存的同时也指定了缓存最大数目，以及缓存的时间。我们可以设置一个相对高的最大时间，这样我们可以在它们不活动超过20秒后清除掉。
	open_file_cache max=65535 inactive=60s;
	# 在open_file_cache中指定检测正确信息的间隔时间。
	open_file_cache_valid 80s;
	# 定义了open_file_cache中指令参数不活动时间期间里最小的文件数。
	open_file_cache_min_uses 1;
	# 指定了当搜索一个文件时是否缓存错误信息，也包括再次给配置中添加文件。我们也包括了服务器模缺，这些是在不同文件中定义的，如果你的服务模块不再这些位置，你就得修正这一行来指定正确的位置
	open_file_cache_errors on;

	# 设置请求头缓冲
	# 客户端请求头部的缓冲区大小，这个可以根据你的系统分页大小来设置，一般一个请求头的大小不会超过1x，不过由于一般系统分页都要大于1k，所以这里设置分页大小。分页大小用命令 getconf PAGESIZE 获得
	client_header_buffer_size 4096;
	client_body_buffer_size 512k;
	# 缓冲区代理缓冲用户端请求的最大字节数,如果请求大于指定的大小，则NGINX发回HTTP 413（Raquest Entity too large）错误.
	client_max_body_size 128m;
	large_client_header_buffers 4 128k;
	client_header_timeout 15;
	client_body_timeout 15;
	# 指定客户端的响应超时时间
	send_timeout 30;

    server {
        listen       18600;
        server_name  0.0.0.0;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   D:\mine-project\pc-web\dist;
            index  index.html index.htm;
			try_files  $uri $uri/ /index.html;
			# add_header Cache-Control no-cache;
			# add_header Content-Encoding gzip;
        }

		location /pcApi/ {
			rewrite ^/pcApi/(.*)$ /$1 break;
			proxy_pass http://172.15.37.225:3000;
		}

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }

	# server {
	#	listen 80;
	#	server_name 123.123.123.123;
	#	server_name my.example.com t.example.com;
	#	rewrite ^/(.*) https://${host}:1900/$1 redirect;
	#}


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

    #server {
      #    listen        80;
      #    server_name   www.i-xiao.space;
      #    #server_name   118.190.59.105;
      #    rewrite       ^ https://$server_name$request_uri permanent; # http -> https 80端口转发443端口
      #    # rewrite       ^ https://$server_name:8090 permanent;
      #    #charset koi8-r;
      #    add_header Cache-Control no-cache;
    #}

    server {
       #监听443端口
       listen               443;
       #你的域名
       #server_name          i-xiao.space;
       ssl                  on;
       root                 /usr/local/nginx/html;
       #index index.html index.htm;
       ssl_certificate      /usr/local/nginx/cert/i-xiao.space.pem;
       ssl_certificate_key  /usr/local/nginx/cert/i-xiao.space.key;
       ssl_session_timeout  5m;
       ssl_ciphers          ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
       ssl_protocols        TLSv1 TLSv1.1 TLSv1.2;
       ssl_prefer_server_ciphers on;
       location / {
           index index.html index.htm;
	       try_files $uri $uri/ /index.html;

           # To allow POST on static pages 允许静态页使用POST方法
           error_page  405 =200 $uri;
       }

       # 禁用缓存
       location = /index.html {
            add_header Cache-Control "no-cache, no-store";
       }
       location /lily {
             #alias /usr/local/nginx/html/lily/;#把匹配到的路径重写, 注意要以/结尾
             root /usr/local/nginx/html; #在匹配到的路径前面，增加root基础路径配置
             try_files $uri $uri/ /lily/index.html; # 指定特定路径
             index index.html index.htm;
        }
        location /mimosa {
             #alias /usr/local/nginx/html/mimosa/;
             root /usr/local/nginx/html;
             try_files $uri $uri/ /mimosa/index.html;
             index index.html index.htm;
        }
        location /pcApi/ {
             proxy_pass http://118.190.59.105:3000/;
        }
        location /supervisor/ {
             proxy_pass http://118.190.59.105:9001/;
        }
        location /pc/ {
            proxy_pass http://118.190.59.105:8090/;
            # try_files $uri $uri/ /index.html;
            # index index.html index.htm;
        }
        location /h5/ {
            proxy_pass http://118.190.59.105:8001/;
            add_header Cache-Control no-cache;
        }
        location /student/ {
            # 暂时不正确访问
            proxy_pass http://118.190.59.105:3000/;
        }
        # 静态文件-人脸识别模型文件
        location /model-face/ {
            root /var/pc-h5/static;
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header Cache-Control no-cache;
            # add_header Content-Encoding gzip;
            # add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
        }
        location /static/ {
            root /var/pc-h5;
            add_header 'Access-Control-Allow-Origin' '*';
            add_header Cache-Control no-cache;
        }
       error_page  404              /404.html;
       error_page  500 502 503 504  /50x.html;
       location = /50x.html {
             root   html;
       }
    }

}
```
