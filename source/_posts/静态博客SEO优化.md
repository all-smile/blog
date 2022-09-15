---
title: 静态博客SEO优化
abbrlink: 2912186581
date: 2022-09-15 13:26:00
tags:
---

## Baidu Webmaster Tools

首先注册登录[百度搜索资源平台](https://ziyuan.baidu.com/site/#/)，然后执行下面的步骤：

1. 添加网站（输入网站）
2. 设置站点属性
3. 验证网站，以下三种方式，任选其一即可
   - 文件验证 （下载文件，放到网站根目录，可访问）
   - `HTML`标签验证（网站增加 `meta` 标签）
   - `CNAME`验证 （增加域名解析记录）

我使用的是`HTML`标签验证，`Hexo` 提供的有`API`， 可以往页面里注入 `HTML`

```js
// baidu seo
hexo.extend.injector.register(
  'head_begin',
  '<meta name="baidu-site-verification" content="code-xyJs6My2et" />',
  'default'
);
```

更多`Hexo API`请查看[这里](https://hexo.io/api/injector)


## Bing Webmaster Tools

- [必应工具](https://www.bing.com/webmasters)，添加网站

![](https://pic.imgdb.cn/item/6322ba7916f2c2beb1bed61e.jpg)

- 提交网站地图

![](https://pic.imgdb.cn/item/6322bc9716f2c2beb1c1a6db.jpg)

步骤同百度类似，这里就不介绍了。

`NexT`官方`SEO`教程请来[这里](https://theme-next.js.org/docs/theme-settings/seo.html)

---


![](https://cdn.jsdelivr.net/gh/all-smile/nav@1.0.7/static/images/wind_girl.webp)


我是 [**甜点cc**](https://home.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。主要致力于分享实用技术干货，希望可以给一小部分人一些微小帮助。

我排斥“新人迷茫，老人看戏”的现象，希望能和大家一起努力破局。营造一个良好的技术氛围，为了个人、为了我国的数字化转型、互联网物联网技术、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**