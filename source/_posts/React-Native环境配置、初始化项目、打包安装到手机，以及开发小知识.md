---
title: React Native环境配置、初始化项目、打包安装到手机，以及开发小知识
tags:
  - React Native
categories:
  - React Native
description: React Native环境配置、初始化项目、打包安装到手机，以及开发中的小问题解决，后面继续分享如何调试react native项目。
abbrlink: 252268106
date: 2022-08-31 18:14:29
---

# 1、前言

环境：Win10 + Android

已经在Windows电脑上安装好 [Node](https://nodejs.org/en/)（v14+）、Git、Yarn、
[JDK](https://www.oracle.com/java/technologies/downloads/#java11)(v11)

```bash
javac -version
javac 11.0.15.1

---
node -v
v16.14.1
```
👉 [官方文档](https://www.react-native.cn/docs/next/environment-setup)

# 2、Android Studio下载安装

- [下载地址](https://developer.android.google.cn/studio/)

![](https://pic.imgdb.cn/item/631855c416f2c2beb1e9e38c.png)

# 3、Android SDK 下载安装

- 安装 android sdk

![](https://pic.imgdb.cn/item/6318562016f2c2beb1ea4698.png)

![](https://pic.imgdb.cn/item/6318567d16f2c2beb1eab904.png)

![](https://pic.imgdb.cn/item/6318569116f2c2beb1eacfb0.png)

![](https://pic.imgdb.cn/item/631856a016f2c2beb1eae08f.png)

![](https://pic.imgdb.cn/item/631856be16f2c2beb1eb068f.png)

## 3.1、环境变量配置

- 配置系统变量
![](https://pic.imgdb.cn/item/631856cf16f2c2beb1eb1c1c.png)

- Path 配置：

```
%ANDROID_SDK_ROOT%
%ANDROID_SDK_ROOT%\platform-tools
%ANDROID_SDK_ROOT%\emulator
%ANDROID_SDK_ROOT%\tools
%ANDROID_SDK_ROOT%\tools\bin
```

# 4、Scrcpy 手机模拟器下载安装使用

- [下载地址](https://github.com/Genymobile/scrcpy)

![](https://pic.imgdb.cn/item/631856e916f2c2beb1eb3879.png)

下载zip文件，解压，双击运行 `scrcpy.exe` 可执行文件即可在电脑上投影手机屏幕，如下图👇

![](https://pic.imgdb.cn/item/631856fb16f2c2beb1eb4fb0.png)

![image.png](https://pic.imgdb.cn/item/6318571216f2c2beb1eb7443.png)

> 运行可执行文件之前，使用**数据线**连接Android手机，进行开发者选项设置（不同的手机进入开发者模式略有差异，自行搜索，我用的是华为手机）

- 电脑端查看连接设备
`adb devices`

```bash
adb devices
List of devices attached
8TFDU18719000649        device
```
> adb 命令，在下载 `scrcpy` 的时候已经内置了

# 5、安装 React Native

```bash
npm i react-native-cli -g

$ react-native -v
react-native-cli: 2.0.1
react-native: n/a - not inside a React Native project directory
```

# 6、初始化项目

进入到自己的工作目录，执行下面的命令创建 react native 项目

```
npx react-native init AwesomeProject
```

# 7、运行项目安装软件到安卓机

## 7.1、先用数据线连接手机和电脑，运行scrcpy 软件
开发者选项配置修改，最终实现在电脑上可以投屏手机，并可以在电脑上操控手机

## 7.2、打开 android studio 编辑器，运行项目

```
npm run android

or
-------------------
cd AwesomeProject
yarn android
# 或者
yarn react-native run-android
```

运行的时候会在手机上弹窗 “是否统一安装软件”之类的提示，点击同意即可


![](https://pic.imgdb.cn/item/6318572616f2c2beb1eb9161.png)

![](https://pic.imgdb.cn/item/6318573616f2c2beb1eba516.png)

## 7.3、adb reverse  命令使用

[adb 文档](https://developer.android.google.cn/studio/command-line/adb?hl=zh-cn)

#### 解决问题
![](https://pic.imgdb.cn/item/6318574916f2c2beb1ebbc88.png)

猜测是多设备连接受影响了，可以尝试重启手机解决
也可以尝试如下步骤： 启停 adb 服务器
> 在某些情况下，您可能需要终止 adb 服务器进程，然后重启以解决问题（例如，如果 adb 不响应命令）。
>
> 如需停止 adb 服务器，请使用 adb kill-server 命令。然后，您可以通过发出其他任何 adb 命令来重启服务器。

```
adb kill-server
adb start-server
adb reverse tcp:8081 tcp:8081
```

#### 作用
```
adb reverse tcp:8081 tcp:8081
```

这条命令的意思是，Android允许我们通过ADB，把Android上的某个端口映射到电脑（adb forward），或者把电脑的某个端口映射到Android系统（adb reverse），在这里假设电脑上开启的服务，监听的端口为8081。Android手机通过USB连接电脑后，在终端直接执行`adb reverse tcp:8081 tcp:8081`，然后在手机中访问`127.0.0.1:8081`，就可以访问到电脑上启动的服务了。

注意：
1. 必须是在连接数据线usb的前提下才能使用该方案进行代码调试。
2. (Android 5.0 及以上)使用 adb reverse 命令，这个选项只能在 5.0 以上版本(API 21+)的安卓设备上使用。

# 8、react-native开发小知识

## 8.1、vscode 上代码飘红

![](https://pic.imgdb.cn/item/6318575a16f2c2beb1ebd220.png)

- 问题原因：

VScode是默认解析ts的，但是不会默认识别 [`Flow`](https://flow.org/en/docs/react/)(**静态类型检测工具**)的语法，所以这种的代码会被解析成ts语法。

- 解决方法：
快捷键`Ctrl+Shift+P`，输入`setting.json`，选择 首选项:打开设置(json)。

`settings.json`
```
// "import type" 声明只能在 TypeScript 文件中使用。
"javascript.validate.enable": false,
```

## 8.2、npm run android 每次都需要在手机上重新安装软件包

开发者模式 -> USB调试 -> 监控ADB安装应用 -> 关闭, 即可解决。

## 8.3、本地开发启动多个项目

默认端口号是8081，通过指定不同的端口号来启动。

```
react-native start --port=8082
```

## 8.4、修改软件包名称

1. 修改配置文件
Android
修改配置文件里的 `app_name` 即可，重新 `yarn android` ，发现手机上软件的名称已修改成功。

文件： `android\app\src\main\res\values\strings.xml`
```
<resources>
    <string name="app_name">远点</string>
</resources>
```

2. react-native-rename 插件修改

通过插件修改名字，必须是 使用 `react-native init xxx` 创建的项目

```bash
# 安装
npm install react-native-rename -g
or
yarn global add react-native-rename

# 项目根目录执行命令
npx react-native-rename <newName>
```

修改完成。

本篇完！后面继续分享如何调试react native项目。

---

🎈🎈🎈

🌹 关注我，你会发现一个踏实努力的宝藏前端😊，让我们一起学习，共同成长吧。

🎉 喜欢的小伙伴记得点赞关注收藏哟，回看不迷路 😉

✨ 欢迎大家转发、评论交流

🎁 蟹蟹😊
