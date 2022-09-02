---
title: 常用的SSH，你了解多少？（长文警告）
date: 2022-09-01 15:35:32
tags: [SSH]
categories: [前端]
description: 本文从SSH工作原理、加密方式探究开始，引出多主机配置ssh连接的密钥选择问题，继续分析ssh_config配置，配以示例配置，干货慢慢。
---
# 1、SSH工作原理

从ssh的**加密方式**说开去，看下文👇

## 1.1、对称加密

客户端和服务端采用相同的密钥进行数据的加解密，很难保证密钥不丢失，或者被截获。隐藏着**中间人攻击**的风险

> 如果攻击者插在用户与远程主机之间（比如在公共的wifi区域），用伪造的公钥，获取用户的登录密码。再用这个密码登录远程主机，那么SSH的安全机制就不存在了。这种风险就是著名的"中间人攻击"（`Man-in-the-middle attack`）


为了解决对称加密的漏洞，就出现了非对称加密。非对称加密有两个密钥：“公钥”和“私钥”。公钥加密后的密文，只能通过对应的私钥进行解密。想从公钥推理出私钥几乎不可能，所以非对称加密的安全性比较高。

## 1.2、非对称加密

**ssh连接远程git仓库时的登录验证原理**：本地主机向远程主机发送登录请求，远程主机收到请求后，返回给本地主机一个随机字符串A，本地主机用私钥加密字符串A得到密文B，并把密文B发送给远程主机，远程主机用公钥解密密文A得到字符串B，并判断A是否等于B，如果相等，则认证成功，反之，则反之。
不在要求使用密码登录，以公私钥的方式实现免密登录

![](https://pic.imgdb.cn/item/63119b6b16f2c2beb1e029b5.png)

## 1.3、基于口令和公钥认证

只有在第一次连接的时候需要，通信双方验证身份之后就可以通过在客户端的私钥和你存放在服务器的公钥进行认证。(通过服务器上的公钥加密，客户端的私钥解密来验证)

**第一次登录：**

> 如果不是第一次登录，想看一下效果的话，可以修改一下本地的 `~/.ssh/known_hosts` 文件名（`~/.ssh/known_hosts`文件中保存的是已经认证过的公钥信息），重命名该文件之后，相当于清空了认证过的公钥信息，再次连接的时候就会重新认证😁😁

1. ssh连接远程主机

```bash
$ git clone git@gitcode.net:xxx.git
Cloning into 'xxx'...
The authenticity of host 'gitcode.net (119.3.229.170)' can't be established.
RSA key fingerprint is SHA256:pyrMa3p0o90Qsuz2+kMX3CIBl+S1cZsdRlCoaosSg00Qs.
Are you sure you want to continue connecting (yes/no/[fingerprint])?yes
Warning: Permanently added 'gitcode.net,119.3.229.170' (RSA) to the list of known hosts.
```

2. 查看 known_hosts 文件

```bash
# 查看known_hosts文件
$ cat known_hosts
gitcode.net,119.3.229.170 ssh-rsa AAAAB3NzaC1yc2EAAAL......
```

- 因为公钥长度较长（采用`RSA`算法），很难比对，所以对其进行`MD5`计算，将它变成一个128位的指纹，如上`fingerprint`，这样比对就容易多了。

- 当远程主机的公钥被接受以后，它就会被永久保存在文件 `~/.ssh/known_hosts` 文件之中，下次再登录就会跳过`Warning`部分

![该图来源网络，侵删](https://pic.imgdb.cn/item/63119b8216f2c2beb1e035eb.png)
上图来源网络，侵删

> 下面以多个主机配置`ssh`连接时怎么指定使用哪个公钥为切入点，讲解`ssh config`。讲透、看爽！

# 2、多个代码仓库配置ssh连接问题

SSH 是连接远程主机最常用的方式，尽管连接到单个主机的基本操作非常直接，但当你开始使用大量的远程系统时（比如：配置多个代码托管平台的ssh），这就会成为笨重和复杂的任务。

幸运的是，[OpenSSH](https://www.ssh.com/academy/ssh/openssh) 允许您提供自定义的客户端连接选项。这些选项可以被存储到一个配置文件中，这个配置文件可以用来定义每个主机的配置。这有助于保持每个主机的连接选项更好的独立和组织，也你让你在需要连接时避免在命令行中写繁琐的选项。

目前我使用的代码托管平台有`GitHub、Gitee、Gitlab、Gitcode`（瞎折腾👀），即使只使用一个平台，比如 gitlab，也会存在公司账号跟个人账号的ssh配置问题，下面讲解ssh连接远程主机时怎么指定使用哪个公钥

> 下面展示都在Windows 系统下

# 3、ssh config 自定义主机配置

## 3.1、ssh config 介绍

解决多个ssh密钥使用问题的**最佳方案**就是通过维护一个本地配置 `config`，指定主机使用哪个密钥。

> 其他方案：（需要连接的主机多了同样很难管理，不建议使用，了解即可）
> 1. 设置环境变量`GIT_SSH_COMMAND`解决
>
> 2. 指定命令行参数：`ssh -i ~/.ssh/xxx.pub -p 22  www.example.com`


用户级设置的路径: `~/.ssh/config`

### 3.1.1、文件格式

```bash
Host firsthost
    SSH_OPTIONS_1 custom_value
    SSH_OPTIONS_2 custom_value
    SSH_OPTIONS_3 custom_value

Host secondhost
    ANOTHER_OPTION custom_value

Host *host
    ANOTHER_OPTION custom_value

# 公用配置在最下面
Host *
    CHANGE_DEFAULT custom_value
```
解释：Host：ssh连接主机的别称 alias

### 3.1.2、尝鲜一下

本地系统的每个用户都可以维护一个客户端的 SSH 配置文件，这个配置文件可以包含你在命令行中使用 ssh 时参数，也可以存储公共连接选项并在连接时自动处理。你可以在命令上中使用 ssh 来指定 flag ，以覆盖配置文件中的选项。
看一个例子：

- ssh命令行的方式：

```bash
ssh -i ~/.ssh/xxx -p 22 -l admin \ www.example.com
```
上面的命令可以转换成 `config` 的形式，如下：

- `ssh/config` 定义主机连接参数配置

```bash
Host myserver1
	Hostname www.example.com
	# User admin
	Port 22
	IdentityFile ~/.ssh/xxx

# 公共配置， 必须在文件最下面
Host *
  User admin
```

## 3.2、解释算法

它从文件顶部向下执行此操作，所以顺序非常重要，了解这个之后，方便我们写出更好的主机定义配置选项、方便运维管理。

当匹配到第一个主机定义时，并不会终止，而是继续往下查找，检查是否有其他匹配的 Host 定义。如果有另一个 Host 定义匹配，SSH 将该 Host 定义下的配置选项跟前面匹配到的主机定义配置选项合并（**随着继续往下读取配置，最终配置选项是叠加的**）

## 3.3、ssh_config 的工作原理✨

### 3.3.1、ssh 客户端按以下顺序从三个地方读取配置：

1. 系统范围内 `/etc/ssh/ssh_config`（适用与主机下的所有用户，系统级 System）

2. 用户特定的 `~/.ssh/config` （用户级）

3. ssh直接提供给的命令行标志 （命令参数可以重写已有的固定配置）

我通常使用的用户级的配置，下面是我个人的配置，仅供参考：

```bash
# gitcode - csdn
Host gitcode.net
  HostName gitcode.net
  Preferredauthentications publickey
  IdentityFile ~/.ssh/gitcode

# gitlab
Host gitlab.com
  HostName gitlab.com
  IdentityFile ~/.ssh/gitlab-rsa

# github
Host github.com
  HostName github.com
  IdentityFile ~/.ssh/id_rsa

# gitee
Host gitee.com
  HostName gitee.com
  IdentityFile ~/.ssh/id_rsa

# 共享配置，文件最下面
Host *
  # 认证方式首选 publickey(公钥)， 可选： publickey,gssapi-keyex,gssapi-with-mic,password
  PreferredAuthentications publickey
  User git # ssh [Host] === ssh [User]@[HostName]
```

**解释：**

- Host：ssh的别称

  比如 Host 设置成 xiao ，使用的时候 ssh xiao（注意设置User）

- HostName： 服务器的地址

- PreferredAuthentications : 认证方式

  可选： `publickey,gssapi-keyex,gssapi-with-mic,password`

- IdentityFile: 指定连接HostName的密钥文件的路径

### 3.3.2、主机别名设置例子

```bash
Host dev1
    HostName dev1.example.com
    User jeery
```

现在要连接到 `jeery@dev1.example.com`，就可以通过在命令行中输入如下命令：

```bash
ssh dev1

# 相当于
ssh jeery@dev1.example.com
```

### 3.3.3、git 仓库连接别名设置例子

![](https://pic.imgdb.cn/item/63119ba916f2c2beb1e0475e.png)

## 3.4、连接问题

```bash
PS C:\Users\xiao\.ssh>vim .\config
PS C:\Users\xiao\.ssh>ssh -T git@gitcode.net
Bad owner or permissions on C:\\Users\\xiao/.ssh/config
PS C:\Users\xiao\.ssh>
```

**解决：**

修改 config 文件 权限
```bash
cd ~/.ssh/
chmod 600 config
```

# 4、git仓库设置ssh连接

下面演示我的设置步骤，仅供参考

## 4.1、本地生成公私钥对

```bash
ssh-keygen -o -t rsa -C "yourmail" -b 4096
```

🔊 记得设置`key`的名字哟，默认是 `id_rsa`（如果不设置`key`，新生成的 `id_rsa` 文件会覆盖原有的`id_rsa`文件，之前添加过的就不能用啦！），参考下图👇

![](https://pic.imgdb.cn/item/63119bba16f2c2beb1e054d6.png)

## 4.2、配置远程主机ssh

登录要连接的远程主机，这里演示 [gitcode](https://gitcode.net/dashboard/projects/home) 平台

![](https://pic.imgdb.cn/item/63119bc716f2c2beb1e06187.png)

## 4.3、设置 ssh_config

这里我统一维护在 `~/.ssh/config`里面维护，增加`gitcode`主机定义配置， 如下：

```bash
# gitcode - csdn
Host gitcode.net
  HostName gitcode.net
  IdentityFile ~/.ssh/gitcode

# 共用配置，文件最下面
Host *
  # 认证方式首选 publickey(公钥), 可选: publickey,gssapi-keyex,gssapi-with-mic,password
  PreferredAuthentications publickey
  User git # ssh [Host] === ssh [User]@[HostName]
```

## 4.4、测试连接

```bash
xiao@LAPTOP-L6TI0438 MINGW64 ~/.ssh
ssh -T gitagitcode.net
Welcome to GitLab,@heyYouU!
xiao@LAPTOP-L6TI0438 MINGW64 ~/.ssh
```

# 最后

相信看完上面的讲解，会对ssh理解的更清除一点。So，快来更换 ssh 试试吧

**连接远程仓库可以选择https，也可以选择ssh**

区别：

1. https 连接有文件传输大小限制，ssh没有

2. ssh传输速度比https协议快

3. https 连接提交代码的时候需要输入账户密码登录，ssh则是以公私钥加解密随机数的方式免密登录

连接仓库的方式可以转换，如： https 转成 ssh，比较简单，不作介绍。

SSH东西超多的，光 SSH 配置选项就几十个，本文抛砖引玉，大家可以继续往下探索🎉🎉

参考文档：

- [https://www.digitalocean.com/community/tutorials/how-to-configure-custom-connection-options-for-your-ssh-client](https://www.digitalocean.com/community/tutorials/how-to-configure-custom-connection-options-for-your-ssh-client)

- [http://www.bjpowernode.com/hot/2664.html](http://www.bjpowernode.com/hot/2664.html)

---


![](https://files.mdnice.com/user/34064/27dc0961-1b17-43f4-951a-ff421816df4f.gif)


我是 [**甜点cc**](https://home.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。主要致力于分享实用技术干货，希望可以给一小部分人一些微小帮助。

我排斥“新人迷茫，老人看戏”的现象，希望能和大家一起努力破局。营造一个良好的技术氛围，为了个人、为了我国的数字化转型、互联网物联网技术、数字经济发展做一点点贡献。数风流人物还看今朝、看中国、看你我。