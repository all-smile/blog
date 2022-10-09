---
title: Docker | 超全的环境配置教程，以及问题解决
abbrlink: 1689142117
date: 2022-10-07 21:44:43
tags: Docker
categories: Docker
description: 本文记录 Docker 系列之环境配置，讲解在centos 7 环境安装docker环境，并简单运行一个hello world，以及安装中的问题解决。
---

## 环境准备

[文档](https://docs.docker.com/get-started/overview/)非常用心🌹

我的服务器是 `centos 7` 环境

如果CentOS系统内核低于3.10，可以升级软件包及内核，通过 `yum update` 升级

> Linux系统分为两种：
> 1. RedHat系列：Redhat、Centos、Fedora等
>
> 2. Debian系列：Debian、Ubuntu等
>
> RedHat系列的包管理工具是`yum`
>
> Debian系列的包管理工具是`apt-get`

1. 查看系统版本:

```bash
cat /proc/version
Linux version 3.10.0-1062.1.2.el7.x86_64 (mockbuild@kbuilder.bsys.centos.org) (gcc version 4.8.5 20150623 (Red Hat 4.8.5-39) (GCC) ) #1 SMP Mon Sep 30 14:19:46 UTC 2019
```

> 我的系统是`Red hat`， 所以使用的包管理工具是`yum`

2. 查看系统内核
```bash
uname -r // 查看系统内核
3.10.0-1062.1.2.el7.x86_64
```

3. 查看系统配置
```bash
cat /etc/os-release // 查看系统配置
NAME="CentOS Linux"
VERSION="7 (Core)"
ID="centos"
ID_LIKE="rhel fedora"
VERSION_ID="7"
PRETTY_NAME="CentOS Linux 7 (Core)"
ANSI_COLOR="0;31"
CPE_NAME="cpe:/o:centos:centos:7"
HOME_URL="https://www.centos.org/"
BUG_REPORT_URL="https://bugs.centos.org/"

CENTOS_MANTISBT_PROJECT="CentOS-7"
CENTOS_MANTISBT_PROJECT_VERSION="7"
REDHAT_SUPPORT_PRODUCT="centos"
REDHAT_SUPPORT_PRODUCT_VERSION="7"
```

![](https://pic1.imgdb.cn/item/63402e1016f2c2beb1228dbc.jpg)

文档传送门：[https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)

## 安装并运行一个`hello-world`

### 步骤

####  1、卸载旧版本

```bash
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

#### 2、需要的安装包

```bash
yum install -y yum-utils
```

#### 3、设置镜像仓库

```bash
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo // 默认是国外的

		http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo //  阿里云镜像地址
```

#### 4、更新`yum`软件包索引

```bash
yum makecache fast
```

#### 5、安装docker相关的内容

- `docker-ce` 社区版

- `ee` 企业版

```bash
yum install docker-ce docker-ce-cli containerd.io
```

#### 6、配置阿里云镜像加速

登录阿里云，找到容器镜像服务，找到自己的镜像加速器

![](https://pic1.imgdb.cn/item/63402e3116f2c2beb122c809.jpg)

配置步骤如下👇

```bash
# 1
sudo mkdir -p /etc/docker

# 2 编写配置文件
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://xxxx.mirror.aliyuncs.com"]
}
EOF

# 3 重新加载配置
sudo systemctl daemon-reload

# 4 启动
sudo systemctl restart docker
```

#### 7、重新加载配置文件

```bash
systemctl daemon-reload
```

#### 8、启动

```bash
systemctl start docker
```

#### 9、查看是否启动成功
```bash
docker version
```

![](https://pic1.imgdb.cn/item/63402e3d16f2c2beb122df6e.jpg)

#### 10、`hello-world`

1. 直接运行`run`命令

```bash
docker run hello-world
```

![](https://pic1.imgdb.cn/item/63402e5516f2c2beb1230628.jpg)

2. `run`命令工作流程图解

![](https://pic1.imgdb.cn/item/63402e6e16f2c2beb1233443.jpg)

#### 11、查看下载的hello-world镜像

```bash
docker images
```

![](https://pic1.imgdb.cn/item/63402e7e16f2c2beb1234da4.jpg)

## 卸载docker

```bash
# 1. 卸载依赖
yum remove docker-ce docker-ce-cli containerd.io

# 2. 删除目录
rm -rf /var/lib/docker
rm -rf /var/lib/containerd
```

## 问题汇总

### docker 启动报错

> Job for docker.service failed because the control process exited with error code. See "systemctl status docker.service" and "journalctl -xe" for details.

修改`/usr/lib/systemd/system/docker.service`

![](https://pic1.imgdb.cn/item/63402e9816f2c2beb123788f.jpg)

- 错误原因：

`docker`的`socket`配置出现了冲突，`docker`在运行时的启动入口文件为：`/lib/systemd/system/docker.service`，我们在配置镜像加速之后又添加了一个守护进程文件：`/etc/docker/daemon.json`，两个文件对`host`进行了配置，发生冲突。

- 查看报错详情 `journalctl -xe`

![](https://pic1.imgdb.cn/item/63402eb616f2c2beb123b024.jpg)

> failed to start daemon: error initializing graphdriver: /var/lib/docker contains several valid graphdrivers: devicemapper, o

- 解决办法：

修改 `/etc/docker/daemon.json`

增加：
```
"storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
 ]
```

![](https://pic1.imgdb.cn/item/63402ec916f2c2beb123d2df.jpg)


## 常用命令

1. 查看版本 `docker -v`

2. 设置服务器开机启动

```bash
systemctl enable docker
```

3. 停止`docker`

```bash
systemctl stop docker
```

4. systemctl 方式

```bash
# 守护进程重启
sudo systemctl daemon-reload

# 重启docker服务
sudo systemctl restart docker

# 关闭docker
sudo systemctl stop docker
```

---

![](https://cdn.jsdelivr.net/gh/all-smile/nav@1.0.7/static/images/wind_girl.webp)

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**