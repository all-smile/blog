---
title: Docker | dockerfile构建centos镜像，以及CMD和ENTRYPOINT的区别
tags: Docker
categories: Docker
description: 本文记录使用dockerfile构建centos镜像，以及CMD和ENTRYPOINT命令的区别。
abbrlink: 1048738116
date: 2022-10-15 18:29:38
---

# 构建自己的centos镜像

`docker pull centos`下载下来的镜像都是基础版本，缺少很多常用的命令功能，比如：`ll`、`vim`等等，

下面介绍制作一个功能较全的自己的centos镜像。

## 步骤

### 1、编写dockerfile文件

```bash
FROM centos
MAINTAINER xiao<example@163.com>
ENV MYPATH /usr/local
WORKDIR $MYPATH

RUN yum -y install vim       # vim命令
RUN yum -y install net-tools # ifconfig命令

EXPOSE 80
CMD echo $MYPATH
CMD echo "---end--"
CMD /bin/bash
```

### 2、构建镜像

- -f  file 指定dockerfile文件的路径

- -t  tag  指定name:tag

```bash
docker build -f ./mydockerfile -t mycentos:0.1 .

Successfully built e7527f97f78a
Successfully tagged mycentos:0.1
```

### 3、测试运行

```bash
docker images
docker run -it mycentos:0.1
```

可以看到进入容器之后，直接就是在 `/usr/local` 目录下，是因为`dockerfile`配置的`WORKDIR`

![](https://pic1.imgdb.cn/item/634a92ce16f2c2beb1726bca.jpg)

这时，`ifconfig`、`vim`命令都可以使用了

### 4、查看镜像构建历史记录

```bash
docker history imageID
```

![](https://pic1.imgdb.cn/item/634a92e316f2c2beb1729aca.jpg)

# CMD和ENTRYPOINT的区别

## 编写CMD测试dockerfile文件

1. 编写dockerfile文件

```bash
FROM centos
CMD ["ls", "-a"]
```

2. 构建镜像

```bash
docker build -f ./dockerfile -t cmd-test .
```

3. 启动镜像

```bash
docker run imageID/iamgeName
```

![](https://pic1.imgdb.cn/item/634a92fb16f2c2beb172c300.jpg)

测试发现，启动镜像时追加的命令替换了`CMD`命令，如下图所示:

![](https://pic1.imgdb.cn/item/634a930916f2c2beb172d924.jpg)

## 编写ENTRYPOINT测试dockerfile文件

每个`Dockerfile`只能有一个`ENTRYPOINT`，如果指定了多个，只有最后一个被执行,而且一定会被执行

```bash
FROM centos
ENTRYPOINT ["ls", "-a"]
```

```bash
# nginx 镜像
ENTRYPOINT [ "/usr/sbin/nginx", "-g", "daemon off;" ]
```

![](https://pic1.imgdb.cn/item/634a931916f2c2beb1731507.jpg)

## 总结

1. `CMD`命令会被启动容器时追加的命令替换执行，

2.`ENTRYPOINT`命令不会被启动容器时追加的命令替换，而是合并执行

![](https://pic1.imgdb.cn/item/634a932b16f2c2beb1736e15.jpg)

---

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**