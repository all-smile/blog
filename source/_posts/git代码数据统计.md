---
title: git代码数据统计
tags: Git
categories: Git
description: 统计代码提交量、贡献值等等，方便实用
abbrlink: 389559366
date: 2022-12-23 16:53:34
---
## gitbash 终端执行如下命令

1. 查看git上的个人代码量（username为gitlab的账户名）：
```bash
git log --author="username" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -
```

2. 统计每个人的增删行数：
```bash
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done
```

3. 统计某段时间内所有人的代码量（修改起止时间，如果指定某一个人，将name更换为gitlab的账户名）：
```bash
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --since ==2021–10-01 --until=2021-10-30 --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done
```

4. 查看仓库提交者排名前5：
```bash
git log --pretty='%aN' | sort | uniq -c | sort -k1 -n -r | head -n 5
```

5. 贡献值统计：
```bash
git log --pretty='%aN' | sort -u | wc -l
```

6. 提交数统计：
```bash
git log --oneline | wc -l
```

## git log参数说明
```bash
--author   指定作者
--stat   显示每次更新的文件修改统计信息，会列出具体文件列表
--shortstat    统计每个commit 的文件修改行数，包括增加，删除，但不列出文件列表：
--numstat   统计每个commit 的文件修改行数，包括增加，删除，并列出文件列表：

-p 选项展开显示每次提交的内容差异，用-2 则仅显示最近的两次更新,例如：git log -p  -2
--name-only 仅在提交信息后显示已修改的文件清单
--name-status 显示新增、修改、删除的文件清单
--abbrev-commit 仅显示 SHA-1 的前几个字符，而非所有的 40 个字符
--relative-date 使用较短的相对时间显示（比如，“2 weeks ago”）
--graph 显示 ASCII 图形表示的分支合并历史
--pretty 使用其他格式显示历史提交信息。可用的选项包括 oneline，short，full，fuller 和 format（后跟指定格式）,例如： git log --pretty=oneline ; git log --pretty=short ; git log --pretty=full ; git log --pretty=fuller
--pretty=tformat:   可以定制要显示的记录格式，这样的输出便于后期编程提取分析
       例如：git log --pretty=format:""%h - %an, %ar : %s""
       下面列出了常用的格式占位符写法及其代表的意义。
       选项       说明
       %H      提交对象（commit）的完整哈希字串
       %h      提交对象的简短哈希字串
       %T      树对象（tree）的完整哈希字串
       %t      树对象的简短哈希字串
       %P      父对象（parent）的完整哈希字串
       %p      父对象的简短哈希字串
       %an     作者（author）的名字
       %ae     作者的电子邮件地址
       %ad     作者修订日期（可以用 -date= 选项定制格式）
       %ar     作者修订日期，按多久以前的方式显示
       %cn     提交者(committer)的名字
       %ce     提交者的电子邮件地址
       %cd     提交日期
       %cr     提交日期，按多久以前的方式显示
       %s      提交说明

--since  限制显示输出的范围，
       例如： git log --since=2.weeks    显示最近两周的提交
       选项 说明
       -(n)    仅显示最近的 n 条提交
       --since, --after 仅显示指定时间之后的提交。
       --until, --before 仅显示指定时间之前的提交。
       --author 仅显示指定作者相关的提交。
       --committer 仅显示指定提交者相关的提交。
```

## 其它统计方式

1. 工具、插件统计：gitstats、cloc
2. python统计
3. 还有用接口统计的
4. ……

## 总结

- 通过 Git log 统计，稍微会麻烦一些，需要有一些 awk 知识的储备；
- 使用插件 git_stats 来生成可视化报告，对用户友好。美中不足就是会在当前项目增加很多 html 统计可视化文件；
- 命令行工具 cloc，简单易用，无侵入，使用门槛低；