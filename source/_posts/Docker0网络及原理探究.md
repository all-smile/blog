---
title: Docker0网络及原理探究
tags:
  - Docker
categories:
  - 后端运维
description: "Docker网络通信在容器编排、集群部署中具有举足轻重的地位，（玩docker不懂docker0那就......玩不透哇\U0001F440）本篇分析Docker网络，并通过启动几个容器来探究Docker网络及容器通信，帮助读者理解一下\U0001F60A。"
abbrlink: 2165908694
date: 2022-08-28 22:06:10
---

> 个人观点：Docker网络通信在容器编排、集群部署中具有举足轻重的地位，（玩docker不懂docker0那就......玩不透哇👀）本篇分析Docker网络，并通过启动几个容器来探究Docker网络及容器通信，帮助读者理解一下😊。

## 1、Docker0

Docker 服务默认会创建一个 docker0 网桥（其上有一个 docker0 内部接口），它在内核层连通了其他的物理或虚拟网卡，这就将所有容器和本地主机都放到同一个物理网络。

Docker 默认指定了 docker0 接口 的 IP 地址和子网掩码，让主机和容器之间可以通过网桥相互通信，它还给出了 MTU（接口允许接收的最大传输单元），通常是 1500 Bytes，或宿主主机网络路由上支持的默认值。这些值都可以在服务启动的时候进行配置。

## 2、清空所有镜像

如果是初学者，还不是很了解docker0的情况下，建议清空所有镜像，创造一个比较干净的容器网络环境，更加清晰，有助于学习docker0😃

```bash
# 1. 查看运行的容器
docker ps

# 2. 停掉所有正在运行的容器(否则删除不掉)
docker stop [containerID]   # docker stop $(docker container ls -q)

# 3. 执行删除
docker rmi -f $(docker images -aq)

# 4. 查看镜像
docker images
```

## 3、查看网卡信息

1. 先了解一下`ip addr`命令

```bash
ip addr

lo        # 本机回环地址 127.0.0.1
eth0      # 阿里云内网地址 172.31.81.32
docker0   # docker生成的网卡 172.17.0.1
```

2. 获取当前网卡ip地址和mac地址

```bash
[root@--- ~]# ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:16:3e:0a:00:34 brd ff:ff:ff:ff:ff:ff
    inet 172.31.81.32/20 brd 172.31.95.255 scope global dynamic eth0
       valid_lft 291944112sec preferred_lft 291944112sec
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    link/ether 02:42:a4:2f:c5:62 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
[root@--- ~]#

```

> 下面通过docker启动几个容器来探究一下Docker网络👇

## 4、运行容器之后，再次查看网卡信息

安装Docker时，它会**自动创建**三个网络，默认`bridge`网桥（创建容器默认连接到此网络）、 `none` 、`host`

### 4.1、运行`mysql01`, `centos01`, `centos02`容器

- 启动时，docker默认的bridge网桥，docker0给容器服务自动分配ip

```bash
docker run -it --name mysql01 -e MYSQL_ROOT_PASSWORD=123 mysql:5.7
docker run -it --name centos01  centos /bin/bash
docker run -it --name centos02  centos /bin/bash
```

### 4.2、查看ip、mac地址信息

- 可以看到上面启动的三个容器服务的`mac`信息

```bash
$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:16:3e:0a:00:34 brd ff:ff:ff:ff:ff:ff
    inet 172.31.81.32/20 brd 172.31.95.255 scope global dynamic eth0
       valid_lft 291916543sec preferred_lft 291916543sec
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:a4:2f:c5:62 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
140: br-799426d70aa2: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    link/ether 02:42:7f:01:1d:00 brd ff:ff:ff:ff:ff:ff
    inet 172.18.0.1/16 brd 172.18.255.255 scope global br-799426d70aa2
       valid_lft forever preferred_lft forever
154: vethe3da564@if153: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether ea:84:fb:14:47:99 brd ff:ff:ff:ff:ff:ff link-netnsid 0
156: veth6477da5@if155: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether 86:35:30:8d:14:85 brd ff:ff:ff:ff:ff:ff link-netnsid 1
158: veth17b2712@if157: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether 72:76:f0:3c:17:e8 brd ff:ff:ff:ff:ff:ff link-netnsid 2
```

### 4.3、查看docker网络

```bash
[root@--- ~]# docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
feafa30d4051   bridge    bridge    local
e8bf4fced9e2   host      host      local
6263db0933b9   none      null      local
[root@--- ~]#
```

### 4.4、查看默认bridge网桥(docker0)

```bash
[root@--- ~]# docker network inspect feafa30d4051
[
    {
        "Name": "bridge",
        "Id": "feafa30d4051f24353508959bd420fd163ad0c98d6b30ec8ff13b59a59552bb1",
        "Created": "2021-09-26T15:10:27.167774553+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "29298987c51b777b546bf6626560020ce235e390e1d7fcfe188c6db228ca4edf": {
                "Name": "mysql01",
                "EndpointID": "f6572c49234f74a6c0b652a379bb386f843ebd23b02abd59b1f6a9d1c9534b17",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",    # ✨容器的IP✨
                "IPv6Address": ""
            },
            "cb1922b95b9316d129b54f3545fad9729092926e10a1d5517f8928db42706151": {
                "Name": "centos01",
                "EndpointID": "ef6cfa74f56bfa4f49143aa08cf323812002236bc63f75204dee7c3ec1162250",
                "MacAddress": "02:42:ac:11:00:03",
                "IPv4Address": "172.17.0.3/16",    # ✨容器的IP✨
                "IPv6Address": ""
            },
            "cc6f510b9765ba018dbafd416c9774ddf5fd3ff55fa992827f55516e8dc70b6a": {
                "Name": "centos02",
                "EndpointID": "2f901aec8f8b455d1fb06112c9035a19f34cc597d8907f26f1b896f12d7eb7ba",
                "MacAddress": "02:42:ac:11:00:04",
                "IPv4Address": "172.17.0.4/16",    # ✨容器的IP✨
                "IPv6Address": ""
            }
        },
        "Options": {
            "com.docker.network.bridge.default_bridge": "true",
            "com.docker.network.bridge.enable_icc": "true",
            "com.docker.network.bridge.enable_ip_masquerade": "true",
            "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
            "com.docker.network.bridge.name": "docker0",
            "com.docker.network.driver.mtu": "1500"
        },
        "Labels": {}
    }
]
```

### 4.5、测试容器通信

> 此时，进入`centos01`容器，`ping` mysql容器的`ip`可以ping通，但是ping不通容器名 ❗

```bash
docker exec -it cb1922b95b93 /bin/bash
ping 172.17.0.2

# docker0不支持容器名连接访问
ping mysql01
ping: mysql01: Name or service not known


docker run 启动镜像的时候docker都会分配一个网卡地址

#查看运行容器的ip
docker inspect 容器ID | grep IPAddress
```

如下图👇

![](https://files.mdnice.com/user/34064/322be90a-063f-429b-9241-0293a832757f.png)

## 5、容器通信原理

- 只要我们安装了docker，就会有一个网卡docker0（相当于一个路由器），每启动一个docker容器，docker都会给docker容器分配一个ip（连接路由器的终端，同一网段下终端可以互相通信），

- 通过`evth-pair`技术实现，`evth-pair`就是一对*虚拟设备接口*，他们都是成对出现的，一端连着协议，一端彼此相连，`evth-pair`充当一个桥梁，连接各种虚拟网络设备。

- Docker网络使用的是`Linux桥接`，宿主机是docker容器的网桥，docker0，最多分配65535个

- 删除容器之后，虚拟网卡就自动消失了。（**虚拟网卡传递效率高！**）

![](https://files.mdnice.com/user/34064/08caee17-aad2-473f-bd89-adafd9a08caf.png)

启动容器不设置网络，容器ip由docker0自动分配情况下，容器间的通信，要经过`evth-pair`技术实现，**并不是直连的**。(跟计算机网络通信类似，分层模型，TCP/IP协议数据报封装解封装)

![](https://files.mdnice.com/user/34064/05840b3b-e40f-4b39-9a78-78c43838f9dc.png)

### 5.1、结论

1. `tomcat01`,`tomcat02`是共用的一个路由器，docker0

2. 所有的容器启动时，如果不指定网络的情况下，都是docker0路由的。65535

![](https://files.mdnice.com/user/34064/348baac0-815d-4df3-b9b8-fe9dd07c8bfb.png)

## 最后

上面`docker0`不支持容器名连接访问，容器通信只可以通过容器`ip`通信，docker也无法保证容器重启后的IP地址不变，所以更好的方式是**通过别名进行互联**，下篇继续讲解怎么通过别名进行容器通信，😊😊。

---

🌹 持续更文，关注我，你会发现一个踏实努力的宝藏前端😊，让我们一起学习，共同成长吧。

🎉 喜欢的小伙伴记得点赞关注收藏哟，回看不迷路 😉

🎁 欢迎大家评论交流, 蟹蟹😊