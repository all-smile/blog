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
在 `repo` 下创建 `README.md`文件，随便写点东西保存。然后，点击 `**settings**`选项卡，单机左侧 `** Pages**`进行设置，如下图：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2932776/1660704179385-c870ea1c-ab8e-458b-a50d-8126426823ad.png#clientId=uf4f225fb-d7e6-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=673&id=u0b5f5bfd&margin=%5Bobject%20Object%5D&name=image.png&originHeight=841&originWidth=1116&originalType=binary&ratio=1&rotation=0&showTitle=false&size=94547&status=done&style=none&taskId=ub7818fcc-d5b1-4899-9ed1-9ae1524aa2a&title=&width=892.8)
## 4、仓库文件目录
![8a86b6eafeb3b84631795e7e0d20414.png](https://cdn.nlark.com/yuque/0/2022/png/2932776/1660704809822-56b53b4f-a5bf-4948-a709-fa04bca57048.png#clientId=uf4f225fb-d7e6-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=147&id=pK850&margin=%5Bobject%20Object%5D&name=8a86b6eafeb3b84631795e7e0d20414.png&originHeight=184&originWidth=802&originalType=binary&ratio=1&rotation=0&showTitle=false&size=72939&status=done&style=none&taskId=u61562c3b-35d4-4bf8-b9a8-aafa3e13e10&title=&width=641.6)
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
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2932776/1659859671053-1b3cec07-9fb3-4b2b-b3b9-9c3170e83a86.png#clientId=u5aa68951-db50-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=158&id=u6bee0c57&margin=%5Bobject%20Object%5D&name=image.png&originHeight=198&originWidth=837&originalType=binary&ratio=1&rotation=0&showTitle=false&size=18542&status=done&style=none&taskId=u3e106c6d-9f86-4f7f-bef6-0996001ba66&title=&width=669.6)
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
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2932776/1659860149541-42025559-b1fa-4684-b606-2cf6721f35b4.png#clientId=u5aa68951-db50-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=50&id=ud53a1c36&margin=%5Bobject%20Object%5D&name=image.png&originHeight=63&originWidth=1442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=8016&status=done&style=none&taskId=ucac529b8-4560-41c7-a22c-fb7d6561095&title=&width=1153.6)
## 7、DNS检测
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2932776/1659859665670-f315be12-8b89-4d8f-9fa9-efbb900117cd.png#clientId=u5aa68951-db50-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=166&id=u40683a38&margin=%5Bobject%20Object%5D&name=image.png&originHeight=207&originWidth=858&originalType=binary&ratio=1&rotation=0&showTitle=false&size=19069&status=done&style=none&taskId=ubb029b67-dc71-43b2-8f46-f5fbfaeacdc&title=&width=686.4)
## 8、查看Pages
成功解析之后，还存在DNS缓存，一般还需要再等待一会（一般十分钟，或许更长时间）才能生效，如下图成功显示👇
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2932776/1659860369230-78c272ad-4a6b-4fd7-8606-9462b1dbc219.png#clientId=u5aa68951-db50-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=598&id=u90942f11&margin=%5Bobject%20Object%5D&name=image.png&originHeight=748&originWidth=1420&originalType=binary&ratio=1&rotation=0&showTitle=false&size=279220&status=done&style=none&taskId=ubde5e060-f529-4068-846e-7efd67f8cab&title=&width=1136)

