---
title: GitHub Pages 站点建设
date: 2022-08-17 10:24:33
tags: [GitHub]
categories: [GitHub]
description: 利用 GitHub Pages 搭建个人站点、博客。
---
## 1、简介
- GitHub Pages 是通过 GitHub 托管和发布的公共网页，将纯文本转换为静态博客网站。

- 您可以使用 GitHub Pages 来展示一些开源项目、博客甚或分享您的简历，有内存限制，可以绑定个人域名。

- 启动和运行的最快方法是使用 [Jekyll](https://jekyllcn.com/) 主题选择器加载预置主题。 然后，您可以修改 GitHub Pages 的内容和样式。👉 [文档](https://docs.github.com/cn/pages/getting-started-with-github-pages/about-github-pages)

## 2、创建仓库
仓库名： `<username>.github.io`
`username` 是GitHub的用户名
## 3、创建站点
在 `repo` 下创建 `index.md`文件，随便写点东西保存。然后，点击 `settings`选项卡，单机左侧 `Pages`进行设置，如下图：

![](https://files.mdnice.com/user/34064/42531bfd-6a95-4b93-aef1-2132eb036186.png)

🔊 此时站点已经建成，可以访问 `https://<username>.github.io/` 查看，如果已经有个人域名了，也可以绑定个人域名，继续往下看👇

## 4、仓库文件目录

![](https://files.mdnice.com/user/34064/8f9a125b-767d-45af-b91f-e998f10a2267.png)

## 5、绑定域名
我个人购买的一级域名是 i-xiao ，域名后缀是 space，专门给GitHub Pages 增加一个CNAME记录（blog），解析二级域名，绑定 <username>github.io 域名。

### 5.1、域名相关知识

- www：主机名，i-xiao : 域名主体(一级域名)，.space : 域名后缀
注册一级域名的时候是需要付费的
- 二级域名，是依附一级域名的存在而存在的，也就是说要是顶级域名消失了，二级域名也也会不复存在。反而来说，二级域名的网站不做了，主域名网站是不受影响的。
- 一级域名、二级域名区别：
DNS收录一级域名更快；还有就是解析速度，下一跳路由就不说了，找到目的主机之后，二级域名层级更深，需要多一层计算（其实这是我瞎写的🤣，猜测应该跟 nginx location匹配类似）

### 5.2、GitHub上配置自定义域名

进入 <username>github.io 仓库，进入设置页面，点击左边 Pages 选项卡，进行下面的配置。

![](https://files.mdnice.com/user/34064/7b148b05-ea65-410c-8bb7-ded42d8f2538.png)

## 6、配置域名映射
**各记录类型使用目的**

| 记录类型 | 使用目的 |
| --- | --- |
| [A 记录](https://docs.dnspod.cn/dns/5f2d4664e8320f1a740d9ce5/) | 将域名指向一个 IP 地址（外网地址）。 |
| [CNAME 记录](https://docs.dnspod.cn/dns/5f2d4664e8320f1a740d9cf9/) | 将域名指向另一个域名，再由另一个域名提供 IP 地址（外网地址）。 |
| [MX 记录](https://docs.dnspod.cn/dns/5f2d4665e8320f1a740d9cff/) | 设置邮箱，让邮箱能收到邮件。 |
| [NS 记录](https://docs.dnspod.cn/dns/5f2d4665e8320f1a740d9d11/) | 将子域名交给其他 DNS 服务商解析。 |
| [AAAA 记录](https://docs.dnspod.cn/dns/5f2d4665e8320f1a740d9d0b/) | 将域名指向一个 IPv6 地址。 |
| [SRV 记录](https://docs.dnspod.cn/dns/5f2d4665e8320f1a740d9d17/) | 用来标识某台服务器使用了某个服务，常见于微软系统的目录管理。 |
| [TXT 记录](https://docs.dnspod.cn/dns/5f2d4665e8320f1a740d9d05/) | 对域名进行标识和说明，绝大多数的 TXT 记录是用来做 SPF 记录（反垃圾邮件）。 |
| [隐、显性 URL 记录](https://docs.dnspod.cn/dns/5f2d4664e8320f1a740d9ced/) | 将一个域名指向另外一个已经存在的站点。 |

**如下图**

![](https://files.mdnice.com/user/34064/18e6f450-c21d-4db6-9e42-ba21b06b2134.png)

## 7、DNS检测

![](https://files.mdnice.com/user/34064/32c6f3d8-902c-4de9-a544-24f38c98836c.png)

## 8、查看Pages
成功解析之后，还存在DNS缓存，一般还需要再等待一会（一般十分钟，或许更长时间）才能生效，如下图成功显示👇

![](https://files.mdnice.com/user/34064/fbe4c739-db6f-4870-b17f-20207247bd54.png)

## 最后
站点绑定的域名已经更换，访问请到👉 [这里](https://home.i-xiao.space/)

---
🎈🎈🎈

🌹 持续更文，关注我，你会发现一个踏实努力的宝藏前端😊，让我们一起学习，共同成长吧。

🎉 喜欢的小伙伴记得点赞关注收藏哟，回看不迷路 😉

🎁 欢迎大家评论交流, 蟹蟹😊



