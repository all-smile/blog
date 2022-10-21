---
title: Go | 讲解GOROOT、GOPATH、GOBIN
date: 2022-10-21 14:59:59
tags: Go
categories: Go
description: 我是甜点cc，开始讲解Go专栏的学习记录分享。本篇介绍GOROOT、GOPATH、GOBIN的区别，以及go开发的准备工作。
---

## 前言

Go（又称 Golang）是 Google 开发的一种静态强类型、编译型、并发型，并具有垃圾回收功能的编程语言。Go 被誉为是未来的服务器端编程语言。

Go是一门全新的静态类型开发语言，具有自动垃圾回收，丰富的内置类型,函数多返回值，错误处理，匿名函数,并发编程，反射等特性。

**特色：**
- 简洁、快速、安全

- 并行、有趣、开源

- 内存管理、数组安全、编译迅速

## GOROOT
其实就是`golang` 的安装路径

当你安装好`golang`之后其实这个就已经有了

## GOPATH
`go`命令依赖一个重要的环境变量：`GOPATH`

`GOPATH`允许多个目录，当有多个目录时，请注意分隔符，多个目录的时候`Windows`是分号`;`

当有多个`GOPATH`时默认将`go get`获取的包存放在第一个目录下

## GOBIN

`go install`编译存放路径。不允许设置多个路径。可以为空。为空时则遵循“约定优于配置”原则，可执行文件放在各自`GOPATH`目录的`bin`文件夹中（前提是：package main的main函数文件不能直接放到`GOPATH`的`src`下面。

## GOPATH目录约定有三个子目录

1. **src：**存放源代码(比如：.go .c .h .s等)   按照golang默认约定，`go run`，`go install`等命令的当前工作路径（即在此路径下执行上述命令）。

2. **pkg：**编译时生成的中间文件（比如：.a）　 `golang`编译包时

3. **bin：**编译后生成的可执行文件（为了方便，可以把此目录加入到 $PATH 变量中，如果有多个gopath，那么使用${GOPATH//://bin:}/bin添加所有的bin目录）

## 目录结构规划

`GOPATH`下的`src`目录就是接下来开发程序的主要目录，所有的源码都是放在这个目录下面，那么一般我们的做法就是一个目录一个项目，

例如:

`$GOPATH/src/myproject` 表示`myproject`这个应用包或者可执行应用，这个根据package是main还是其他来决定，main的话就是可执行应用，其他的话就是应用包，这个会在后续详细介绍package。

## go get 和go install

`go get`会做两件事：
1. 从远程下载需要用到的包

2. 执行go install

`go install` 会生成可执行文件直接放到`bin`目录下，当然这是有前提的

你编译的是可执行文件，如果是一个普通的包，会被编译生成到`pkg`目录下该文件是.a结尾

## go 整体开发目录

**不使用 `go mod` 的方式，项目全在 `$GOPATH/src` 下**

```js
go_project     // go_project为GOPATH目录
  -- bin
     -- myApp1  // 编译生成
     -- myApp2  // 编译生成
     -- myApp3  // 编译生成
  -- pkg
  -- src
     -- myApp1     // project1
        -- models
        -- controllers
        -- others
        -- main.go
     -- myApp2     // project2
        -- models
        -- controllers
        -- others
        -- main.go
     -- myApp3     // project3
        -- models
        -- controllers
        -- others
        -- main.go
```

---

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**