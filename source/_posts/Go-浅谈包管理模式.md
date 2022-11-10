---
title: Go | 浅谈包管理模式
tags: Go
categories: Go
description: 何一门编程语言都离不开对各种工具包的使用，工具包的管理就显得异常重要了。Go 的包管理方式是逐渐演进的，本文介绍Go语言的两种包管理模式。
abbrlink: 3874691188
date: 2022-11-08 14:37:04
---

> 本篇收录至[Golang专栏](https://blog.i-xiao.space/categories/Go/)，持续更新，欢迎访问😊

任何一门编程语言都离不开对各种工具包的使用，工具包的管理就显得异常重要了。Go 的包管理方式是逐渐演进的，本文介绍Go语言的两种包管理模式。

# GOPATH模式引包（不推荐）

在 1.5 版本之前，所有的依赖包都是存放在 `GOPATH` 下，没有多版本控制。

go的编译器会在 `$GOPATH/src` 下面寻找对应的模块，`src` 下的每一个目录都可以对应一个模块，目录中的目录也可以是一个模块

下面展示如何在入口文件`main.go` 里引入非标准库`model`包中的变量

1. 目录层级如下

```bash
├───main
│       main.go
└───model
        utils.go
```

  - `main/main.go` 入口文件引入`utils`里面的`Name`变量

  - `model/utils.go` 文件声明 `package model`，并定义变量`var Name string = "xiao"` ，变量必须是大写，否则报错name not exported by package model

2. main.go 文件引model包

```go
package main

import (
	"fmt"
	// 引包
  // 省略GOPATH/src, Go编译的时候会自动在src目录下寻找
	"go_code/pointer/model"
)

func main() {
	fmt.Println(model.Name) // xiao
}
```

## 开启GO111MODULE后非module项目产生的问题

在`GO111MODULE=on`，并且已经设置`GOPATH`的条件下，写的代码在`$GOPATH/src`下，我想要使用另一个`package`里面的内容，并且这个package不是标准库，或者说不在`GOROOT`里(一般我们不会修改GOROOT中的内容)，编译会报错，如下👇👇

```go
package go_code/pointer/model is not in GOROOT
```

![](https://pic1.imgdb.cn/item/636a062a16f2c2beb1df781f.jpg)

### 解决方法一：

设置GO111MODULE=off

`go env -w GO111MODULE=off`

设置完之后， `go env`查看

然后重新编译即可

### 解决方法二

**使用`go mod`** ， 请看下文介绍👇

# GO MODULE 模式引包（推荐）

## go module 介绍

go modules 是 golang 1.11 新加的特性。

> - 模块是相关Go包的集合
>
> - modules是源代码交换和版本控制的单元
>
> go命令直接支持使用modules，包括记录和解析对其他模块的依赖性。modules替换旧的基于GOPATH的方法来指定在给定构建中使用哪些源文件。

GO111MODULE 有三个值：off, on和auto（默认值）。

1. **GO111MODULE=off**，go命令行将不会支持module功能，寻找依赖包的方式将会沿用旧版本那种通过vendor目录或者GOPATH模式来查找(也就是本文最开始介绍的方式)。

2. **GO111MODULE=on**，go命令行会使用modules，不会去GOPATH目录下查找所引用的包。

3. **GO111MODULE=auto**，默认值，go命令行将会根据当前目录来决定是否启用module功能。这种情况下可以分为两种情形：

    - 当前目录在`GOPATH/src`之外且该目录包含go.mod文件

    - 当前文件在包含go.mod文件的目录下面。

> 当modules功能启用时，依赖包的存放位置变更为`$GOPATH/pkg`，允许同一个package多个版本并存，且多个项目可以**共享缓存**的 `module`

![](https://pic1.imgdb.cn/item/636a063916f2c2beb1df997e.jpg)

利用`GO111MODULE`和`GOPROXY`，可以直接将Github上的第三方库直接下载到本地使用，不需要使用go get命令。执行 go run 运行时，GOMODULES包管理工具会自动帮我们下载github上面的包

## 使用 go mod 创建新项目

当开启`GO111MODULE`的时候，才可以使用`go mod`

### 1、初始化项目

```bash
mkdir test-mod
cd test-moe
go mod init maze-mod
```

**在项目根目录生成 `go.mod` 文件**

```go
module test-mod

go 1.17

require github.com/astaxie/beego v1.12.1

require (
	golang.org/x/net v0.0.0-20190620200207-3b0461eec859 // indirect
	golang.org/x/text v0.3.0 // indirect
)
```

> 注意：
> 1. 有`indirect`注释的代表**间接依赖**，没有的代表**直接依赖**，
>
> 2. 前面是**版本号+时间戳+hash**（如：`v0.0.0-20190620200207-3b0461eec859`）

1. `go.mod`文件一旦创建后，它的内容将会被`go toolchain`全面掌控。`go toolchain`会在各类命令执行时(比如go get、go build、go mod等)，修改维护`go.mod`文件。

2. `go.mod` 提供了module, require、replace和exclude 四个命令

    - module 语句指定包的名字（路径）

    - require 语句指定的依赖项模块

    - replace 语句可以替换依赖项模块

    - exclude 语句可以忽略依赖项模块

### 2、添加依赖

1. 新建`main.go`文件

2. 执行 `go run main.go`

    - 一般来说 `go mod` 模式下，运行 `go run` 会自动安装所有依赖，但是没有安装

    - 运行 `go get ./ ...` 可以自动查找并下载安装所有的包

    - 运行 `go get package@version` 安装指定版本的依赖包

### 3、查看依赖

- `go list -m all` 查看当前模块所依赖的包列表

- `go mod tidy` 从 `go.mod` 中移除不需要的依赖

### 4、`go.sum`文件

用来做包版本管理

`go.sum`文件与`go.mod`文件同级。`go.sum`文件是对导入的依赖包的特定版本的`hash`校验值，作用就是记录第一次下载的依赖版本号，防止有依赖版本升级带来的不兼容问题。所以，`go.mod`和`go.sum`文件都需要被加入版本管理中。

# 总结

1. `GOPATH模式` 是 go在 1.5 版本之前的包管理模式，不具备版本控制功能，且所有项目的依赖都放在 GOPATH 里面，管理比较混乱

2. `GO MODULE` 模式是go在1.11 版本推出的，使用git的管理方式，直接从GitHub上下载所需要的依赖，可能会存在一些安全性问题，同时国内需要设置`GOPROXY`代理服务器才可使用，相对来说好用一点。

包管理模式一直是各个开发语言所面临的棘手问题，比如`NPM`和`Yarn`，设计一种完美的包管理模式还需要不断探索实践。

![](https://pic1.imgdb.cn/item/6368fc4816f2c2beb15b5ba6.jpg)

我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端开发，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。数风流人物还看中国、看今朝、看你我。