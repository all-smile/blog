---
title: 编写脚本配合git hooks实现commitMsg提交
tags:
  - shell
  - git hooks
categories: Git
description: 编写脚本实现git提交信息的拼接，主要利用git hooks实现。
abbrlink: 3797932790
date: 2023-06-07 15:22:00
---
# 背景
系统上线流程里，每次发版都要拆单，生成系统变更号，配合 commitlint 实现提交信息必须关联当前版本的系统变更号，当发版结束的时候，这个系统变更号就失效了，再次使用就会报错。
# 痛点
校验系统变更号是单向的，本地并不能动态获取系统变更号，每次提交都很麻烦，必须去看一下那长达9位的系统变更号
# 问题解决
## 思路分析
既然不能动态获取系统变更号，就在本地定义一个系统变更号的常量，编写脚本嵌入git hooks ，读取本地的系统变更号常量，利用脚本组合提交信息。这样至少在一次发版流程里不用关心系统变更号是什么的问题了，能做的也就这么多了。
## 代码实现
### 1、编写 ./git/compose-commit-msg.sh 文件
```shell
#!/bin/sh
#echo "system-change-code"

# 获取当前分支
line=$(head -n +1 .git/HEAD)
branch=${line##*/}
echo "branch: $branch"

# 获取变更号
user=`cat .git/system-change-code.txt | grep systemChangeCode`
user=${code##*=}
echo "code: $code"

# 获取当前提交者的信息
user=`git config user.name`
echo "user: $user"

if [ -z "$code" ] ; then
echo "NEED SYSTEM-CHANGE-CODE";
exit 1;
fi

# $1 参数 就是 .git/COMMIT_EDITMSG 文件
# cat $1 读取 git commit -m 输入的提交信息
# 组合提交信息
commit=[$code]$(cat $1)_${branch}_${user}
echo "所有参数: $*"

echo "commit-msg: $commit"

# 将组合的信息重新输出到 .git/COMMIT_EDITMSG 文件
echo "$commit" > "$1"
```
### 2、编写 .git/system-change-code.txt 文件
```shell
# 定义系统变更号常量(自己维护)
systemChangeCode=abc123456
```
### 3、在 commit-msg hooks里面载入compose-commit-msg.sh脚本
修改 .git/hooks/commit-msg 文件
git hooks [more](https://www.yuque.com/allblue-byynd/izub4k/obh3ns)
```shell
#!/bin/bash
# husky

# 加入下面代码
. "$(dirname "$1")"/compose-commit-msg.sh

```
### 4、提交测试

```bash
git commit -m 'test: 测试提交'

# 回车之后，触发钩子，执行脚本，组合提交信息

# 显示的信息：
[dev 4224456] [abc123456]test: 测试提交_dev_xiao
```
测试完成🎈🎈
# 友情链接：
[相关shell脚本](https://www.yuque.com/xiaojt/py87m6/hgxumq)
git commit [提交类型](https://www.yuque.com/xiaojt/izub4k/gap2yf#YRbth)
