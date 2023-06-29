---
title: React Native项目设置路径别名
tags: React Native
categories: React Native
description: 设置路径别名让代码引用变得更加简洁
abbrlink: 984917644
date: 2023-05-22 16:29:52
---

没有设置路径别名之前代码是这样的：

```javascript
import { px2dp } from '../../utils/screenKits';
```

路径相当冗长，看着就头疼。增加了路径别名之后，变成这样

```javascript
import { px2dp } from '~/utils/screenKits';
```

心里清爽多了！
具体操作见下文，实操性强！

## 安装插件

这里我选用 [**babel-plugin-root-import**](https://github.com/entwicklerstube/babel-plugin-root-import)插件，主要是方便，不需要再为了 `eslint` 不识别 '@' 而增加配置。

这个[babel-plugin-module-resolver](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Ftleunen%2Fbabel-plugin-module-resolver)插件，也可以，但是需要处理 eslint 的配置

```bash
yarn add babel-plugin-root-import --dev
```

## 修改babel.config.js

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }], // mbox
    // ['react-native-reanimated/plugin'],
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './src',
            rootPathPrefix: '~/', // 使用 ~/  代替 ./src (~指向的就是src目录)
          },
          {
            rootPathSuffix: './src/utils',
            rootPathPrefix: '!/',
          },
        ],
      },
    ],
  ],
};

```

## 修改import路径测试

## 清除rn缓存并重新启动项目

```bash
yarn clear-run
```

```json
"scripts": {
  "android": "react-native run-android",
  "ios": "react-native run-ios",
  "start": "react-native start",
  "test": "jest",
  "lint": "npx eslint --ext .js,.jsx,.ts,.tsx ./src",
  "lint:fix": "npx eslint --fix .",
  "check": "lint-staged",
  "format": "prettier --write 'src/**/*.js'",
  "prettier": "npx prettier --write .",
  "prepare": "husky install",
  "clear": "yarn cache clean",
  "clear-run": "react-native start --reset-cache",
  "del": "rimraf node_modules yarn.lock"
},
```

可以看到项目可以正常启动、正常运行

## 👉修复函数跳转到定义功能

配置vscode： [https://code.visualstudio.com/docs/languages/jsconfig](https://code.visualstudio.com/docs/languages/jsconfig)
再项目根目录增加 `jsconfig.json` 文件

```javascript
{
  "compilerOptions": {
    "baseUrl": ".", // 基础目录
    "paths": { //  指定相对于 baseUrl 选项计算的路径映射, 别名路径也可以跳转
      "~/*": [
        "src/*"
      ]
    }
  }
}
```

**这个配置是针对编辑器的，不用重启项目，配置即生效**

---

我是 [**甜点cc**](https://blog.i-xiao.space/)☭

公众号：【看见另一种可能】