---
title: Docker | 制作tomcat镜像并部署项目
tags:
  - Docker
  - tomcat
categories: Docker
description: 本文讲解如何制作自己的tomcat镜像，并使用tomcat部署项目
abbrlink: 2106196415
date: 2022-10-14 12:29:08
---

> 本篇收录至[Docker专栏](https://blog.i-xiao.space/categories/Docker/)，持续更新，欢迎访问😊

本文讲解如何制作自己的tomcat镜像，并使用tomcat部署项目

## 原料准备：

tomcat、jdk安装包，dockerfile文件

## 步骤

### 1、准备压缩包

jdk-8u301-linux-x64.tar.gz -> jdk1.8.0_301

apache-tomcat-7.0.107.tar.gz -> apache-tomcat-7.0.107

![](https://pic1.imgdb.cn/item/6348e93f16f2c2beb17ac00e.jpg)

### 2、编写dockerfile文件

> 官方指定命名`Dockerfile`，这样构建的时候不用加`-f`参数指定文件

```bash
FROM centos
MAINTAINER xiao<find_onepiece@163.com>

COPY readme.txt /usr/local/readme.txt

ADD jdk-8u301-linux-x64.tar.gz /usr/local
ADD apache-tomcat-7.0.107.tar.gz /usr/local

RUN yum -y install vim

ENV MYPATH /usr/local

WORKDIR $MYPATH
ENV JAVA_HOME /usr/local/jdk1.8.0_301
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
ENV CATALINA_HOME /usr/local/apache-tomcat-7.0.107
ENV CATALINE_BASH /usr/local/apache-tomcat-7.0.107
ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib:$CATALINE_HOME/bin

EXPOSE 8080

CMD /usr/local/apache-tomcat-7.0.107/bin/startup.sh && tail -f /usr/local/apache-tomcat-7.0.107/bin/logs/catalina.out

```
### 3、执行构建

```bash
docker build -t diytomcat . # 自动寻找Dockerfile文件
```

**构建成功:**

Successfully built e68ad8caa2a4

Successfully tagged diytomcat:latest

![](https://pic1.imgdb.cn/item/6348e96716f2c2beb17b0059.jpg)

### 4、启动容器

`/webapps/test`  部署的项目路径，浏览器访问`ip:port/test`

```bash
docker run -it -p 9090:8080 --name xiaoTomcat -v /home/xiao/build/tomcat/test:/usr/local/apache-tomcat-7.0.107/webapps/test -v /home/xiao/build/tomcat/tomcatlogs/:/usr/local/apache-tomcat-7.0.107/logs diytomcat
```

### 5、访问查看

数据卷挂载成功

![](https://pic1.imgdb.cn/item/6348e97c16f2c2beb17b2050.jpg)

### 6、发布项目

已经挂载了数据卷，所以编写宿主机的项目文件就可以了

在挂载路径 `/home/xiao/build/tomcat/test` 下

1. 新建文件 `web.xml`，内容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="2.4"
    xmlns="http://java.sun.com/xml/ns/j2ee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee
        http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">
</web-app>
```

2. 新建文件 `index.jsp`，内容如下：

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<body>
<h2>Hello World!</h2>
<h2>xiao</h2>
<%
System.out.println("my tomcat project logs");
%>
</body>
</html>
```

### 7、浏览器访问

url：`ip:port/test`

![](https://pic1.imgdb.cn/item/6348e9ae16f2c2beb17b6a64.jpg)

### 8、查看日志卷

`tail -f catalina.out`

![](https://pic1.imgdb.cn/item/6348e9bd16f2c2beb17b8250.jpg)

## 完成从构建镜像到部署项目🎈🎈

---

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**