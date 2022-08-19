---
title: Linux操作系统学习（运维必会）
date: 2022-08-19 13:24:53
tags: [Linux]
categories: [运维]
description: Linux
---

> Linux一切皆文件，最高权限的账户root。

# 1、开机登录
开机会启动很多进程，在Windows上叫“服务”（service），在Linux上叫做“守护进程”（daemon）

登录方式：

- 命令行登录

- ssh登录

- 图形界面登录

# 2、关机
不管是重启系统还是关闭系统，首先要运行 **sync** 命令，把内存中的数据同步到硬盘中。

```shell
sync                # 将数据从内存同步到硬盘中

shutdown
shutdown -h 10      # 10分钟后关机
shutdown -h +10     # 10分钟后关机
shutdown -h now     # 立马关机
shutdown -h 20:25   # 系统将在今天20:25关机

shutdown -r now     # 立即重启
shutdown -r +10     # 10分钟后重启
reboot              # 重启，相当于 shutdown -r now
halt                # 关机，相当于 shutdown -h now
```

# 3、根目录结构

```shell
/bin        # Binary的缩写，存在最经常使用的命令
/boot       # 存放启动Linux时要使用的一些核心文件，包括链接文件和镜像文件
/dev        # Device的缩写，存放Linux的外部设备
/etc        # 存放系统管理所需的配置文件和子目录
/home       # 用户的主目录，在Linux中，每个用户都有一个自己的目录，一般该目录以用户的账号命名
/lib        # 存放系统最基本的动态链接共享库，其作用类似于Windows里的DLL文件
/lost+found # 这个目录一般是空的，当用户非正常关机时就会在这里存放一些文件
/media      # Linux系统识别出来的设备，例如U盘，光驱，Linux把识别到的设备挂载到这个目录下
/mnt        # 让用户临时挂载别的文件系统
/opt        # 给主机额外安装软件所存放的目录，比如安装Oracle数据库可以放到这个目录下面
/proc       # 虚拟目录，系统内存的映射，可以通过访问这个目录来获取系统信息
/root       # 该目录为系统管理员，也称作超级权限的用户主目录
/sbin       # s 就是 Super User的意思，这里存放系统管理员使用的系统管理程序
/srv        # 存放一些服务启动之后需要提取的数据
/sys        # Linux2.6内核一个很大的变化，该目录下安装了2.6内核中新出现的一个文件系统sysfs
/tmp        # 存放临时文件的目录
/usr        # 用户的很多应用程序和文件都存放在这个目录，类似于Windows下的program files
/usr/bin    # 系统用户使用的应用程序

/www        # 存放服务器网站相关的资源，环境、网站的项目-----------
						#	LNMP: Linux、Nginx、MySQL、Php
            # LTMP: Linux、tomcat、MySQL、Php

```

![](https://files.mdnice.com/user/34064/aff0bdac-3d98-4b92-bb66-31b64553af07.png)


# 4、文件属性

- r：read

- w： write

- x ：可执行execute

- -：没有权限

| 文件类型<br/>0 |属主权限 owner<br/>1 2 3 | 属组权限 group<br/>4 5 6 | 其它用户权限 others<br/>7    8    9    |
| --- | --- | --- | --- |
| d | r     w    x | r     -    x | r     -    x |
| 目录文件 | 读  写   执行 | 读  写  执行 | 读  写   执行 |


- 1、4、7：读

- 2、5、8：写

- 3、6、9：可执行

![](https://files.mdnice.com/user/34064/add9ba6d-077c-418b-8cf1-07bd8718b247.png)

## 4.1、更改文件权限
```bash
chmod 更改9个文件属性

[-rwxrwxrwx] 这九个权限属性，三个一组，
用数字代表权限
r: 4   w: 2   x: 1   4+2+1=7
chmod 777  可读可写可执行     chmod rwxrwxrwx
chmod 666  可读可写不可执行   chmod rw-rw-rw-
```

- 查看文件方法
```shell
cat   # 显示文件内容不够
tac   # 倒序显示文件内容
nl    # 显示文件内容并展示行号
more  # 一页一页显示文件内容，(空格代表翻页，enter代表向下看一行，:f 查看当前行号)
less  # 和more类似，向上翻页
head  # -n参数 控制显示几行
tail  # -n参数，倒着查看最后n行信息
```
# 5、硬链接、软链接

软链接跟Windows上的快捷方式类似，删除源文件，快捷方式也访问不了了。

```shell
# 硬链接
ln 01 02  # 给01文件创建一个硬链接02，01和02指向同一个文件，允许一个文件有多个路径，用户通过这种机制建立硬链接到一些重要文件上，以防误删！

# 软链接
ln -s 01 03
```

![](https://files.mdnice.com/user/34064/a522099f-11fd-419d-9e45-b934fca5f2fd.png)


# 6、账号管理

属主、属组

## 6.1、添加用户

一切皆文件，相当于在 /etc/passwd 文件中写入用户信息

```shell
useradd -参数 用户名
-m 使用者主目录不存在，则自动在/home目录下创建用户名目录

-G 给用户分配属组

useradd -m xiaotest

[root@--- home]# cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:99:99:Nobody:/:/sbin/nologin
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
polkitd:x:999:998:User for polkitd:/:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
postfix:x:89:89::/var/spool/postfix:/sbin/nologin
chrony:x:998:996::/var/lib/chrony:/sbin/nologin
ntp:x:38:38::/etc/ntp:/sbin/nologin
tcpdump:x:72:72::/:/sbin/nologin
nscd:x:28:28:NSCD Daemon:/:/sbin/nologin
mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/bash
redis:x:997:995:Redis Database Server:/var/lib/redis:/sbin/nologin
jenkins:x:996:992:Jenkins Automation Server:/var/lib/jenkins:/bin/false
tss:x:59:59:Account used by the trousers package to sandbox the tcsd daemon:/dev/null:/sbin/nologin
xiao:x:1000:1000::/home/xiao:/bin/bash
xiaotest:x:1001:1001::/home/xiaotest:/bin/bash      # /home/xiaotest 用户主目录
[root@--- home]#

```

## 6.2、删除用户

```shell
userdel -r xiaotest  # 删除用户的时候 一起删除用户的目录
```

## 6.3、修改用户

```shell
usermod
usermod -d /home/test01 xiaotest # 更改用户xiaotest的主目录
```

## 6.4、切换用户

`su 用户名`

```shell
[root@--- home]# su xiaotest   # root用户切换到xiaotest用户
[xiaotest@--- home]$ exit      # 退出当前用户，回到root用户
exit
[root@--- home]#
```

## 6.5、修改阿里云服务器主机名

随机字符串 - 自定义主机名
```shell
hostname
hostname xiao  # 修改主机名为xiao， 重连即可生效

# 重启主句，主机名就会变为随机字符串
```

## 6.6、密码设置

```shell
root 用户配置普通用户密码
passwd xiaotest  # 给xiaotest用户设置登录密码

# 重建连接，使用普通用户登录即可
```

## 6.7、锁定解锁用户

只有root用户才可以操作

使用场景: 某员工辞职，或者合伙人设置

```shell
passwd -l xiaotest  # -l  lock 锁定用户，不能继续登录
passwd -d xiaotest  # -d  删除密码，给用户输入空口令，没有密码也不能登录

-u：解锁用户
passwd -u xiaotest
```

![](https://files.mdnice.com/user/34064/61f7e942-9401-4aa7-a001-81b97b19a115.png)

# 7、用户组管理

`/etc/group` 文件

每个用户都有一个用户组，系统可以对一个用户组下面的所有用户进行集中管理（开发、测试、运维、root）

## 7.1、创建用户组

```shell
groupadd test01

[root@xiao ~]# cat /etc/group
root:x:0:
bin:x:1:
daemon:x:2:
sys:x:3:
adm:x:4:
tty:x:5:
disk:x:6:
lp:x:7:
mem:x:8:
kmem:x:9:
wheel:x:10:
cdrom:x:11:
mail:x:12:postfix
man:x:15:
dialout:x:18:
floppy:x:19:
games:x:20:
tape:x:33:
video:x:39:
ftp:x:50:
lock:x:54:
audio:x:63:
nobody:x:99:
users:x:100:
utmp:x:22:
utempter:x:35:
input:x:999:
systemd-journal:x:190:
systemd-network:x:192:
dbus:x:81:
polkitd:x:998:
ssh_keys:x:997:
sshd:x:74:
postdrop:x:90:
postfix:x:89:
chrony:x:996:
ntp:x:38:
tcpdump:x:72:
nscd:x:28:
mysql:x:27:
redis:x:995:
cgred:x:994:
docker:x:993:
jenkins:x:992:
tss:x:59:
xiao:x:1000:
xiaotest:x:1001:
allblue:x:1002:
test01:x:1003:
test02:x:520:      # 通过使用 -g 参数制定id
dev:x:1003:dev01   # dev组 该组下有dev01用户 新建用户是通过-G参数指定
dev01:x:1004:
[root@xiao ~]#


通过使用 -g 参数指定id
groupadd -g 520 test02
```

## 7.2、删除用户组

```shell
groupdel test01
```

## 7.3、修改用户组

修改权限信息和名字

```shell
-g 修改id
-n 修改名字
groupmod -g 123 test01
groupmod -n newtest01 test01

```

## 7.4、切换用户组

```shell
# 登录当前用户 xiaotest
$ newgrp root
```

## 7.5、用户密码

`/etc/shadow`文件下

密码已经加密

```shell
allblue:$6$hSPupMOZ$WMbjL2pn8bhSkiD7NicH6sDAJYfEKnU3ofylMuOrSMuqqt/i/wirkCwbinA0VjhXBTExmSSPdFb6LPpLRN3hS.:18917:0:99999:7:::
```

# 8、磁盘管理

`du - disk usage`

```shell
df  查看系统整体磁盘的使用量
df -h 以兆(m)为单位显示

du  查看当前磁盘的空间使用量
du -a # 查看全部文件，包括隐藏文件和子文件

# 查看根目录下每个目录多占用的容量
du -sm /*

#寻找当前目录，哪个文件夹占用空间最大
du -h --max-depth=1

```

![](https://files.mdnice.com/user/34064/ceab08f4-9ec2-4cf8-b3c7-55f8b8e59491.png)


![](https://files.mdnice.com/user/34064/38149daa-3e4b-460d-b8df-75b08375bd23.png)

## 8.1、释放空间

使用 `du -h --max-depth=1`  命令查找大文件

### **/var/log/journal/ 垃圾日志清理**

```powershell
// 1. 只保留近一周的日志
journalctl --vacuum-time=1w

// 2. 只保留500MB的日志
journalctl --vacuum-size=500M
```

# 9、进程管理

1. Linux中每一个程序都有一个自己的进程，每一个进程都有一个id

2. 每一个进程都会有一个父进程

3. 进程有两种存在方式：前台、后台

4. 一般服务都是后台运行的，程序都是是前台运行的

## 9.1、ps -aux

```shell
ps   # 查看当前系统中正在执行的各种进程的信息

-a # 显示当前终端运行的所有进程信息
-u # 以用户的信息显示进程
-x # 显示后台运行进程的参数 启动进程时所携带的参数

| # 管道符
A | B  # A、B命令，A命令的结果作为输出传递给B命令
grep # 查看文件中复合条件的字符串

ps -aux|grep nginx   # 查看nginx的进程信息
[root@xiao composetest]# ps -aux|grep nginx
root     15986  0.0  0.0 112712   960 pts/0    S+   19:29   0:00 grep --color=auto nginx
root     19664  0.0  0.0  45940  1168 ?        Ss   Oct06   0:00 nginx: master process /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
nobody   19668  0.0  0.1  46928  3248 ?        S    Oct06   1:52 nginx: worker process
[root@xiao composetest]#

ps -aux|grep mongo   # 查看mongo的进程信息
root     16035  0.0  0.0 112712   956 pts/0    S+   19:29   0:00 grep --color=auto mongo
root     19440  0.4  5.3 1635344 101348 ?      SLl  Sep04 308:50 mongod --config /usr/local/mongodb/etc/mongodb.conf

```

- UID    //用户ID、但输出的是用户名

- PID    //进程的ID
- PPID    //父进程ID
- C      //进程占用CPU的百分比
- STIME  //进程启动到现在的时间
- TTY    //该进程在那个终端上运行，若与终端无关，则显示? 若为pts/0等，则表示由网络连接主机进程。
- CMD    //命令的名称和参数

## 9.2、ps -ef 可以查看到父进程的信息

```shell
ps -ef|grep mysql
```

## 9.3、进程树（目录树）

看父进程可以通过目录树来查看

```shell
pstree
-p # 显示父id (PPID)
-u # 显示用户组

pstree -pu

```

![](https://files.mdnice.com/user/34064/915527df-3b7d-45df-95ab-440ed0444969.png)

## 9.4、top命令

![](https://files.mdnice.com/user/34064/b211a66e-8f66-47f7-9281-1bc7f6356a79.png)

## 9.5、结束进程

```shell
kill pid # 终止进程
kill -9 pid # 强制终止进程
```

## 9.6、nohup 后台运行进程

```shell
nohup java -jar jenkins.war &
```

# 10、环境安装

三种方式：

- rpm

- 解压缩

- yum在线安装

# 11、防火墙

```
systemctl status firewalld 查看firewalld状态
systemctl
firewall-cmd
firewall-cmd --list-all
firewall-cmd --add-port=8080/tcp --premanent
firewall-cmd --reload
```

👉 阿里云服务器配置安全组

---

🎈🎈🎈

🌹 持续更文，关注我，你会发现一个踏实努力的宝藏前端😊，让我们一起学习，共同成长吧。

🎉 喜欢的小伙伴记得点赞关注收藏哟，回看不迷路 😉

🎁 欢迎大家评论交流, 蟹蟹😊
