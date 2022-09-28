---
title: 移动端touch拖动事件和click事件冲突问题解决
date: 2022-09-27 18:43:14
tags:
categories:
description: 移动端touch拖动事件和click事件冲突问题解决
---

> 通过一个悬浮球交互功能的案例来阐述问题，以及解决办法。


## 实现效果

类似微信里的悬浮窗效果，苹果手机的悬浮球功能效果

1. 可以点击拖动，然后吸附在窗口边缘
2. 点击悬浮球，可以跳转界面，或者更改悬浮球的形态


## 准备

1. 移动端使用[ `touch`事件类型](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent)：
- `touchstart`当用户在触摸平面上放置了一个触点时触发 （手指放到屏幕上）
- `touchmove`当用户在触摸平面上移动触点时触发 （手指在屏幕上滑动）
- `touchend`当一个触点被用户从触摸平面上移除（抬起手指）
- `touchcancel`终止触摸事件

**多点触控**

2. TouchEvent.**targetTouches** 只读

一个 TouchList 对象，是包含了如下触点的 Touch 对象：触摸起始于当前事件的目标 element 上，并且仍然没有离开触摸平面的触点。

视口处于第四象限，原点在左上角

```javascript
event.targetTouches.clientX // 触摸元素横坐标
event.targetTouches.clientY // 触摸元素纵坐标
```

3. TouchEvent.**touches** 只读

一 个 TouchList 对象，包含了所有当前接触触摸平面的触点的 Touch 对象，无论它们的起始于哪个 element 上，也无论它们状态是否发生了变化。

## 实现

通过设置悬浮球定位样式，拖动的时候计算坐标，然后动态的修改悬浮球的定位偏移量，结合`transtion`过渡效果，实现平滑的过渡

## 问题

当给元素添加了`touch`事件之后，`click`事件就不会出发了，那么怎么模拟点击效果呢？

### 分析

在不了解触摸事件响应机制的时候，你可能会从计算触摸目标元素的时长或者计算触摸起始位置来判定点击行为，但是这两种方式都不是最佳的，原因有以下几点：

1. 计算触摸时长比较麻烦
2. 判断移动距离不严谨，有可能拖动了一圈又回到初始位置
3. 结合计算触摸时长和触摸元素起始位置两种方式，逻辑比较复杂

下面看我是怎么做的：

首先应该了解触摸行为的事件响应机制：

- 如果有拖动行为，事件执行次序为：`touchstart`-> `touchmove`-> `touchend`
- 没有拖动行为，事件执行次序为：`touchstart`-> `touchend`

从上面的分析来看，我们可以从touchmove 入手，继续往下看👇

## 解决

1. 在`touchmove`事件中增加一个是否移动过的标记`isMoved: true`
2. 在`touchend`事件中判断`isMoved`是否为`true`，是`true`则按原有逻辑执行，是`false`则说明没有移动过，属于点击行为
3. 在`touchend`事件最后，重置`isMoved`为初始值`false`，这样每一个触摸操作都可以进入同样的逻辑，不用担心状态混乱

完美解决模拟点击行为

---


![](https://cdn.jsdelivr.net/gh/all-smile/nav@1.0.7/static/images/wind_girl.webp)


我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。主要致力于分享实用技术干货，希望可以给一小部分人一些微小帮助。

我排斥“新人迷茫，老人看戏”的现象，希望能和大家一起努力破局。营造一个良好的技术氛围，为了个人、为了我国的数字化转型、互联网物联网技术、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**