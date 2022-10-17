---
title: Docker | 发布镜像到镜像仓库
tags: Docker
categories: Docker
description: 本文记录发布镜像到 DockerHub 和 阿里云镜像仓库。工作中使用的是JFrog Artifactory 和 Harbor，没有太大差别。
abbrlink: 2796165889
date: 2022-10-16 20:46:39
---

> 本篇收录至[Docker专栏](https://blog.i-xiao.space/categories/Docker/)，持续更新，欢迎访问😊

本文记录发布镜像到 `DockerHub` 和 `阿里云镜像仓库`。工作中使用的是`JFrog Artifactory` 和 `Harbor`，没有太大差别。

# 发布镜像到DockerHub
[https://hub.docker.com/](https://hub.docker.com/) 注册账号

## 1、登录docker

```bash
[root@--- ~]# docker login --help

Usage:  docker login [OPTIONS] [SERVER]

Log in to a Docker registry.
If no server is specified, the default is defined by the daemon.

Options:
  -p, --password string   Password
      --password-stdin    Take the password from stdin
  -u, --username string   Username
[root@--- ~]#
[root@--- ~]# docker login -u xiaobluewhale
Password:
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
[root@--- ~]#
```

## 2、服务器上提交镜像

`docker push [OPTIONS] NAME[:TAG]`

`docker push` 命令推送镜像的规范是：注册用户名/镜像名。

使用以下方法之一命名您的本地镜像：

1. 当你构建它们时，使用如下命令

```bash
docker build -t <hub-user>/<repo-name>[:<tag>]
```

2. 重命名现有的本地镜像

```bash
docker tag <existing-image> <hub-user>/<repo-name>[:<tag>]
```

3. `docker commit` 提交更改

```bash
docker commit <existing-container> <hub-user>/<repo-name>[:<tag>]
```

4. 推送镜像仓库

```bash
docker push <hub-user>/<repo-name>:<tag>
```

- `docker push xiao/tomcat`

```bash
docker push xiao/tomcat
Using default tag: latest
The push refers to repository [docker.io/xiao/tomcat]
69421fc728fb: Preparing
1f6217f0c2bb: Preparing
aa9c3f9fafec: Preparing
7d4a4cd414a9: Preparing
74ddd0ec08fa: Preparing
denied: requested access to the resource is denied
```

### 推送失败，被拒绝

推送失败的原因: **name必须是注册用户名**

### 解决push失败问题

增加一个tag, 重命名镜像

```bash
# 增加tag，重命名镜像
docker tag 24b3a476f143 xiaobluewhale/tomcat:1.0
The push refers to repository [docker.io/xiaobluewhale/tomcat]

# 查看镜像
docker images
REPOSITORY            TAG       IMAGE ID       CREATED        SIZE
xiaobluewhale/tomcat   1.0       24b3a476f143   13 hours ago   680MB
xiao/tomcat            1.0       24b3a476f143   13 hours ago   680MB
xiao/tomcat            latest    24b3a476f143   13 hours ago   680MB

# 推送镜像
docker push xiaobluewhale/tomcat:1.0
```

### 提交成功

![](https://pic1.imgdb.cn/item/634c984c16f2c2beb145f7bc.jpg)

提交的时候也是按照镜像的层级提交的

在个人DockerHub上查看推送成功的镜像

![](https://pic1.imgdb.cn/item/634c985b16f2c2beb14602fd.jpg)

# 发布镜像到阿里云镜像仓库

## 1、登陆阿里云

## 2、找到容器镜像服务，创建实例

![](https://pic1.imgdb.cn/item/634c986916f2c2beb1460b7d.jpg)

![](https://pic1.imgdb.cn/item/634c987a16f2c2beb14617bb.jpg)

企业版需要付费购买（1个月741）

![](https://pic1.imgdb.cn/item/634c988c16f2c2beb14623ef.jpg)

我选择创建**个人实例**

![](https://pic1.imgdb.cn/item/634c989c16f2c2beb14632b8.jpg)

## 3、创建命名空间（为了隔离）

![](https://pic1.imgdb.cn/item/634c98ab16f2c2beb1463e3f.jpg)

## 4、创建镜像仓库

本地

![](https://pic1.imgdb.cn/item/634c98ba16f2c2beb1464b58.jpg)

## 5、推送镜像

参考阿里云容器镜像指南

1. 登录

```bash
docker login --username=[yourname] registry.cn-hangzhou.aliyuncs.com
```

2. 查看镜像

```bash
docker images
REPOSITORY                      TAG       IMAGE ID       CREATED        SIZE
xiaobluewhale/tomcat            1.0       24b3a476f143   14 hours ago   680MB
```

3. 推送镜像

```bash
docker push xiaobluewhale/tomcat:1.0
The push refers to repository [docker.io/xiaobluewhale/tomcat]
```

![](https://pic1.imgdb.cn/item/634c98cb16f2c2beb1465751.jpg)

## 6、阿里云查看镜像

imageID: `24b3a476f143`

![](https://pic1.imgdb.cn/item/634c98da16f2c2beb14662d9.jpg)

也可以查看可视化的层信息

![](https://pic1.imgdb.cn/item/634c98e716f2c2beb1466ce7.jpg)

---

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**
