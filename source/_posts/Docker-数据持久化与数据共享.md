---
title: Docker | 数据持久化与数据共享
abbrlink: 3117997523
date: 2022-10-12 08:31:01
tags: Docker
categories: Docker
description: Docker的数据持久化与数据共享怎么实现？
---

# 数据持久化（安装MySQL）

参考另一篇Docker安装mysql: [https://www.yuque.com/allblue-byynd/cs239m/pct46i](https://www.yuque.com/allblue-byynd/cs239m/pct46i)

## MySQL的数据持久化问题

```bash
# 下载容器
docker pull mysql:5.7

-d 后台运行
-p 端口映射
-v 挂载数据卷
-e 环境配置
--name 容器名字
# 运行容器
docker run -d -p 3310:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql:5.7
```

[https://hub.docker.com/_/mysql](https://hub.docker.com/_/mysql)

> 官网启动MySQL，设置密码
>
> `docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag`

![](https://pic1.imgdb.cn/item/63461ba516f2c2beb1c1cc9a.jpg)

## 启动成功之后，使用客户端连接

这里我使用的是SQLyog工具连接MySQL数据库

sqlyog连接服务器的3310端口，3310端口映射MySQL容器的3306端口。

![](https://pic1.imgdb.cn/item/63461bc716f2c2beb1c1faa9.jpg)

可以在Linux主机`/home`目录下查看到`mysql`文件夹

## 删除MySQL容器，可以看到Linux主机上/home/mysql/数据依然存在

- docker rm -f 容器ID
- docker ps -a
- cd /home/mysql
- ls

![](https://pic1.imgdb.cn/item/63461bd616f2c2beb1c20f71.jpg)

运行新的MySQL容器通过挂载数据卷，就可以把Linux主机上备份的数据重新导入到容器里，这就是数据持久化。

# 数据共享

容器之间同步数据。比方说，两个`MySQL`数据库同步数据

```bash
--volumes-from
实现容器间的数据共享
```

![](https://pic1.imgdb.cn/item/63461be916f2c2beb1c22d3d.jpg)

## 多个centos容器数据共享

1. 父容器docker01(数据卷容器)

```bash
# 父容器docker01(数据卷容器)
docker run -it --name docker01 xiao-centos /bin/bash
```

2. 创建docker02容器，继承关联docker01容器

```bash
docker run -it --name docker02 --volumes-from docker01 xiao-centos /bin/bash
```

3. 创建docker03容器，继承关联docker01容器

```bash
docker run -it --name docker03 --volumes-from docker01 xiao-centos /bin/bash
```

以上三个容器之间数据同步共享，测试停止并删除docker01容器之后，docker02,docker03的数据存在且依然可以同步数据

![](https://pic1.imgdb.cn/item/63461bf716f2c2beb1c242f9.jpg)

## 多个MySQL实现数据共享

```bash
# 创建mysql01容器
docker run -d -p 3310:3306 -v /etc/mysql/conf.d -v /var/lib/mysql -e MYSQL_ROOT_PQSSWORD=123456 --name mysql01 mysql:5.7

# 创建mysql02容器，同步mysql01容器
docker run -d -p 3310:3306 -e MYSQL_ROOT_PQSSWORD=123456 --name mysql02 --volumes-from mysql02 mysql:5.7

通过 --volumes-from 实现数据共享(继承)
```

> 结论：
>
> 1. 容器之间配置信息的传递，数据卷容器的生命周期一直持续到没有容器为止。
>
> 2. 同步到宿主机本机的数据，本地持久化

---

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**