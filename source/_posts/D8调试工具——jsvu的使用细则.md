---
title: D8调试工具——jsvu的使用细则
tags:
  - V8
categories:
  - 前端
description: D8 是一个非常有用的调试工具，可以使用 d8 来查看 V8 在编译执行 JavaScript 过程中的各种中间数据，本文通过jsvu安装D8。
abbrlink: 1327063303
date: 2022-08-17 10:09:09
---

>[`d8`](https://source.chromium.org/chromium/chromium/src/+/main:v8/src/d8/) is V8’s own developer shell.
>
>D8 是一个非常有用的调试工具，你可以把它看成是 debug for V8 的缩写。我们可以使用 d8 来查看 V8 在执行 JavaScript 过程中的各种中间数据，比如作用域、AST、字节码、优化的二进制代码、垃圾回收的状态，还可以使用 d8 提供的私有 API 查看一些内部信息。

## 前言

[jsvu](https://github.com/GoogleChromeLabs/jsvu) 是 JavaScript 引擎版本管理工具

以下是在Windows10下的操作，建议在 CMD 窗口里面操作。

## 1、安装

前提：node V14+

```
npm install -g jsvu
```

运行 jsvu，交互式命令行选择需要安装的平台和引擎

>安装指定版本的引擎可以参考下面的命令
>
>`jsvu --os=win64 --engines=v8,v8-debug`

![](https://pic.imgdb.cn/item/63184e1c16f2c2beb1dfabd6.png)

执行 jsvu安装引擎，可在 *%USERPROFILE%* */.jsvu* 目录下查看安装的引擎

![](https://pic.imgdb.cn/item/63184e2b16f2c2beb1dfbc33.png)

安装 v8-debug

```bash
jsvu --os=win64 --engines=v8-debug
```

![](https://pic.imgdb.cn/item/63184e3d16f2c2beb1dfd36c.png)

### 操作系统支持的引擎

| **JavaScript engine**                                                                | **Binary name**       | **mac64** | **mac64arm** | **win32** | **win64** | **linux32** | **linux64** |
| ------------------------------------------------------------------------------------ | --------------------- | --------- | ------------ | --------- | --------- | ----------- | ----------- |
| [Chakra](https://github.com/Microsoft/ChakraCore/issues/2278#issuecomment-277301120) | chakra or ch          | ✅         | ❌            | ✅         | ✅         | ❌           | ✅           |
| [GraalJS](https://github.com/oracle/graaljs)                                         | graaljs               | ✅         | ❌            | ❌         | ✅         | ❌           | ✅           |
| [Hermes](https://github.com/facebook/hermes/issues/17)                               | hermes & hermes-repl  | ✅         | ❌            | ❌         | ✅         | ❌           | ✅           |
| [JavaScriptCore](https://bugs.webkit.org/show_bug.cgi?id=179945)                     | javascriptcore or jsc | ✅         | ✅            | ❌         | ✅ *      | ❌           | ✅           |
| [QuickJS](https://github.com/GoogleChromeLabs/jsvu/issues/73)                        | quickjs               | ❌         | ❌            | ✅         | ✅         | ✅           | ✅           |
| [SpiderMonkey](https://bugzilla.mozilla.org/show_bug.cgi?id=1336514)                 | spidermonkey or sm    | ✅         | ✅            | ✅         | ✅         | ✅           | ✅           |
| [V8](https://bugs.chromium.org/p/chromium/issues/detail?id=936383)                   | v8                    | ✅         | ✅            | ✅         | ✅         | ✅           | ✅           |
| [V8 debug](https://bugs.chromium.org/p/chromium/issues/detail?id=936383)             | v8-debug              | ✅         | ✅            | ✅         | ✅         | ✅           | ✅           |
| [XS](https://github.com/Moddable-OpenSource/moddable-xst)                            | xs                    | ✅ (32)    | ❌            | ✅         | ✅ (32)    | ✅           | ✅           |

### 查看jsvu版本

```
jsvu -h

📦 jsvu v1.13.3 — the JavaScript engine Version Updater 📦
[<engine>@<version>]
[--os={mac64,mac64arm,linux32,linux64,win32,win64,default}]
[--engines={chakra,graaljs,hermes,javascriptcore,quickjs,spidermonkey,v8,v8-debug,xs},…]

Complete documentation is online:
https://github.com/GoogleChromeLabs/jsvu#readme
```

## 2、安装 [eshost-cli](https://github.com/bterlson/eshost-cli)（这个不安装也不影响使用）

管理js引擎，可以调用多个引擎执行js代码，更加方便调试不同引擎下的代码

```
npm install -g eshost-cli
```

### Windows 下配置

```
eshost --add <host name> <host type> <host path> --args <optional arguments>
```

根据需要使用的引擎，自行配置，如下

```
eshost --add "Chakra" ch "%USERPROFILE%.jsvu\chakra.cmd"
eshost --add "GraalJS" graaljs "%USERPROFILE%.jsvu\graaljs.cmd"
eshost --add "JavaScriptCore" jsc "%USERPROFILE%.jsvu\javascriptcore.cmd"
eshost --add "SpiderMonkey" jsshell "%USERPROFILE%.jsvu\spidermonkey.cmd"
eshost --add "V8 --harmony" d8 "%USERPROFILE%.jsvu\v8.cmd" --args "--harmony"
eshost --add "V8" d8 "%USERPROFILE%.jsvu\v8.cmd"
eshost --add "XS" xs "%USERPROFILE%.jsvu\xs.cmd"
```

这里我个人配置如下（有没有这个配置貌似没什么影响，）

```
eshost --add "V8" d8 "C:\Users\xiao.jsvu\v8.cmd"
eshost --add "V8-debug" d8 "C:\Users\xiao.jsvu\v8-debug.cmd"
eshost --add "V8 --harmony" d8 "C:\Users\xiao.jsvu\v8.cmd" --args "--harmony"
```

### 查看

```
C:\Users\xiao.jsvu>eshost --configure-jsvu
Using config "C:\Users\xiao.eshost-config.json"
┌──────────────┬──────┬──────────────────────────────────┬───────────┬─────────────┐
│ name         │ type │ path                             │ args      │ tags        │
├──────────────┼──────┼──────────────────────────────────┼───────────┼─────────────┤
│ ChakraCore   │ ch   │ C:\Users\xiao.jsvu\chakra.cmd   │           │ 1.11.24,web │
├──────────────┼──────┼──────────────────────────────────┼───────────┼─────────────┤
│ V8 --harmony │ d8   │ C:\Users\xiao.jsvu\v8.cmd       │ --harmony │             │
├──────────────┼──────┼──────────────────────────────────┼───────────┼─────────────┤
│ V8           │ d8   │ C:\Users\xiao.jsvu\v8.cmd       │           │             │
├──────────────┼──────┼──────────────────────────────────┼───────────┼─────────────┤
│ V8-debug     │ d8   │ C:\Users\xiao.jsvu\v8-debug.cmd │           │             │
└──────────────┴──────┴──────────────────────────────────┴───────────┴─────────────┘

C:\Users\xiao.jsvu>
```

![](https://pic.imgdb.cn/item/63184e5d16f2c2beb1dfff6f.png)

有大佬知道上面问题在哪，麻烦您指点一下，感谢😊

### 说明：

1.  %USERPROFILE% =C:\Users\用户名

    win+r，输入cmd 回车

    在cmd窗口下输入 set 回车，可以查看系统变量（想要了解更多 set 命令请看👉 [这里](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/set_1)）

![](https://pic.imgdb.cn/item/63184e7616f2c2beb1e01f77.png)

## 3、先简单了解一下抽象语法树

在传统的编译语言的流程中，程序的一段源代码在执行之前会经历三个步骤，统称为"编译":

1.  分词/词法分析

这个过程会将由字符组成的字符串**分解**成有意义的代码块，这些代码块统称为**词法单元**(token)

举个例子: let a = 1; 这段程序通常会被分解成为下面这些词法单元: let 、a、=、1、 ；空格是否被当成词法单元，取决于空格在这门语言中的意义。

2.  解析/语法分析

这个过程是将词法单元流转换成一个由元素嵌套所组成的代表了**程序语法结构**的树，这个树被称为"抽象语法树"（abstract syntax code，AST）

3.  代码生成

将AST转换成可执行代码的过程被称为代码生成。

![](https://pic.imgdb.cn/item/63184e8216f2c2beb1e02e93.png)
<p align=center>图片来源网络（侵删）</p>

下面看一下[在线解析AST](https://astexplorer.net/)的示例👇
![image.png](https://pic.imgdb.cn/item/63184e9816f2c2beb1e04929.png)

## 4、使用V8调试分析代码

### 文档查看

由于文档较长，可以使用命令输出一份本地的帮助文档，方便查看

```bash
# 进入到要输出文档的目录下，生成v8-help.txt、v8-debug-help.txt

v8 --help >> v8-help.txt
v8-debug --help >> v8-debug-help.txt
```

主要使用的命令参数如下👇

`v8-debug --help`

```bash
Synopsis:
  shell [options] [--shell] [<file>...]
  d8 [options] [-e <string>] [--shell] [[--module|--web-snapshot] <file>...]

  -e        execute a string in V8
  --shell   run an interactive JavaScript shell
  --module  execute a file as a JavaScript module
  --web-snapshot  execute a file as a web snapshot

SSE3=1 SSSE3=1 SSE4_1=1 SSE4_2=1 SAHF=1 AVX=1 AVX2=1 FMA3=1 BMI1=1 BMI2=1 LZCNT=1 POPCNT=1 ATOM=0
The following syntax for options is accepted (both '-' and '--' are ok):
  --flag        (bool flags only)
  --no-flag     (bool flags only)
  --flag=value  (non-bool flags only, no spaces around '=')
  --flag value  (non-bool flags only)
  --            (captures all remaining args in JavaScript)

Options:
	# 打印生成的字节码
  --print-bytecode (print bytecode generated by ignition interpreter)
        type: bool  default: --noprint-bytecode


	# 跟踪被优化的信息
 	--trace-opt (trace optimized compilation)
        type: bool  default: --notrace-opt
  --trace-opt-verbose (extra verbose optimized compilation tracing)
        type: bool  default: --notrace-opt-verbose
  --trace-opt-stats (trace optimized compilation statistics)
        type: bool  default: --notrace-opt-stats

	# 跟踪去优化的信息
  --trace-deopt (trace deoptimization)
        type: bool  default: --notrace-deopt
  --log-deopt (log deoptimization)
        type: bool  default: --nolog-deopt
  --trace-deopt-verbose (extra verbose deoptimization tracing)
        type: bool  default: --notrace-deopt-verbose
  --print-deopt-stress (print number of possible deopt points)


	# 查看编译生成的 AST
  --print-ast (print source AST)
        type: bool  default: --noprint-ast

	# 查看编译生成的代码
  --print-code (print generated code)
        type: bool  default: --noprint-code

	# 查看优化后的代码
  --print-opt-code (print optimized code)
        type: bool  default: --noprint-opt-code

	# 允许在源代码中使用 V8 提供的原生 API 语法
        # 在代码中配和加入 %DebugPrint(); 可以查看详细的运行时信息
  --allow-natives-syntax (allow natives syntax)
        type: bool  default: --noallow-natives-syntax
```

### 4.1、查看 ast

```bash
v8-debug -e --print-ast "const name='xiao'"
```

接收到代码后，第一步就是“解释”，即解释器生成 AST 和作用域。

```bash
C:\Users\xiao>v8-debug -e --print-ast "const name='xiao'"
[generating bytecode for function: ]
--- AST ---
FUNC at 0
. KIND 0
. LITERAL ID 0
. SUSPEND COUNT 0
. NAME ""
. INFERRED NAME ""
. DECLS
. . VARIABLE (000001FA12EFAF80) (mode = CONST, assigned = false) "name"
. BLOCK NOCOMPLETIONS at -1
. . EXPRESSION STATEMENT at 11
. . . INIT at 11
. . . . VAR PROXY context[2] (000001FA12EFAF80) (mode = CONST, assigned = false) "name"
. . . . LITERAL "xiao"


C:\Users\xiao>
```

![](https://pic.imgdb.cn/item/63184eaa16f2c2beb1e05da2.png)

### 4.2、查看作用域

```bash
v8-debug -e --print-scopes "const name='xiao'"
```

```bash
C:\Users\xiao>v8-debug -e --print-scopes "const name='xiao'"
Global scope:
global { // (000001DB6010D600) (0, 17)
  // will be compiled
  // NormalFunction
  // 1 stack slots
  // 3 heap slots
  // temporary vars:
  TEMPORARY .result;  // (000001DB6010D910) local[0]
  // local vars:
  CONST name;  // (000001DB6010D820) context[2], never assigned
}

C:\Users\xiao>
```

### 4.3、查看生成的字节码

```bash
v8-debug -e --print-bytecode "const name='xiao'"
```

```bash
C:\Users\xiao>v8-debug -e --print-bytecode "const name='xiao'"
[generated bytecode for function:  (0x0113002538bd <SharedFunctionInfo>)]
Bytecode length: 6
Parameter count 1
Register count 1
Frame size 8
Bytecode age: 0
         000001130025393A @    0 : 13 00             LdaConstant [0]
         000001130025393C @    2 : 25 02             StaCurrentContextSlot [2]
         000001130025393E @    4 : 0e                LdaUndefined
         000001130025393F @    5 : a9                Return
Constant pool (size = 1)
000001130025390D: [FixedArray] in OldSpace
 - map: 0x011300002229 <Map(FIXED_ARRAY_TYPE)>
 - length: 1
           0: 0x0113002538a1 <String[4]: #xiao>
Handler Table (size = 0)
Source Position Table (size = 0)

C:\Users\xiao>
```

### 4.4、查看详细的运行时信息

通过 `--allow-natives-syntax` 参数可以在 JavaScript 中调用 %DebugPrint 底层的 Native API

```js
function testV8(properties, elements) {
  //添加可索引属性

  for (let i = 0; i < elements; i++) {
    this[i] = `element${i}`;
  }

  //添加常规属性

  for (let i = 0; i < properties; i++) {
    const prop = `property${i}`;

    this[prop] = prop;
  }
}

const testobj1 = new testV8(12, 13);

// 打印 testobj1 详细的运行时信息
%DebugPrint(testobj1);
```

执行

```bash
v8-debug --allow-natives-syntax .\src\libs\demo.js
```

输出

![](https://pic.imgdb.cn/item/63184eba16f2c2beb1e071cd.png)

## 相关文章一览

- [V8中的快慢属性](https://juejin.cn/post/7125763016582234142)

- [V8中的快慢数组](https://juejin.cn/post/7126200095543918599)

---

🎈🎈🎈

🌹 持续更文，关注我，你会发现一个踏实努力的宝藏前端😊，让我们一起学习，共同成长吧。

🎉 喜欢的小伙伴记得点赞关注收藏哟，回看不迷路 😉

🎁 欢迎大家评论交流, 蟹蟹😊