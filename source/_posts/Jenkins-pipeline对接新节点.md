---
title: Jenkins pipeline对接新节点
date: 2023-08-17 09:26:15
tags: Jenkins
categories: Jenkins
description: 最近开发过程中部署新的节点，由于pipeline（流水线）中没有相关配置，所以需要新增参数、脚本以及ssh免密登录配置
---

# 背景

最近开发过程中部署新的节点，由于pipeline（流水线）中没有相关配置，所以需要新增参数、脚本以及ssh免密登录配置

> Jenkins流水线采用参数化构建，主要两个参数，一个是分支名： `branch`，一个是部署环境（也就是节点ip）： `buildENV`

# 步骤

## 1、新增节点参数

参数化构建中新增主机ip选项到`buildENV`参数中

## 2、修改流水线脚本

复制原有节点的脚本，修改即可

```sh
node("master") {
    withEnv(['PATH+bin=/home/xiao/node-v10.15.3-linux-x64/bin/bin:/usr/local/bin:/usr/bin/:/bin']) {
        stage("拉取代码"){
            echo  "WORKSPACE:${WORKSPACE}"
            echo  "JENKINS_HOME:${JENKINS_HOME}"
            echo  "JOB_NAME:${JOB_NAME}"
            echo  "WORKSPACE_TMP:${WORKSPACE_TMP}"
            echo  "WORKSPACE:${WORKSPACE}"
            checkout(
                [
                  $class: 'GitSCM',
                  branches: [[name: "*/${branch}"]],
                  doGenerateSubmoduleConfigurations: false,
                  extensions: [],
                  submoduleCfg: [],
                  userRemoteConfigs: [
                      [url: 'ssh://git@xx.xx/projectName.git']
                  ]
                ]
            )
        }
        stage("代码编译"){
            sh "npm run build"
        }
        stage("代码发布"){
            def machine
            def IP
            if (env.buildENV == "11.11.11.11") {
                machine = "xiao@11.11.11.11"
                IP = "11.11.11.11"
                def path = "/opt/web/tengine/data"

                sh "ssh ${IP} \"cd ${path} && rm -rf dist_bak && mv dist dist_bak\""
                sh "scp -r ${WORKSPACE}/dist ${machine}:${path}"
                sh "ssh ${IP} \"cd ${path} && sh replace.sh\""
            } else if (env.buildENV == "22.22.22.22") {
                // 新节点配置参考
                machine = "xiao@22.22.22.22"
                IP = "22.22.22.22"
                def path = "/opt/web/tengine/data"

                sh "ssh ${IP} \"cd ${path} && rm -rf dist_bak && mv dist dist_bak\""
                sh "scp -r ${WORKSPACE}/dist ${machine}:${path}"
                sh "ssh ${IP} \"cd ${path} && sh replace.sh\""
            }
        }
    }
}
```

更多配置请参考：[Jenkins CD SSH Pipeline](https://www.jenkins.io/doc/pipeline/steps/ssh-steps/)

## 3、新增节点的ssh免密登录配置

**最关键的一步**，主要用于在执行 `pipeline` 脚本过程中，能够使用`ssh`命令登录到目的主机上进行前端的一系列部署操作。

### 1. 沿用老节点的配置，不用生成新的rsa公私钥

### 2. 把 id_rsa.pub 添加到 新主机的 `~/.ssh/authorized_keys`文件里

1. 登录到 Jenkins 主机

2. 配置ssh免密登录新主机

```
cd ~/.ssh/
ssh-copy-id -i id_rsa.pub u8@192.x.x.x
```

输入主机密码后，即可在目的主机的 `~/.ssh/authorized_keys`文件里查看到 Jenkins 主机上的 `id_rsa.pub`

3. 重启Jenkins主机的 sshd 服务

```
sudo systemctl restart sshd

或者： sudo service sshd restart
```

## 4、触发Jenkins 构建

![](https://pic.imgdb.cn/item/64dd77d3661c6c8e543b9cdc.jpg)

# 问题及Reference

1. 如果不是root用户，执行命令的时候可以在命令前加 `sudo`

2. [SSH无密钥登陆 与 配置公钥后仍需要输入密码的解决方案](https://blog.csdn.net/b_x_p/article/details/78534423)

3. [Linux主机之间ssh免密登录配置方法](https://www.cnblogs.com/mhl1003/p/9442898.html)

4. [使用sshpass命令来进行明文免密登录](https://blog.csdn.net/weixin_42480153/article/details/104788790)

5. [使用代理服务器跳转连接远程Server](https://www.jianshu.com/p/f6990f3a52eb)
