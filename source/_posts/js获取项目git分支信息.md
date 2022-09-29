---
title: js获取项目git分支信息
tags: Git
categories: JavaScript
description: >-
  通过javascript获取项目分支信息，借助 execa 插件实现。另一种方式是通过脚本获取，借助git把版本信息存放在 .git/HEAD
  文件中的原理实现。
abbrlink: 3067788882
date: 2022-09-29 18:25:15
---

## 1、git bash 获取分支信息

```bash
# 获取当前分支名
git rev-parse --abbrev-ref HEAD
git branch --show-current

# 获取当前hash
git rev-parse HEAD
git rev-parse --short HEAD  # 短的
```
上面的代码是通过git命令获取的分支信息，怎么可以在项目代码里面获取分支信息呢？请看下文👇


## 2、JavaScript 通过 [execa](https://github.com/sindresorhus/execa) 插件获取项目分支信息

execa具备如下特点：

- Promise接口

- 从输出中删除最后的换行符，这样您就不必执行stdout.trim()
- 支持**跨平台**的shebang二进制文件
- 改进Windows支持。
- 更高的最大缓冲区。100mb而不是200kb。
- 按名称执行本地安装的二进制文件。
- 在父进程终止时清除派生的进程。
- 从 stdout和stderr获得交错输出，类似于在终端上打印的输出。(**异步**)
- 可以指定文件和参数作为一个单一的字符串没有外壳
- 更具描述性的错误。

1. 安装 execa
```bash
npm install execa -S
```
2. 简单使用 execa
```javascript
(async () => {
    const {stdout} = await execa('echo', ['unicorns']);
    console.log(stdout);
    //=> 'unicorns'
})();

// stdout 表示执行命令的输出结果
/*{
  command: 'echo unicorns',
  escapedCommand: 'echo unicorns',
  exitCode: 0,
  stdout: '"unicorns"',
  stderr: '',
  all: undefined,
  failed: false,
  timedOut: false,
  isCanceled: false,
  killed: false
}*/
```
execa还可以执行脚本命令，并输出结果，下面看一下如何在代码里面获取当前操作的分支👇

3. 实际项目中的代码
```javascript
function getGitBranch() {
  const res = execa.commandSync('git rev-parse --abbrev-ref HEAD');
  return res.stdout;
}
const curbranch = getGitBranch()
console.log('curbranch==', curbranch); // master

// 以下是res输出
curbranch== master
{
  command: 'git rev-parse --abbrev-ref HEAD',
  escapedCommand: 'git rev-parse --abbrev-ref HEAD',
  exitCode: 0,
  stdout: 'master', # 命令执行结果输出
  stderr: '',
  failed: false,
  timedOut: false,
  isCanceled: false,
  killed: false
}
```
下面说一下脚本获取方式

## 3、脚本获取

> 我在掘金 [git编写脚本 组合 commit-msg](https://juejin.cn/post/7113502858481254413) 一文中使用脚本获取分支信息，感兴趣可以看一下。

1. 可以看一下项目中 `.git/HEAD` 文件中的内容

    HEAD指向最新放入仓库的版本

```
ref: refs/heads/dev_0922
```

2. 编写脚本

```sh
#!/bin/bash

# 获取当前分支
line=$(head -n +1 .git/HEAD)
branch=${line##*/}
echo $branch # dev_0922
```

***

![](https://cdn.jsdelivr.net/gh/all-smile/nav@1.0.7/static/images/wind_girl.webp)


我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。主要致力于分享实用技术干货，希望可以给一小部分人一些微小帮助。

我排斥“新人迷茫，老人看戏”的现象，希望能和大家一起努力破局。营造一个良好的技术氛围，为了个人、为了我国的数字化转型、互联网物联网技术、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**
