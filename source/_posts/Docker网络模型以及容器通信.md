---
title: Docker网络模型以及容器通信
date: 2022-08-29 22:16:09
tags: [Docker]
categories: [后端运维]
description: 本篇接着上篇：【Docker0网络及原理探究】，继续深入探究容器网络通信原理，通过学习Docker网路驱动模型，更好地解决容器间的通信问题🎉🎉
---

> 本篇接着上篇：【Docker0网络及原理探究】，继续深入探究容器网络通信原理，通过学习Docker网路驱动模型，更好地解决容器间的通信问题🎉🎉

## 1、Docker的网络驱动模型
### 1.1、Docker的网络驱动模型分类：

1. `bridge`：Docker中默认的网络驱动模型，在启动容器时如果不指定则默认为此驱动类型；

2. `host`：打破Docker容器与宿主机之间的网络隔离，直接使用宿主机的网络环境，该模型仅适用于Docker17.6及以上版本；

3. `overlay`：可以连接多个docker守护进程或者满足集群服务之间的通信；适用于不同宿主机上的docker容器之间的通信；

4. `macvlan`：可以为docker容器分配`MAC`地址，使其像真实的物理机一样运行；

5. `none`：即禁用了网络驱动，需要自己手动自定义网络驱动配置；

6. `plugins`：使用第三方网络驱动插件；

### 1.2、Docker网络模式

- **查看docker网络** `docker network ls`

```bash
[root@--- ~]# docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
feafa30d4051   bridge    bridge    local
e8bf4fced9e2   host      host      local
6263db0933b9   none      null      local
[root@--- ~]# 
```

Docker内置这三个网络，运行容器时，你可以使用该`--network`标志来指定容器应连接到哪些网络。

该`bridge`网络代表`docker0`所有Docker安装中存在的网络。除非你使用`docker run --network=<NETWORK>`选项指定，否则Docker守护程序默认将容器连接到此网络。

我们在使用`docker run`创建Docker容器时，可以用 `--net` 选项指定容器的网络模式，**Docker可以有以下4种网络模式**：

1. `host模式`：使用 `--net=host` 指定。

2. `none模式`：使用 `--net=none` 指定。

3. `bridge模式`：使用 `--net=bridge` 指定，默认设置。

4. `container模式`：使用 `--net=container:NAME_or_ID` 指定。

```bash
docker run -it -P --name tomcat01 --net=bridge tomcat  # 默认设置
docker run -it -P --name tomcat02 --net=none tomcat
# ...
```

## 2、容器通信问题

1. 由于不同容器通过`veth pair`连接在虚拟网桥`docker0`上，所以容器之间可以通过`IP`互相通信，**但是无法通过容器名进行通信**。docker0不支持容器名连接访问

2. 默认网桥`bridge`上的容器只能通过IP互连，无法通过`DNS`解析名称或别名。假如我们在container1中部署了Web服务，在container2中部署了mysql，container1中的Web服务往往需要连接container2的mysql，这是只能靠IP进行连接，但是docker也无法保证容器重启后的IP地址不变，所以更好的方式是通过别名进行互联，在网络中加入DNS服务器，将容器名与IP地址进行匹配，省去了手动修改Web服务中连接mysql的IP的过程。

为了实现不同容器**通过容器名或别名的互连**，docker提供了以下几种：👇

1. 在启动docker容器时加入`--link`参数，但是目前已经被废弃，废弃的主要原因是需要在连接的两个容器上都创建--link选项，当互连的容器数量较多时，操作的复杂度会显著增加；

2. 启动docker容器后进入容器并修改 `/etc/hosts` 配置文件（本地DNS解析），缺点是手动配置较为繁杂；

3. 用户**自定义bridge网桥**，这是目前解决此类问题的主要方法，提供更好的隔离效果和更好的互通性（更好的隔离效果是针对外界网络，而更好的互通性则是指同一`bridge`下的不同容器之间），用户自定义bridge在容器之间提供了自动DNS解析。

> 容器在默认情况下以隔离方式运行，它们完全不知道同一计算机上有其他进程或容器。 那么，如何使容器能够彼此通信？ 答案就是网络连接。 如果两个容器在同一网络上，那么它们可彼此通信。 如果没在同一网络上，则没法通信。

## 3、容器之间通信的主要方式总结
### 3.1、通过容器ip访问

容器重启后，ip会发生变化。通过容器ip访问不是一个好的方案。

### 3.2、通过宿主机的ip:port访问

通过宿主机的`ip:port`访问，只能依靠监听在暴露出的端口的进程来进行有限的通信。

### 3.3、通过`--link`建立连接（官方不推荐使用）

**原理分析：**

- 运行容器时，指定参数link，使得源容器与被链接的容器可以进行相互通信，并且接受的容器可以获得源容器的一些数据，比如：环境变量。

- 与`/etc/hosts`中的主机条目不同，如果重新启动源容器，则不会自动更新存储在环境变量中的IP地址。我们建议使用主机条目 `/etc/hosts`来解析链接容器的IP地址。

- 除了环境变量之外，Docker还将源容器的主机条目添加到`/etc/hosts`文件中。(本质上就是通过 `--link` 参数，自动的给容器添加 `hosts` 配置)

**`--link`建立连接步骤：✨**

1. 启动tomcat01,tomcat02

```bash
docker run -it -P --name tomcat01 tomcat
docker run -it -P --name tomcat02 tomcat
```
> - `--link` 通过配置 `/etc/hosts` 实现连接
>
> - 通过`link`建立连接的容器，被链接的容器能 ping 通源容器，反过来不行。
>
> - 被链接容器会继承源容器的环境变量信息

2. 建立`link`连接

`tomcat02` 容器 link 到 `tomcat03` 上

```bash
docker run -it -P --name tomcat03 --link tomcat02 tomcat
```

3. 查看tomcat03 hosts配置

```bash
[root@--- ~]# docker exec -it tomcat03 cat /etc/hosts
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
ff00::0	ip6-mcastprefix
ff02::1	ip6-allnodes
ff02::2	ip6-allrouters
172.17.0.3	tomcat02 099602f3ff7f #✨--link命令配置生成的条目✨
172.17.0.4	a20a10b7e728
[root@--- ~]# 
```

### 3.4、🧨通过 User-defined networks（推荐）

**用户自定义网桥步骤：✨**

1. 创建用户自定义bridge网桥

```bash
[root@--- ~]# docker network create test-network
799426d70aa28b73b4a777c85b338186eafadd1558b13c43e07a9fd9a8b545e7
[root@iZm5e23n3ueobwkjtfartxZ ~]# docker network ls
NETWORK ID     NAME           DRIVER    SCOPE
feafa30d4051   bridge         bridge    local
e8bf4fced9e2   host           host      local
6263db0933b9   none           null      local
799426d70aa2   test-network   bridge    local   #✨创建的桥接网络✨
```

> 删除网桥:  `docker network rm test-network`

2. 把之前启动的 mysql01,centos01,centos02 容器加入到自定义bridge网桥中: `connect`
```bash
docker network connect test-network mysql01
docker network connect test-network centos01
docker network connect test-network centos02
```

3. 查看自定义bridge网桥信息

```bash
docker network inspect 799426d70aa2
[
    {
        "Name": "test-network",
        "Id": "799426d70aa28b73b4a777c85b338186eafadd1558b13c43e07a9fd9a8b545e7",
        "Created": "2021-10-03T20:30:03.325679562+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.18.0.0/16",  #✨test-network的子网✨
                    "Gateway": "172.18.0.1"     #✨test-network的网关✨
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
                "EndpointID": "a69560a1872a25af042c74132df5dcade6e0e93faf9102185c1de19f6c8b3b36",
                "MacAddress": "02:42:ac:12:00:02",
                "IPv4Address": "172.18.0.2/16",    #✨mysql01 容器的IP，与之前不同✨
                "IPv6Address": ""
            },
            "cb1922b95b9316d129b54f3545fad9729092926e10a1d5517f8928db42706151": {
                "Name": "centos01",
                "EndpointID": "f0cf5feb77ec23526fe5cee217dba9271125b9b4106c81bc7d58253ac48a4caf",
                "MacAddress": "02:42:ac:12:00:03",
                "IPv4Address": "172.18.0.3/16",    #✨centos01 容器的IP，与之前不同✨
                "IPv6Address": ""
            },
            "cc6f510b9765ba018dbafd416c9774ddf5fd3ff55fa992827f55516e8dc70b6a": {
                "Name": "centos02",
                "EndpointID": "6c88540d719014e441d3119c4388e62d311b07acf009106e16aa66d7ebaf5763",
                "MacAddress": "02:42:ac:12:00:04",
                "IPv4Address": "172.18.0.4/16",    #✨centos02 容器的IP，与之前不同✨
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

4. 通过容器名或别名互连通信

进入centos01容器，`ping centos02`, `ping mysql01`

可以发现centos01可以和centos02、mysql01容器之间可以通信

```bash
docker exec -it cb1922b95b93 /bin/bash👈
[root@cb1922b95b93 /]# ping centos02👈
PING centos02 (172.18.0.4) 56(84) bytes of data.
64 bytes from centos02.test-network (172.18.0.4): icmp_seq=1 ttl=64 time=0.118 ms
64 bytes from centos02.test-network (172.18.0.4): icmp_seq=2 ttl=64 time=0.113 ms
...
ping mysql01👈
PING mysql01 (172.18.0.2) 56(84) bytes of data.
64 bytes from mysql01.test-network (172.18.0.2): icmp_seq=1 ttl=64 time=0.107 ms
64 bytes from mysql01.test-network (172.18.0.2): icmp_seq=2 ttl=64 time=0.103 ms
...
```

5. 断开网络

由于我们的容器仍然连接着默认bridge网桥docker0，而现在我们已经不需要它，所以应该将容器与docker0的连接断开，执行以下操作`disconnect`:

```bash
docker network disconnect bridge mysql01
docker network disconnect bridge centos01
docker network disconnect bridge centos02
```

6. 查看默认bridge网桥docker0的容器网络配置

```bash
docker network inspect feafa30d4051👈
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
        "Containers": {},    #✨之前的容器服务，已经从默认网桥中移除✨
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

## 最后

了解了Docker网络、容器通信之后，对继续学习服务网格（`Service Mesh`）与`Kubernetes`的服务发现有很大帮助。很多的项目架构也都是从网络通信角度进行的层级、模块划分（比如：网路拓扑图、终极系统架构异地多活）。关于网络，学完之后你会发现很多东西都串一块了，超级有意思😊 

微信公众号：【看见另一种可能】

---

🌹 持续更文，关注我，你会发现一个踏实努力的宝藏程序员😊，让我们一起学习，共同成长吧。

🎉 喜欢的小伙伴记得点赞关注收藏哟，回看不迷路 😉

🎁 欢迎大家评论交流, 蟹蟹😊

