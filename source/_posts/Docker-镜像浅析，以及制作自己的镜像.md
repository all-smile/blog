---
title: Docker | 镜像浅析，以及制作自己的镜像
tags: Docker
categories: Docker
description: 本文主要讲述我对Docker镜像的理解，以及如何制作一个简单的Docker镜像。欢迎访问
abbrlink: 1309038568
date: 2022-10-08 10:53:05
---

![](https://pic1.imgdb.cn/item/6340e6a716f2c2beb102f10f.jpg)

> **分层下载，`docker image` 的核心: 联合文件系统**

## 镜像是什么

镜像就是一个轻量的、独立的软件包。用来打包运行环境和基于运行环境开发的软件。它包含软件运行所需的所有内容（包括代码、运行时、库、环境变量、配置文件）

所有的应用，打包docker镜像，就可以跑起来。

## 如何得到镜像

- 从远程仓库下载

- 拷贝他人的镜像（镜像打包生成tar压缩包，可以发送压缩包给别人。）

- 自己制作一个镜像（`DockerFile`）

## Docker镜像加载原理

> UnionFS（联合文件系统）

1. `UnionFS`（联合文件系统）是一种分层、轻量、高性能的文件系统。它支持对文件系统的修改作为一次提交，来一层一层的叠加，同时可以将不同目录挂载到同一个虚拟文件系统下。

2. 联合文件系统是`Docker`镜像的基础，镜像可以通过分层来进行继承，基于基础镜像（没有父镜像）可以制作各种具体的应用镜像。

**特性**：

一次同时加载多个文件系统，但从外面看起来，只能看到一个文件系统，联合加载会把各层文件系统叠加起来，这样最终的文件系统会包含所有底层的文件和目录。

**Docker镜像加载原理:**

`Docker`的镜像实际上由一层一层的文件系统组成，

- bootfs（boot file syatem）
- rootfs（root file system），

就是各种操作系统的发行版，比如`Ubuntu`，`Centos`

![](https://pic1.imgdb.cn/item/6340e6ba16f2c2beb1030bea.jpg)

## 分层理解

- 查看镜像详细信息

```bash
docker inspect 镜像id
```

![](https://pic1.imgdb.cn/item/6340e6ca16f2c2beb1032747.jpg)

- Layers

![](https://pic1.imgdb.cn/item/6340e6da16f2c2beb1033f2d.jpg)

**特点:**

docker镜像都是只读的，当容器启动时，一个新的可写层被加到镜像的顶部。

这一层就是我们通常说的**容器层**，容器之下的都叫**镜像层**。

![](https://pic1.imgdb.cn/item/6340e6e716f2c2beb1035598.jpg)

## commit镜像（提交一个自己的镜像）

```bash
docker commit #提交容器成为一个新的副本

#命令和git原理类似
```

```bash
docker commit -m='提交的描述信息' -a='作者' 容器id 目标镜像名：[ tag ]
```

> 下载的tomcat镜像是阉割版，启动之后404，因为webapps下面没有ROOT文件夹，所以这里尝试做一个自己的可正常访问tomcat主页的镜像。
> （由于镜像只读，启动镜像之后会在镜像层之上生成一个容器层，在tomcat容器层做修改，再把镜像层和修改过后的容器层整体打包成一个新的个人镜像）

<!-- 参考之前的docker部署tomcat文档[https://www.yuque.com/allblue-byynd/dtez1l/kgwtge](https://www.yuque.com/allblue-byynd/dtez1l/kgwtge) -->

### 1、下载tomcat镜像

```bash
docker pull tomcat
```

### 2、启动tomcat镜像

```bash
docker run -it -p 3355:8080 tomcat /bin/bash
```

### 3、浏览器访问404

### 4、进入容器，复制webapps.dist目录下的文件到webapps目录下

### 5、提交镜像

```bash
docker commit -m="edit webapps dir" -a="xiao" 容器id tomcat02:1.0
```

![](https://pic1.imgdb.cn/item/6340e70416f2c2beb1037f2e.jpg)

### 6、查看提交的镜像信息

```bash
docker inspect [imageId]
```

![](https://pic1.imgdb.cn/item/6340e74916f2c2beb103eac2.jpg)

### 总结

![](https://pic1.imgdb.cn/item/6340e75616f2c2beb10400ab.jpg)

---

![](https://cdn.jsdelivr.net/gh/all-smile/nav@1.0.7/static/images/wind_girl.webp)

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**
