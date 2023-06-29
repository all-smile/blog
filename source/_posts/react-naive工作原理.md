---
title: react-naive工作原理
tags: React Native
categories: React Native
description: react-naive工作原理是从react的工作原理衍生出来的，核心是Bridge桥接、vDom。
abbrlink: 3691909616
date: 2023-05-22 16:31:12
---

react-naive工作原理是从react的工作原理衍生出来的

## react的工作原理

在react中，virtual dom 就像一个中间层，介于开发者描述的视图与实际在页面上渲染的视图之间。为了在浏览器上渲染出可交互的用户界面，开发者必须操作浏览器的Dom，这个操作代价昂贵，过度操作dom会给性能带来影响。React 维护了一个内存版本的 DOM，通过计算得出必要的最小操作并重新渲染。如下图：

![](https://pic1.imgdb.cn/item/646b28dfe03e90d874c5b31b.jpg)

执行 `vdom` 的计算（`dom diff`），减少浏览器DOM的重复渲染
对于 Web 环境的react而言，大多数开发者认为 `virtual dom` 的出现主要是为了**优化性能**。vdom确实能提升性能，但它的主要潜力在于提供了强大的**抽象能力**。在开发者的代码与实际的渲染之间加入一个**抽象层**，这带来了很多**可能性**。稍微想象一下，如果react能够渲染到浏览器以外的其他平台呢？毕竟，react已经“理解”了你的应用应该如何展现。

## React Native 的工作原理

如下图，这就是 `React Native` 的工作原理。 `react native` 调用`Objective-C`的API去渲染iOS组件，调用`Java`接口去渲染Android组件，而不是渲染到浏览器的DOM上，这使得`react native` 不同于那些基于web视图的跨平台应用开发方案（各种小程序 uniapp\taro , 适配器转化）。

`react可以渲染到多个平台`
![](https://pic1.imgdb.cn/item/646b28ebe03e90d874c5be4f.jpg)

`Bridge`"**桥接**"使这一切成为可能，它使得react可以调用宿主平台开放的UI组件。react组件通过render方法返回了描述界面的标记代码。

1. web平台: react最终将标记代码解析成浏览器的dom

2. react native中：标记代码会被解析成特定平台的组件
   1. 如`<View>`组件将会表现为iOS平台的`UIView`

`react native` 目前同时支持iOS和Android两种平台。由于virtual DOM提供了抽象层，`react native`也可以支持其他平台，只需要提供“**桥接**”即可。

## react 和 react native 的不同点

### 框架作用的平台不同

`RN`是由`React`衍生出来的，两种框架都是用`JSX`开发语法，但是`RN`是用来开发真正原生渲染的iOS和Andriod移动应用的JS框架，而React是将浏览器作为渲染平台。

![](https://pic1.imgdb.cn/item/646b2904e03e90d874c5ec24.jpg)

### 工作原理不同

上面总结的工作原理

### 渲染周期

react 组件挂载过程　－＞　重新渲染过程。

1. `React`的渲染周期开始于react组件挂载到DOM之后，接着React进入渲染周期并根据需要渲染组件。在渲染阶段，**React将开发者在return中返回的HTML标记直接按需渲染到页面上**。

2. `React Native`生命周期与React基本相同，在渲染上因为`React Native`**依赖于桥接**，并**不在UI主线程运行**，它可以在不影响用户体验的前提下执行这些异步调用。

### 创建组件

当编写Web环境的React的时候，视图最终需要渲染成普通的HTML元素；

而在React Native中，所有元素都会被平台指定的React组件替换，例如在iOS中，`<View>`组件被渲染成`UIView`，而在Android平台，会被渲染成`View`。

### 原生的样式

在Web中，使用CSS样式为React组件添加样式已经是开发过程中不可获取的一部分了。React通常不影响我们编写CSS的方式，并且它确实让样式的动态创建更加容易（通过state和props），除此之外，React基本上不关心我们如何处理样式的。
非Web平台上有大量的方法来处理布局和样式.

我们使用`React Native`时，只需要用一种**标准的方法**来处理样式，React和宿主平台之间的桥接包含了一个缩减版CSS子集的实现，这个CSS子集主要通过**flexbox**进行布局，做到了尽量简化，而不是去实现所有的CSS规则。有别于Web平台，CSS的支持程度因浏览器而不同，React Native则做到了样式规则的一致。

### 宿主平台接口

数据存储、地理服务、操控硬件设备

---

我是 [**甜点cc**](https://blog.i-xiao.space/)☭

公众号：【看见另一种可能】