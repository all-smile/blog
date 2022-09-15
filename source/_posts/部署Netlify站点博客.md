---
title: 部署Netlify站点博客
tags:
  - 站点建设
categories:
  - 博客
description: 部署Netlify站点，域名更换，网速比对，以及一些问题记录
abbrlink: 818123119
date: 2022-09-13 19:27:22
---

## Netlify站点部署静态博客

今天尝试把站点部署在[Netlify](https://app.netlify.com/)上，因为部署在GitHub Pages上，国内访问速度太慢了，所以就尝试一下别的站点，部署成功之后发现速度还是不太行，后边继续找找原因

Netlify 部署的地址在[这里](https://m.i-xiao.space/)

下图展示`GitHub Pages`站点和`Netlify`站点的全国网速对比（数据来源[站长工具](https://tool.chinaz.com/)）

![](https://pic.imgdb.cn/item/63218cd316f2c2beb1b2619a.jpg)

总的来说，效果比`GitHub Pages`站点速度要快


## 问题记录

部署的时候，有几个问题，记录一下：

1. 部署时告警信息直接就阻塞了部署进程，导致部署失败，猜测是一些类似代码扫描工具使然，然后我只得先把造成告警的 `hexo-lazyload` 插件给剔除掉，然后就可以了（还不了解`Netlify`的工作原理，只是临时处理方案）

以下是`Netlify`部署的部分日志信息
```
2:13:23 PM: $ hexo generate
2:13:23 PM: INFO  Validating config
2:13:24 PM: INFO  Start processing
2:13:24 PM: INFO  neat the css: /opt/build/repo/source/_data/styles.styl [ 19.27% saved]
2:13:24 PM: INFO  neat the css: /opt/build/repo/source/_data/variables.styl [ NaN% saved]
2:13:34 PM: WARN  request remote img fail https://pic.imgdb.cn/item/63184ff316f2c2beb1e26ab9.png
2:48:42 PM: Build exceeded maximum allowed runtime
```

2. `Netlify`部署成功之后，由于资源路径不正确，导致`NexT`主题不生效。我原先设置了路径 `root: /blog/` ，然后就重新添加了一条记录，解析了一个新的二级域名用来访问博客，同时，这也给我带来了另外两个问题，如下：

3. 原先站点 `https://home.i-xiao.space/blog/` 上的不蒜子数据丢失了，重新初始化数据了。

> [“不蒜子”](http://ibruce.info/2015/04/04/busuanzi/)允许初始化首次数据，但是需要注册登录，目前“不蒜子”暂停了[注册](http://busuanzi.ibruce.info/)功能，那就先这样吧

4. 原`GitHub Pages`站点不能正常访问。 给`blog`仓库设置 `GitHub Pages`，绑定心得个人二级域名，在发布分支`gh-pages`下面生成一个CNAME文件，用来存放个人二级域名。存在的问题是：`hexo deploy` 是把`master`分支下生成的`public`目录下的静态文件推送并覆盖`gh-pages`分支下的文件，因为每次生成的`public`目录下没有`CNAME`文件，所以`CNAME`文件就被冲掉了，造成的结果就是，每次自动部署都会把之前绑定的个人域名“解绑”，导致网站不能正常访问

- 解决4：

方法一： 本地`master`分支，在`source`目录下新建一个`CNAME`文件，存放要绑定的域名，等到执行`hexo g`的时候，会把`source`目录下的文件“揍”到`public`下，然后推送到`gh-pages`分支上

`xxx.xml` 网站地图也可以用同样的方式放置到`source`目录

方法二： 理论上也可以在`generateAfter`事件中使用`node`处理


---


![](https://cdn.jsdelivr.net/gh/all-smile/nav@1.0.7/static/images/wind_girl.webp)


我是 [**甜点cc**](https://home.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。主要致力于分享实用技术干货，希望可以给一小部分人一些微小帮助。

我排斥“新人迷茫，老人看戏”的现象，希望能和大家一起努力破局。营造一个良好的技术氛围，为了个人、为了我国的数字化转型、互联网物联网技术、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**