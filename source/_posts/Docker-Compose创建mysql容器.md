---
title: Docker | Compose创建mysql容器
tags: Docker MySQL
categories: Docker
description: 本文通过Docker Compose来创建mysql容器，以及一些数据库的基础配置
abbrlink: 2048262040
date: 2022-10-11 14:10:57
---

> 本篇收录至[Docker专栏](https://blog.i-xiao.space/categories/Docker/)，持续更新，欢迎访问😊

本文通过`Docker Compose`来创建`mysql`容器

## 在linux服务器上创建文件，用于管理容器

- mkdir docker-mysql
- cd docker-mysql
- vim docker-compose.yml  #写入如下内容

`docker-compose.yml`
```bash
version: "3"
services:
  mysqldb:
    image: mysql:5.7
    restart: always
    container_name: mysql57
    ports:
      - 3310:3306
    volumes:
      - /var/vol_dockers/mysqldb/conf:/etc/mysql/conf.d
      - /var/vol_dockers/mysqldb/data:/var/lib/mysql
    environment:
      MYSQL_PSAAWORD: PSAAWORD
      MYSQL_ROOT_PASSWORD: PSAAWORD
      MYSQL_USER: root
      MYSQL_DATABASE: database
```

> 记得防火墙要开放3306、3310端口

## 创建启停脚本文件

- vim start
```bash
docker-compose up -d
```

- vim restart

```bash
docker-compose restart
```

- vim stop

```bash
docker-compose stop
```

## 修改脚本文件权限

```bash
chmod 777 st* restart
```

![](https://pic1.imgdb.cn/item/63450d9c16f2c2beb1fc717d.jpg)

## 启动`mysql`容器

```bash
./start
```

- 查看容器

![](https://pic1.imgdb.cn/item/63450e0116f2c2beb1fd0442.jpg)

## mysql数据库基本配置

1. 创建MySql用户

```bash
CREATE USER dbadmin@localhost IDENTIFIED BY 'pwd';
```

`dbadmin@localhost`，表示只允许`localhost`环境的`dbadmin`用户登录

2. 设置可访问的主机

```bash
update user set host = '%' where user = 'dbadmin';
```

% 表示接受所有主机ip访问

3. 最后刷新生效

```bash
flush privileges;
```

**整体步骤：**

1、连接服务器: mysql -u root -p

2、看当前所有数据库：show databases;

3、进入mysql数据库：use mysql;

4、查看mysql数据库中所有的表：show tables;

5、查看user表中的数据：select Host, User,Password from user;

6、修改user表中的Host: update user set Host='%' where User='root';

7、最后刷新一下：flush privileges;


**客户端连接**

这里我使用的是`SQLyog`工具连接`MySQL`数据库

`sqlyog`连接服务器的`3310`端口，`3310`端口映射`MySQL`容器的`3306`端口。

![](https://pic1.imgdb.cn/item/63450db816f2c2beb1fc98ab.jpg)

![](https://pic1.imgdb.cn/item/63450def16f2c2beb1fce7fa.jpg)

---

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**
