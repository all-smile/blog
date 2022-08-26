---
title: 认识Chrome扩展插件
date: 2022-08-26 15:54:12
tags: [前端, Chrome插件]
categories: [前端]
description: 本文从插件的基本概念、组成、运行机制、特性功能以及插件的使用等方面介绍chrome 扩展插件，旨在让读者有一个清晰的认识，激发探索、开发插件的热情
---
---
## 1、前言

现如今的时代，绝大多数人都要跟浏览器打交道的，说到浏览器那肯定是`Chrome`浏览器一家独大，具体数据请看👇

知名流量监测机构 [Statcounter](https://statcounter.com/) 公布了 7 月份全球桌面浏览器市场份额，主要数据如下：

|浏览器|市场份额|月涨跌份额|
|---|---|---|
|Chrome|66.19%| -0.74%|
|Edge|10.84%|+0.2%|
|Safari|8.94%| +0.01%|
|Firefox|8.08%| +0.28%|
|Opera|3.06%| +0.08%|
|IE|0.75%| |

**浏览器扩展插件的用途**

- 生产力工具（和浏览器进行交互：标签、书签、下载、代理、cookie等）

- 网页内容丰富（改变浏览器外观、桌面通知、右键菜单、定制新标签页）

- 信息聚合（更像是一个*快应用*，类似小程序）

- 乐趣和游戏（小恐龙（`chrome://dino/`）游戏，想必都玩过）

总之扩展程序让浏览器的功能更加强大，更加贴合用户使用。不管是不是软件开发人员，或多或少都会使用到浏览器扩展插件，常见的比如：书签、网页翻译、广告屏蔽......

学习Chrome扩展插件势在必行🏃‍♂️🐱‍🏍

- Chrome extensions [文档](https://developer.chrome.com/docs/extensions/)

- 插件的架构可以参考[这里](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/)

- Chrome扩展程序应用商店[入口](https://chrome.google.com/webstore/category/extensions)

- 管理使用chrome扩展。访问 url: `chrome://extensions`，打开开发者模式

扩展程序是基于 Web 技术（如 HTML、CSS 和 JavaScript）构建的软件程序，使用户能够自定义 Chrome 浏览体验。（前端开发人员技能范围之内😁😁）

本文从应用着手，通过讲解扩展插件的特性来启发读者对其进一步探索。

## 2、Chrome extensions 和 Chrome Plugin的区别

- Chrome Extension（Chrome扩展插件）仅仅是用来增强浏览器网页的功能，它是利用浏览器提供的已有功能和和各种API，进行功能组合，从而改善浏览器体验，停留在**浏览器层面**；

- Chrome Plugin（Chrome插件）不仅能增强网页的功能，同时能够扩展浏览器本身的功能；当浏览器提供的功能已经无法满足你的需求，就需要你通过C/C++这样的编译语言来扩展浏览器的功能，例如我们常用的Flash 插件，Chrome Plugin工作在**内核层面**。

## 3、扩展如何工作

- 扩展是基于 HTML、JavaScript 和 CSS 等 Web 技术构建的。它们在单独的沙盒执行环境中运行，并与 Chrome 浏览器交互。

- 扩展允许您通过使用 API 修改浏览器行为和访问 Web 内容来“扩展”浏览器。扩展通过最终用户 UI 和开发人员 API 进行操作：

- 扩展用户界面 这为用户提供了一种一致的方式来管理他们的扩展。

- [扩展 API](https://developer.chrome.com/docs/extensions/reference/)允许扩展代码访问浏览器本身的功能：激活选项卡、修改网络请求等。

要创建扩展，您需要组合一些资源清单: `manifest.json`、 `JavaScript`、 `HTML` 和 `CSS` 文件、图片等。

## 4、Chrome扩展文件

Chrome扩展文件以.crx为后缀名，.crx实际上是一个压缩文件，使用解压文件打开这个文件就可以看到其中的文件目录

下图是 `Axure` 扩展插件原文件：

![](https://files.mdnice.com/user/34064/ca2c331a-28cf-4cb9-bfcb-10d11f6fff6a.png)

因此可以认为，我们实际上就是写一个Web应用，然后将按照Chrome的规定将一个**快捷方式**放在Chrome工具栏上。如下图：

![](https://files.mdnice.com/user/34064/ec58ffac-c63b-46a1-b690-42518f1c2fa1.png)

上图中左边地址栏内部的按钮是page action（Chrome插件，直接内置在Chrome里的），右边地址栏外部的是 browser action（Chrome 扩展插件）

## 5、扩展插件使用

对于开发和测试，您可以使用扩展开发者模式将这些“解压”加载到 Chrome 中，或者直接拖动`crx`文件到管理扩展插件页面。如果扩展感到满意，也可以打包并分享给小伙伴使用。

![](https://files.mdnice.com/user/34064/6339f49c-6dae-4f62-b258-92d082173444.png)

## 6、popup弹出窗口

- `popup.html`可以在里面放置任何`html`元素，它的宽度是自适应的。当然，这个弹出窗口不会被Chrome拦截

- popup 无法通过程序打开，只能由用户点击打开。点击 popup 之外的区域会导致 popup 收起。

下图是 `FeHelper` 扩展插件的弹出窗👇

![](https://files.mdnice.com/user/34064/14200a5e-9f68-4d3b-acb5-ab07a13fbe30.png)

## 7、Background Pages后台页面

![](https://files.mdnice.com/user/34064/4bc20695-7737-4bc3-8b56-791933620bf6.png)

## 8、Chrome扩展插件运行的核心机制

Chrome扩展插件中比较核心的几个概念：`Extension Page`、`background.js`、`content_script.js`

下图展示他们之间的关系，以及如何通信

![](https://files.mdnice.com/user/34064/7ddafef3-f22d-4269-b637-e253a38b3c2d.png)
（图片来源网络，侵删）

运行时的三个进程：

- 扩展进程（Extension Process）

- 页面渲染进程（Page Render Process）

- 浏览器进程（Browser Process）

1. **扩展进程**中运行`Extension Page`，主要包括`backgrount.html`和`popup.html`,

- ` backgrount.html`中没有任何内容，是通过`background.js`创建生成，当浏览器打开时，会自动加载插件的background.js文件，它独立于网页并且一直运行在后台，它主要通过调用浏览器提供的API和浏览器进行交互

- `popup.html`有内容的，跟我们普通的web页面一样，由`html`、`css`、`Javascript`组成，它是按需加载的，需要用户去点击地址栏的按钮去触发，才能弹出页面。

2. **渲染进程**主要运行`Web Page`,当打开页面时，会将`content_script.js`加载并注入到该网页的环境中，它和网页中引入的`Javascript`一样，可以操作该网页的`DOM Tree`，*改变页面的展示效果*

3. **浏览器进程**在这里更多起到桥梁作用，作为中转可以实现`Extension Page`和`content_script.js`之间的消息通信。

## 最后

本文介绍的是 chrome 扩展基础知识，相信看完以上之后，你会对 Chrome 扩展插件有了一个比较清晰的认识。相信chrome扩展会大有作为，会不会迫不急待的要体验一下呢🤔，我根据Chrome插件开发官网示例写的一个小扩展插件，点击[这里](https://github.com/all-smile/myFirstExtension)查看项目。

---

🌹 持续更文，关注我，你会发现一个踏实努力的宝藏前端😊，让我们一起学习，共同成长吧。

🎉 喜欢的小伙伴记得点赞关注收藏哟，回看不迷路 😉

🎁 欢迎大家评论交流, 蟹蟹😊