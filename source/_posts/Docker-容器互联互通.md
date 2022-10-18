---
title: Docker | 容器互联互通
description: 本文讲解不同网络下的容器可以通过加入同一个docker网络，来访问该docker网络下的容器，并且既可以通过容器ip也可以通过容器名连接，非常方便。
abbrlink: 2247720414
date: 2022-10-18 10:27:16
tags:
categories:
---

> 本篇收录至[Docker专栏](https://blog.i-xiao.space/categories/Docker/)，持续更新，欢迎访问😊

上篇讲到创建自定义网络，我创建了 `mynet` 网络，并指定了网关和子网地址。在上篇结尾呢，我抛出了一个问题：其它网络下的容器可以直接访问`mynet`网络下的容器吗？今天就让我们一块看下怎么实现容器互联。

## 其它网络下的容器加入`mynet`网络，实现一个容器两个`ip`地址

**网络集群**

> 1. 先创建`test-network`网络：
>
> - `docker network create test-network`
>
> 2. 再运行`centos01`容器并加入到`test-network`网络下
>
> - `docker run -it -P --name centos01 --net test-network centos`

`centos01`容器已经加入在`test-network`网络下了

### `centos01`加入`mynet`网络

```bash
root@--- ~]# docker network connect mynet centos01
```

### 查看mynet网络

- `docker network ls`

```bash
[root@--- ~]# docker network ls
NETWORK ID     NAME           DRIVER    SCOPE
feafa30d4051   bridge         bridge    local
e8bf4fced9e2   host           host      local
0096a971fd2c   mynet          bridge    local  # 自定义bridge网桥
6263db0933b9   none           null      local
799426d70aa2   test-network   bridge    local
```

- `docker network inspect 0096`

```bash
[root@--- ~]# docker network inspect 0096
[
    {
        "Name": "mynet",
        "Id": "0096a971fd2c66400e53cbae5e53eceedc2f90d5685917e9534640a3535c0ef1",
        "Created": "2021-10-04T10:18:09.113847736+08:00",
        # ... 省略代码展示
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
        # ... 省略代码展示
        "Containers": {
            "2fac920eebd505794c4a27ef4efdf531d32805e8663bded93a473bd28236bc27": {
                "Name": "mynet-centos01",
                "EndpointID": "3aff075...",
                "MacAddress": "02:42:c0:a8:00:02",
                "IPv4Address": "192.168.0.2/16",
                "IPv6Address": ""
            },
            "3dceda051252b6970fe2156bac7710ba6489a97aac68c49b1c85a2f130d0556f": {
                "Name": "mynet-tomcat01",
                "EndpointID": "9f52b19...",
                "MacAddress": "02:42:c0:a8:00:03",
                "IPv4Address": "192.168.0.3/16",
                "IPv6Address": ""
            },
            "cb1922b95b9316d129b54f3545fad9729092926e10a1d5517f8928db42706151": {
                "Name": "centos01",
                "EndpointID": "0ba2107...",
                "MacAddress": "02:42:c0:a8:00:04",
                "IPv4Address": "192.168.0.4/16",   # 新加入的centos01容器
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

### 查看centos01的容器信息

可以看到`Networks`下面存在`mynet`、`test-network`两个网络连接信息

一个容器两个`ip`地址

无关代码已省略展示

```bash
[root@--- ~]# docker inspect cb19
[
    {
        "Id": "cb1922b95b9316d129b54f3545fad9729092926e10a1d5517f8928db42706151",
        "Created": "2021-10-03T13:39:00.942877668Z",
        "Path": "/bin/bash",
        "Args": [],

        # ... 省略代码展示

        "NetworkSettings": {
            # ... 省略代码展示
            "Networks": {
                # 网络连接1 ： mynet
                "mynet": {、
                    # ... 省略代码展示
                    "Gateway": "192.168.0.1",
                    "IPAddress": "192.168.0.4",
                    "MacAddress": "02:42:c0:a8:00:04",
                },
                # 网络连接2 ： test-network
                "test-network": {
                    # ... 省略代码展示
                    "Gateway": "172.18.0.1",
                    "IPAddress": "172.18.0.3",
                    "MacAddress": "02:42:ac:12:00:03",
                }
            }
        }
    }
]
```

## test-network网卡下的centos01访问mynet网卡下的mynet-centos01、mynet-tomcat01

容器ip和容器名都可以连接

### 进入centos01容器

```bash
[root@--- ~]# docker exec -it cb19 /bin/bash
```

`mynet-tomcat01` 容器的IP是: `192.168.0.3`

### ping `mynet-tomcat01` 容器的IP

```bash
[root@cb1922b95b93 /]# ping 192.168.0.3
PING 192.168.0.3 (192.168.0.3) 56(84) bytes of data.
64 bytes from 192.168.0.3: icmp_seq=1 ttl=64 time=0.186 ms
^C
--- 192.168.0.3 ping statistics ---
7 packets transmitted, 7 received, 0% packet loss, time 6000ms
rtt min/avg/max/mdev = 0.090/0.127/0.186/0.029 ms
```

### 直接ping 容器名 `mynet-centos01` `mynet-tomcat01`

```bash
[root@cb1922b95b93 /]# ping mynet-centos01
PING mynet-centos01 (192.168.0.2) 56(84) bytes of data.
64 bytes from mynet-centos01.mynet (192.168.0.2): icmp_seq=1 ttl=64 time=0.105 ms
^C
--- mynet-centos01 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2001ms
rtt min/avg/max/mdev = 0.105/0.116/0.130/0.013 ms

[root@cb1922b95b93 /]# ping mynet-tomcat01
PING mynet-tomcat01 (192.168.0.3) 56(84) bytes of data.
64 bytes from mynet-tomcat01.mynet (192.168.0.3): icmp_seq=1 ttl=64 time=0.085 ms
^C
--- mynet-tomcat01 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
rtt min/avg/max/mdev = 0.085/0.093/0.102/0.012 ms
[root@cb1922b95b93 /]#
```

### 结论

其它网络下的容器可以通过加入docker网络，来访问该docker网络下的容器，并且既可以通过容器ip也可以通过容器名连接，非常方便。`docker0`十分强大

![](https://pic1.imgdb.cn/item/634d69ae16f2c2beb1d5df36.jpg)

---

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**
