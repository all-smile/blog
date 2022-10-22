---
title: 'CSS -webkit-box-orient: vertical 编译报错之autoprefixer问题'
date: 2022-10-22 13:54:30
tags:
categories:
description: autoprefixer 插件问题
---

由于各大浏览器的兼容问题，`autoprefixer` 插件 就可以帮我们自动补齐前缀。它和 `less`、`scss` 这样的预处理器不同，它属于**后置处理器**。所谓 预处理器 是指在打包之前进行处理，所谓 后置处理器 是在代码打包生成后再进行处理。

`autoprefixer` 其实是 `postCss` 的一个插件，`postCss` 本身是一个用 `JavaScript` 工具和插件转换 `CSS` 代码的工具，它提供了许多强大的处理 `CSS` 的功能

## Autoprefixer css补全前缀功能

- `Autoprefixer`处理前`css`代码

```css
display: flex;
```

- `Autoprefixer`处理后`css`代码

```css
display: -webkit-box;
display: -ms-flexbox;
display: flex;
```

## 文本超出显示省略号

布局样式中，经常会遇到超出显示省略号的需求，有的显示一行，有的显示两行、三行，通常采用如下样式：

1. 单行

```css
// 文本溢出省略号
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

2. 多行

这里使用的是`less`混合传参的方式
```css
.clamp_fun(@line: 1) {
  overflow: hidden;
  text-overflow: ellipsis;
  /* autoprefixer: off*/
  -webkit-box-orient: vertical;
  /* autoprefixer: on*/
  display: -webkit-box;
  -webkit-line-clamp: @line;
}
.clamp_1 {
  .clamp_fun(1);
}
.clamp_2 {
  .clamp_fun(2);
}
.clamp_3 {
  .clamp_fun(3);
}
```

- `display: -webkit-box;` 将对象作为弹性伸缩盒子模型显示。
- `-webkit-line-clamp: 2;` 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
- `-webkit-box-orient: vertical;` 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）

## 编译报错问题解决

上面通过注释 `autoprefixer off on`，编译中报错

![](https://pic1.imgdb.cn/item/6353957116f2c2beb17617b7.jpg)

这种写法已经过时了，采用下面的写法：

```css
/* autoprefixer: ignore next */
-webkit-box-orient: vertical;
```

---

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**