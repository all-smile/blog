---
title: 认识HTTP缓存
tags:
  - HTTP
categories:
  - 前端
description: http缓存在开发以及面试中经常会遇到，掌握http缓存技术对产品性能提升也有很大帮助。本片讲解缓存的技术、种类和机制，快在项目中运用起来吧。
abbrlink: 2358217424
date: 2022-08-26 22:42:26
---

> 通常针对静态资源。内存缓存/磁盘缓存

## 1、原理：

在首次请求后，保存一份请求资源的响应副本，当用户再次发起相同请求后，如果判断缓存命中，则拦截请求，将之前存储的相应副本返回给用户，从而避免重新向服务器发起资源请求。

## 2、缓存的技术种类：

代理缓存，浏览器缓存，网关缓存，负载均衡器，内容分发网络

它们大致可以分为两类： 共享缓存，私有缓存

- *共享缓存*：缓存的内容可以被多个用户使用。如公司内部架设的内部Web代理

- *私有缓存*：只能单独被用户使用的缓存。如浏览器缓存

## 3、禁止缓存

发送如下响应头可以关闭缓存。此外，可以参考`Expires`和`Pragma`消息头。

```javascript
Cache-Control: no-store
```

## 4、http缓存可分为强制缓存和协商缓存

- 强制缓存不用判断缓存是否过期，可以直接使用。

- 协商缓存每次都要询问一下服务器，看一下内容有没有更新，如果没有更新就使用缓存中的资源，如果更新了就继续请求

响应头设置：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eccface9efa421b8430e62444edf4b7~tplv-k3u1fbpfcp-zoom-1.image)


### 4.1、cache-control（http1.1）
`cache-control`属性值：

- no-cache  强制进行协商缓存

- no-store 不缓存

- max-age   表示缓存的过期时长
```
'cache-control': 'max-age=5' // 滑动时间，单位是秒
```

- private, public： 用以明确响应资源是否可以被代理服务器缓存。

- private  只能被浏览器缓存

- public  响应资源既可以被浏览器私有缓存，又可以被代理服务器公共缓存

```
cache-control: public, max-age=10;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e506a323ebc49449aa316ff302b2116~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab505a1c9bde44c2a1d3d9ae05bc2266~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/483abb75d50347a081dd4cb7562d6817~tplv-k3u1fbpfcp-zoom-1.image)

```
last-modified: ''
if-modified-since:
cache-control: no-cache
```
**原理**:是根据资源最后的*修改时间*来判断是否需要读取缓存

> 根据时间判断有局限性，比方说只改变文件命名，也会引起资源修改时间发生变化，但是对资源本身并没有改动

### 4.2、✨补充的方案是**ETag**（根据文件资源生成指纹）

- 安装
```bash
npm i etag
```

- 使用

```js
const etag = require('etag')

const data = fs.readFilSeync('./img/04.jpg')
const etagContent = etag(data)

const ifNoneMatch = req.headers['if-none-match']

if (ifNoneMatch === etagContent) {
  res.statusCode = 304
  res.end()
  return // 直接返回，不操作服务器资源，减少带宽
}

res.setHeader('etag', etagContent)
res.setHeader('Cache-Control','no-cache')
res.end(data)
```

- If-None-Match

- **强验证Etag**，资源细微的改动都会引起指纹的变化

- **弱验证ETag**， 相对灵活的过滤资源的某些变化

## 5、强缓存

### 介绍：

不会向服务器发送请求，直接从缓存中读取资源，在chrome控制台的Network选项中可以看到该请求返回200的状态码，并且Size显示`from disk cache`或`from memory cache`。

### 设置：

强缓存可以通过设置两种 `HTTP Header` 实现，分别是：`Expires` 和 `Cache-Control`。

> Expires 是http1.0的产物，Cache-Control是http1.1的产物，两者同时存在的话，Cache-Control优先级高于Expires；

## 6、协商缓存

### 介绍：

协商缓存就是强制缓存失效后，浏览器*携带缓存标识*向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程，主要有以下两种情况：

- 协商缓存生效，返回`304`和`Not Modified`

- 协商缓存失效，返回`200`和`请求结果`

### 设置：

协商缓存可以通过设置两种 HTTP Header 实现, 分别是：`Last-Modified` 和 `ETag` 。

## 7、缓存机制🎉

1. 强制缓存优先于协商缓存进行，若强制缓存(Expires和Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存(`Last-Modified / If-Modified-Since和Etag / If-None-Match`)

2. 协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，返回200，重新返回资源和缓存标识，再存入浏览器缓存中；生效则返回304，继续使用缓存。

## 8、缓存策略树🎉

![缓存策略树，很早很早之前画的🤣，现在看看也是醉了😂](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b20c21694e940d5acf2b343148bfbbf~tplv-k3u1fbpfcp-zoom-1.image)
<p align=center>缓存策略树，很早很早之前画的🤣，现在看看也是醉了😂</p>

![该图来源网络，侵删](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc8e06075df24102b9989fc1ff0eb797~tplv-k3u1fbpfcp-zoom-1.image)
<p align=center>该图来源网络，侵删</p>

更多看[这里](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)

---

🌹 持续更文，关注我，你会发现一个踏实努力的宝藏前端😊，让我们一起学习，共同成长吧。

🎉 喜欢的小伙伴记得点赞关注收藏哟，回看不迷路 😉

🎁 欢迎大家评论交流, 蟹蟹😊
