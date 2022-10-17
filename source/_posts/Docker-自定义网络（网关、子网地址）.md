---
title: Docker | 自定义网络（网关、子网地址）
tags: Docker
categories: Docker
description: 本篇讲解Docker自定义网络，指定网关和子网地址，以及同一网络下的容器通信问题
abbrlink: 2785354845
date: 2022-10-17 22:36:23
---

> 本篇收录至[Docker专栏](https://blog.i-xiao.space/categories/Docker/)，持续更新，欢迎访问😊

## 了解 docker network

通过下面的命令来获取帮助

1. docker network --help

```bash
Commands:
  connect     Connect a container to a network
  create      Create a network
  disconnect  Disconnect a container from a network
  inspect     Display detailed information on one or more networks
  ls          List networks
  prune       Remove all unused networks
  rm          Remove one or more networks
```

2. docker network create --help

```bash
Options:
      --attachable           Enable manual container attachment
      --aux-address map      Auxiliary IPv4 or IPv6 addresses used by Network driver (default map[])
      --config-from string   The network from which to copy the configuration
      --config-only          Create a configuration only network
  -d, --driver string        Driver to manage the Network (default "bridge")
      --gateway strings      IPv4 or IPv6 Gateway for the master subnet   # 网关
      --ingress              Create swarm routing-mesh network
      --internal             Restrict external access to the network
      --ip-range strings     Allocate container ip from a sub-range
      --ipam-driver string   IP Address Management Driver (default "default")
      --ipam-opt map         Set IPAM driver specific options (default map[])
      --ipv6                 Enable IPv6 networking
      --label list           Set metadata on a network
  -o, --opt map              Set driver specific options (default map[])
      --scope string         Control the network's scope
      --subnet strings       Subnet in CIDR format that represents a network segment  #子网
```

## 创建网络

- --driver bridge          网络类型，默认bridge网桥
- --subnet 192.168.0.0/16  子网
- --gateway 192.168.0.1    网关

### 创建 `mynet` 网络

```bash
docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 mynet
0096a971fd2c66400e53cbae5e53eceedc2f90d5685917e9534640a3535c0ef1
```

### 查看网卡

```bash
[root@--- ~]# ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:16:3e:0a:00:34 brd ff:ff:ff:ff:ff:ff
    inet 172.31.81.32/20 brd 172.31.95.255 scope global dynamic eth0
       valid_lft 291870572sec preferred_lft 291870572sec
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    link/ether 02:42:a4:2f:c5:62 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
140: br-799426d70aa2: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    link/ether 02:42:7f:01:1d:00 brd ff:ff:ff:ff:ff:ff
    inet 172.18.0.1/16 brd 172.18.255.255 scope global br-799426d70aa2     # test-network
       valid_lft forever preferred_lft forever
176: br-0096a971fd2c: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    link/ether 02:42:d9:14:c1:d3 brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.1/16 brd 192.168.255.255 scope global br-0096a971fd2c   # mynet
       valid_lft forever preferred_lft forever
```

### 查看网络

```bash
[root@--- ~]# docker network ls
NETWORK ID     NAME           DRIVER    SCOPE
feafa30d4051   bridge         bridge    local
e8bf4fced9e2   host           host      local
0096a971fd2c   mynet          bridge    local  # 自定义bridge网桥
6263db0933b9   none           null      local
799426d70aa2   test-network   bridge    local
```

### 查看 `mynet` 网络详细信息

```bash
[root@--- ~]# docker network inspect 0096a971fd2c
[
    {
        "Name": "mynet",
        "Id": "0096a971fd2c66400e53cbae5e53eceedc2f90d5685917e9534640a3535c0ef1",
        "Created": "2021-10-04T10:18:09.113847736+08:00",
        "Scope": "local",
        "Driver": "bridge",  # mynet 网络类型
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "192.168.0.0/16",   # mynet 子网
                    "Gateway": "192.168.0.1"      # mynet 网关
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
        "Containers": {},
        "Options": {},
        "Labels": {}
    }
]
```

## 启动容器，并加入mynet网络

### 启动 `mynet-centos01` , `mynet-tomcat01` 并加入mynet网络

```bash
[root@--- ~]# docker run -it -P --name mynet-tomcat01 --net mynet tomcat
[root@--- ~]# docker run -it -P --name mynet-centos01 --net mynet centos
```

### 查看mynet网桥信息

```bash
[root@--- ~]# docker network inspect 0096
[
    {
        "Name": "mynet",
        "Id": "0096a971fd2c66400e53cbae5e53eceedc2f90d5685917e9534640a3535c0ef1",
        "Created": "2021-10-04T10:18:09.113847736+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "192.168.0.0/16",
                    "Gateway": "192.168.0.1"
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
            "2fac920eebd505794c4a27ef4efdf531d32805e8663bded93a473bd28236bc27": {
                "Name": "mynet-centos01",
                "EndpointID": "3aff0752e641651a446ec490faa000812417855739086b2edb584ac2a95a26dd",
                "MacAddress": "02:42:c0:a8:00:02",
                "IPv4Address": "192.168.0.2/16",
                "IPv6Address": ""
            },
            "3dceda051252b6970fe2156bac7710ba6489a97aac68c49b1c85a2f130d0556f": {
                "Name": "mynet-tomcat01",
                "EndpointID": "9f52b19493d35c48fe9b33a319de5dbe54c50de1a5d049103cb4e39bfe645f1b",
                "MacAddress": "02:42:c0:a8:00:03",
                "IPv4Address": "192.168.0.3/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]

```

### 进入 `mynet-centos01` 测试连接 `mynet-tomcat01`

```bash
# 发现通过容器ip和容器名都可以连接

[root@--- ~]# docker exec -it 2fac920eebd5 /bin/sh
sh-4.4# ping
sh-4.4# ping 192.168.0.3   # 通过容器ip连接
PING 192.168.0.3 (192.168.0.3) 56(84) bytes of data.
64 bytes from 192.168.0.3: icmp_seq=1 ttl=64 time=0.140 ms
64 bytes from 192.168.0.3: icmp_seq=2 ttl=64 time=0.110 ms
^C
--- 192.168.0.3 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3000ms
rtt min/avg/max/mdev = 0.110/0.121/0.140/0.016 ms

sh-4.4# ping mynet-tomcat01   # 通过容器名连接
PING mynet-tomcat01 (192.168.0.3) 56(84) bytes of data.
64 bytes from mynet-tomcat01.mynet (192.168.0.3): icmp_seq=1 ttl=64 time=0.078 ms
64 bytes from mynet-tomcat01.mynet (192.168.0.3): icmp_seq=2 ttl=64 time=0.131 ms
^C
--- mynet-tomcat01 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2001ms
rtt min/avg/max/mdev = 0.078/0.110/0.131/0.026 ms
sh-4.4#
```

#### 结论

在同一网络下的容器，发现通过`容器ip`和`容器名`都可以连接

## 思考问题：

>
> 其它网络下的容器可以直接访问mynet网络下的容器吗？
>
> 答案：不可以
>
> 解决方法： 让别的网络下的容器加入到`mynet`网络下

![](https://pic1.imgdb.cn/item/634d69ae16f2c2beb1d5df36.jpg)

---

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**
