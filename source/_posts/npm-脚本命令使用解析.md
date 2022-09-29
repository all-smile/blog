---
title: npm 脚本命令使用解析
tags: npm
categories: NPM
description: npm脚本命令是每个前端程序员都会高频使用的命令，那么你对它了解多少呢，本篇是初识npm脚本命令，后面陆续介绍其它命令。
abbrlink: 2334529800
date: 2022-09-29 18:28:22
---

> 本篇是初识npm脚本命令，来个引子，看看风向，可以的话后面陆续介绍其它实用命令😉。

## 1、执行原理

使用npm run script执行脚本的时候都会创建一个shell，然后在shell中执行指定的脚本。

这个shell会将当前项目的可执行依赖目录（即`node_modules/.bin`）添加到环境变量path中，当执行之后之后再恢复原样。就是说脚本命令中的依赖名会直接找到node_modules/.bin下面的对应脚本，而不需要加上路径。

## 2、执行顺序

一个npm脚本可以执行多个任务，这些任务之间可以指定不同的执行顺序。

1. '&' 并行执行顺序，同时执行
```
"dev":"node test.js & webpack"
```
2. '&&'继发顺序，执行前面之后才可以执行后面

```
"dev":"node test.js && webpack"
```

## 3、顺序钩子

npm脚本自带两个顺序钩子，'pre' 和 'post'

```
"predev":"node test_one.js",
"dev":"node test_two.js",
"postdev":"node test_three.js"
```

当执行 npm run dev 的时候默认就会执行

```
npm run predev && npm run dev && npm run postdev
```

## 4、生命周期脚本

1.  `prepare`: (@4.0.0) 在打包之前运行，新版的**husky**就是写入的prepare脚本，进行安装的：`"prepare": "husky install",`。

    👉 若想了解代码规范以及git提交信息规范，请来[这里](https://juejin.cn/post/7110083169067466766)

2.  `prepublish`: 在包发布之前运行

3.  `prepublishOnly`: 在本地运行，npm install没有任何参数

4.  `prepack`: 运行之后prepublish，但之前prepublishOnly

5.  `postpack`: 注意：如果通过 git 安装的包包含prepare脚本，则在打包和安装包之前dependencies，devDependencies将安装该脚本，并运行准备脚本。

有一些特殊的生命周期脚本只在某些情况下发生。上面这些脚本发生在“pre”和“post”脚本之外。

## 5、获取当前正在运行的脚本名称

npm 提供一个 `npm_lifecycle_event` 变量，返回当前正在运行的脚本名称，可以配合顺序钩子使用

```
npm run dev


const target = process.env.npm_lifecycle_event;

if(target === 'predev'){
  console.log('the process is predev')
}
if(target === 'dev'){
  console.log('the process is dev')
}
if(target === 'postdev'){
  console.log('this process is postdev')
}
```

## 6、四个可以简写的脚本执行命令

```
npm start === npm run start
npm stop === npm run stop
npm test === npm run test
npm restart === npm run stop && npm run restart && npm run start
```

## 7、使用package.json内部变量

通过npm_package_前缀，npm脚本可以拿到npm的内部变量

`package.json:`
```json
{
  "name" : "foo",
  "config" : {
    "port" : "8080"
  },
  "scripts" : {
    "start" : "node server.js"
  }
}
```

`test.js`
```js
console.log(process.env.npm_package_config_port) // 8080
```

👉 更多请看：[官方文档](https://docs.npmjs.com/cli/v6/using-npm/scripts)

---

![](https://cdn.jsdelivr.net/gh/all-smile/nav@1.0.7/static/images/wind_girl.webp)


我是 [**甜点cc**](https://blog.i-xiao.space/)

热爱前端，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚，等待着一个创业机会。主要致力于分享实用技术干货，希望可以给一小部分人一些微小帮助。

我排斥“新人迷茫，老人看戏”的现象，希望能和大家一起努力破局。营造一个良好的技术氛围，为了个人、为了我国的数字化转型、互联网物联网技术、数字经济发展做一点点贡献。**数风流人物还看中国、看今朝、看你我。**