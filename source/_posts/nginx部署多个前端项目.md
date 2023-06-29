---
title: nginx部署多个前端项目
date: 2023-06-29 10:57:50
tags:
  - nginx
  - 前端
categories: nginx
description: 通过访问不同的子路径部署多个前端项目，并结合`vue-router`的不同路由模式，给出不同的配置。
---
> 前端采用vue框架，主要介绍在同一个`ip+port`下（或域名），通过访问不同的**子路径**部署多个项目

把前端打包好的项目直接放进 `nginx/html` 目录下面，

![](https://files.mdnice.com/user/34064/b05479c5-8e4f-432f-bf6a-c9cb8e2cd650.png)

# 路由采用hash模式

浏览器访问的时候在url后面拼接上要访问的项目子路径即可，会由`vue-router`接管路由（hash模式），后面的路径跳转、资源访问的操作也都会在子路径下处理，nginx配置很简单。

`nginx/nginx.conf` 文件的部分配置如下：

```
server {
        listen        80;
        server_name   www.axample.com;
        #rewrite      ^ https://$server_name$request_uri permanent;
        #charset koi8-r;

        #access_log  logs/host.access.log  main;
        # 在443端口配置里设置
        location / {
             root html;
             index index.html index.htm;
             try_files $uri $uri/ /index.html; # uri统一资源标志符
        }
}
```

**浏览器访问：**

- `https://www.axample.com/lily/` -> `https://www.axample.com/lily/#/home`
- `https://www.axample.com/mimosa/` -> `https://www.axample.com/mimosa/#/home`

# 路由采用的都是history模式

不同于 hash模式，History 模式需要服务器的支持，还是通过访问不同的子路径部署多个项目，当浏览器访问项目的时候，会把子路径带上去请求资源，存在找不到资源的情况，所以需要在应用路径和nginx配置上做修改。

## 1、router.js设置

```
new Router({
  mode: 'history',
  base: '/mimosa/',
  routes,
});
```

`base` 是应用的基路径，默认值: "/"。

例如，如果整个单页应用服务在 `/app/` 下，然后 `base` 就应该设为 `/app/`。

## 2、vue.config.js修改publicPath

> 如果只修改了router的设置，没有修改`publicPath`，浏览器地址栏键入 `https://www.axample.com/lily/` 首次进入由于`vue-router`设置的 `redirect` 会重定向到首页地址，正常显示网页，但是再次刷新的时候，浏览器请求的是重定向过后的地址，静态文件地址指向错乱，`404`一般来说就是配置和真实的路径不符合，需要指定`try_files`


```
publicPath: IS_PROD ? '/lily/' : '/',  // 公共路径
```

**publicPath用法：**

`publicPath`: 部署应用包时的基本 URL，用法和 `webpack` 本身的 `output.publicPath` 一致，

但是 `Vue CLI` 在一些其他地方也需要用到这个值，所以为了保持统一，直接修改 `publicPath` 而不要直接修改 `webpack` 的 `output.publicPath`。

1. 默认情况下，`Vue CLI` 会假设你的应用是被部署在一个**域名的根路径**上，

例如 `https://www.my-app.com/`。

2. 如果应用被部署在一个**子路径**上，你就需要用这个选项指定这个子路径。

例如，如果你的应用被部署在 `https://www.my-app.com/my-app/`，则设置 `publicPath` 为 `/my-app/`。

## 3、nginx设置

增加子应用的配置

```nginx
# 443端口配置

location / {
  root html;
  index index.html index.htm;
  try_files $uri $uri/ /index.html;
}
location /lily {
  #alias /usr/local/nginx/html/lily/;#把匹配到的路径重写, 注意要以/结尾
  root /usr/local/nginx/html; #在匹配到的路径前面，增加root基础路径配置
  try_files $uri $uri/ /lily/index.html; # 特定目录，匹配不到文件的话，增加/lily/index.html配置
  index index.html index.htm;
}
location /mimosa {
  #alias /usr/local/nginx/html/mimosa/;
  root /usr/local/nginx/html;
  try_files $uri $uri/ /mimosa/index.html;
  index index.html index.htm;
}
```

**浏览器访问:**
- `https://www.axample.com/lily/`
- `https://www.axample.com/mimosa/`

# 小结

上面讲解了通过访问不同的子路径部署多个前端项目，并结合`vue-router`的不同路由模式，给出不同的配置。

nginx方面的配置是写在同一个 `server` 块下的，通过 `location` 去分发。

也可以通过**域名+端口**的配置，实现部署多个前端项目，这个时候就需要添加不同的`server` 块配置了，感兴趣的小伙伴可以自己尝试一下🎁

---

我是 **甜点cc**，个人网站: [https://blog.i-xiao.space/](https://blog.i-xiao.space/)

做人做事在于扬长而不是补短

公众号：【看见另一种可能】
