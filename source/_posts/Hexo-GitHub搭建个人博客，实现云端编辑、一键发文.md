---
title: Hexo+GitHub搭建个人博客
tags:
  - Hexo
  - GitHub Actions
categories:
  - Hexo
description: 使用Hexo搭建静态博客，并结合GitHub Actions从手动发布实现自动发布，一站式教程，Hexo写博客真香。
abbrlink: 3616955208
date: 2022-08-20 20:26:50
---

> 操作环境：Windows10、Node、Git、ssh
>
> 前置准备: `<username>github.io` 仓库已建立，预计托管博客网址为`<username>github.io/blog`

先对hexo有个清晰的认识，不至于稀里糊涂的跟着步骤走。

# 1、Hexo发布博客流程概览

1. 搭建hexo环境

2. `hexo new "title"` (创建新文章)

3. 编写md文档

4. `hexo clean`

- 清除缓存文件 (db.json) 和已生成的静态文件 (public)

5. `hexo generate` (生成静态文件)

6. `hexo deploy` (Hexo 会将 public 目录中的文件和目录推送至 `_config.yml` 中指定的远端仓库和分支中，并且完全覆盖该分支下的已有内容。)

7. 本地仓库同步到GitHub (不同步的话，文章源码只会保留在本地，不易管理)

> 由于 Hexo 的部署默认使用分支 master，所以如果你同时正在使用 Git 管理你的站点目录，你应当注意你的部署分支应当不同于写作分支。
>
> Hexo 在部署你的站点生成的文件时并不会更新你的站点目录。因此你应该手动提交并推送你的写作分支。

一般来说第一步环境搭建只需要在最开始创建博客网站的时候进行，写文的话只需要重复第2-7步就可以了，这种使用方式强烈依赖于本地环境。但是，有时候我们并不只是固定在一台电脑上写文，（比如：一直写文的电脑坏了，需要换新电脑；电脑重装系统等等）这样就需要在另一台电脑上搭建环境，这样非常的麻烦，而且难免会带来一些其它依赖版本兼容问题。所以，可以采用`GitHub Actions`持续集成平台来简化发布文章的流程。

简化后的流程如下：

1. `hexo new "title"` (创建新文章)

2. 编写md文档

3. 本地仓库同步到GitHub
- push到GitHub上之后，`GitHub Actions`会监听分支文件变动，触发发布流程（跟Jenkins 构建流程类似）

下文整体分为两个步骤：
1. 借助`GitHub Pages`手动部署。

2. 增加`GitHub Actions`配置，完成自动部署

# 2、Hexo 搭建博客

Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

[文档](https://hexo.io/docs/)

```bash
npm install -g hexo-cli
cd [workspace]
hexo init <folder:blog>
cd <folder:blog>
npm install
hexo s
```

![](https://files.mdnice.com/user/34064/5dd21663-e0b3-4304-9bb4-a65dded21137.png)


网站基础配置修改参考[这里](https://hexo.io/docs/configuration)


# 3、GitHub 托管 Hexo 博客

> 可以采取`分支管理`的方式，也可以新建repo，在ci配置上略有不同，这里我采用的是将`hexo`博客源码托管到`独立的repo上`，将 `Hexo` 项目编译生成静态页面，部署到 `gh-pages` 分支

1. 新建仓库：`blog` （名字自己起）

2. 本地hexo仓库关联远程GitHub仓库
将本地仓库推送到远端

3. 本地仓库一些必要的修改配置
- 安装 [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)。
```
https://github.com/hexojs/hexo-deployer-git
```

- 修改`_config.yml`配置，如下：
```bash
url: https://all-smile.github.io/blog
root: /blog/

# ...

deploy:
  type: 'git'
  repo: git@github.com:all-smile/blog.git
  branch: gh-pages
```

- 提交到远程仓库

3. 创建 `gh-pages` 分支

hexo结合GitHub创建个人网站指定的分支名，hexo 内默认设置的分支也是叫这个名字

```bash
git checkout -b gh-pages
git push -u origin gh-pages
```

4. 远程仓库开启 github pages

指定部署分支：gh-pages

![](https://files.mdnice.com/user/34064/a973732c-bccb-4fbd-ba95-8fb1ef2945fa.png)

# 4、手动部署

本地项目执行命令：
```
hexo clean
hexo g
hexo deploy
```

hexo模板引擎生成静态文件，并推送到`gh-pages`分支下（替换原先分支下的所有文件）

![](https://files.mdnice.com/user/34064/ff1f8baa-c9cb-4570-97a5-bee921649715.png)

到这里就已经完成了博客的搭建

> 需要注意的是：`hexo deploy` 命令并不会帮助我们同步本地的修改到远程仓库，所以当在本地写完博文之后，要做两件事：一是发布站点，二是同步远程仓库，这样做比较麻烦，下面会讲解如何配置`持续集成`

## 4.1、查看效果

这里我配置了自定义域名

![](https://files.mdnice.com/user/34064/b9ccbe53-b080-41ba-8b10-fd9810d6b1e3.jpg)

# 5、自动部署

> 就是DevOps，可以理解成 `GitHub` 通过一些`流水线`的配置（CI/CD），然后在本地推送代码的时候触发`流水线`执行，自动部署站点。

由于 `GitHub Actions` 也可以实现CI/CD，`travis-ci` 的市场被挤压了，所以他们改变了运营策略，变成收费使用了！我们换用 `GitHub Actions`

`GitHub Actions` 是开源持续集成构建项目，用来持续集成托管在GitHub上的代码，使用起来也非常的简单方便。

使用 `GitHub Actions` 后，可以将前面部署的步骤自动化，我们只需要将本地修改的文件推送到 `github` 仓库，`GitHub Actions` 检测到 `master` 分支代码有变动，会自动执行脚本命令，将 `Hexo` 项目编译生成静态页面，部署到 `gh-pages` 分支，very good！

# 6、GitHub Actions

`GitHub Actions`文档请点击[这里](https://docs.github.com/cn/actions)

> 使用`Github Action`来部署`hexo`，这样电脑本地就不需要安装npm相关的东西了。另外利用`github.dev`也可以实现在页面上编辑了。
>
> 在线编辑:
`Github`有提供一个在线编辑的页面，在Repo页面按下按键`.`就可以打开编辑页面了

![](https://files.mdnice.com/user/34064/8818f33d-14ce-4d4d-ae58-079f5e90b023.png)

每个 `action` 就是一个独立脚本，因此可以做成代码仓库，使用`userName/repoName`的语法引用 `action`。比如，`actions/setup-node`就表示[`github.com/actions/setup-node`](https://github.com/actions/setup-node)这个仓库，它代表一个 `action`，作用是安装 Node.js。事实上，GitHub 官方的 actions 都放在 [`github.com/actions`](https://github.com/actions) 里面。

## 6.1、支持的令牌

支持三个令牌。

|令牌	|私人仓库|	公开仓库|	协议|	设置|
|---|---|---|---|---|
|github_token|	✅️|	✅️|	HTTPS|	不必要|
|deploy_key|	✅️|	✅️|	SSH|	必要的|
|personal_token|	✅️|	✅️|	HTTPS|	必要的|

> 注意：`GITHUB_TOKEN`不是个人访问令牌，`GitHub Actions` 运行器会自动创建一个`GITHUB_TOKEN`密钥以在您的工作流程中进行身份验证。因此，您无需任何配置即可立即开始部署

## 6.2、支持的平台

所有 `Actions` 运行器：支持 Linux (Ubuntu)、macOS 和 Windows。
|环境|	github_token|	deploy_key|	personal_token|
|---|---|---|---|
|ubuntu-20.04|	✅️|	✅️|	✅️|
|ubuntu-18.04|	✅️|	✅️|	✅️|
|macos-最新|	✅️|	✅️	|✅️|
|windows-最新|	✅️|	(2)|	✅️|

# 7、为Hexo配置GitHub Actions

具体步骤：

## 7.1、设置 SSH 私钥 `deploy_key`

创建 SSH 部署密钥，使用以下命令生成部署密钥。

```sh
ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f gh-pages -N ""
```

您将获得 2 个文件：

- gh-pages.pub是公钥

- gh-pages是私钥

接下来，转到博客源码存储库设置

- 转到`Deploy Keys`并使用`Allow write access`添加您的公钥 `gh-pages.pub`，name写为`public key of ACTIONS_DEPLOY_KEY`，指定用途，方便后面维护

![](https://files.mdnice.com/user/34064/16070f38-5c57-482d-a1bc-5d2fa3318221.png)


- 转到`Actions secrets`并将您的私钥 `gh-pages` 添加为 `ACTIONS_DEPLOY_KEY`（这个名称在yml文件中需要使用）


![](https://files.mdnice.com/user/34064/e2f6afbc-71e8-4fc2-bcdd-181d2dd96a6c.png)


## 7.2、新建 .github/workflows/pages.yml 文件

`yml`文件通过缩进（空格，不是tab）来表示层级关系。

`yaml`不会的，可以去看一下[这里](https://www.runoob.com/w3cnote/yaml-intro.html)，了解一下语法即可。

以下文件是我个人的配置的一部分，不建议直接使用

```yml
name: Pages

# 触发器、分支
on:
  push:
    branches:
      - master  # default branch
jobs:
  # 子任务
  pages:
    runs-on: ubuntu-latest # 定运行所需要的虚拟机环境
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v2
        # with:
        #   submodules: true
        #   fetch-depth: 0
      # 每个name表示一个步骤:step
      - name: Use Node.js 16.x
        uses: actions/setup-node@v2
        with:
          node-version: '16.14.1' # 自己正在使用的node版本即可
      # - run: node -v # 查看node版本号
      # 缓存依赖项: https://docs.github.com/cn/actions/using-workflows/caching-dependencies-to-speed-up-workflows
      - name: Cache NPM dependencies
        uses: actions/cache@v2
        with:
          # npm cache files are stored in `~/.npm` on Linux/macOS
          path: ~/.npm
          # path: node_modules
          key: ${{ runner.OS }}-npm-cache
          restore-keys: |
            ${{ runner.OS }}-npm-cache
      # 查看路径 : /home/runner/work/blog/blog
      # - name: Look Path
      #   run: pwd
      # 查看文件
      - name: Look Dir List
        run: tree -L 3 -a
      # 第一次或者依赖发生变化的时候执行 Install Dependencies，其它构建的时候不需要这一步
      - name: Install Dependencies
        run: npm install
      - name: Look Dir List
        run: tree -L 3 -a
      # - name: clean theme cache
      #   run: git rm -f --cached themes/tenacity
        # run: git submodule deinit themes/tenacity && git rm themes/tenacity
      # 安装主题
      - name: Install Theme
        run: git submodule add https://github.com/all-smile/tenacity.git themes/tenacity
      - name: Clean
        run: npm run clean
      - name: Build
        run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY  }}
          user_name: xiao
          user_email: allblue95@126.com
          # 获取提交文章源码时的commit message，作为发布gh-pages分支的信息
          commit_message: ${{ github.event.head_commit.message }}
          full_commit_message: ${{ github.event.head_commit.message }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          # GITHUB_TOKEN不是个人访问令牌，GitHub Actions 运行器会自动创建一个GITHUB_TOKEN密钥以在您的工作流程中进行身份验证。因此，您无需任何配置即可立即开始部​​署
          publish_dir: ./public
          allow_empty_commit: true # 允许空提交
      # Use the output from the `deploy` step(use for test action)
      - name: Get the output
        run: |
          echo "${{ steps.deploy.outputs.notify }}"
```

## 7.3、修改 `_config.yml` 文件中的`Deploy`配置

```yml
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: 'git'
  repo: git@github.com:all-smile/blog.git
  branch: gh-pages
  # 默认提交信息： Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}
  message: ${{ github.event.head_commit.message }} # 直接将提交消息传输到 GitHub Pages 存储库
```

## 发布效果

本地仓库直接`push`，触发 `GitHub Actions` 自动构建发布

![](https://files.mdnice.com/user/34064/3428f5ca-7730-4128-9c51-1fce5c063e99.png)

![](https://files.mdnice.com/user/34064/13a98b38-a16c-4997-8a33-f825bb86fb07.png)

![](https://files.mdnice.com/user/34064/9952cb44-cc50-467c-a6b4-36cab774f436.png)

## Hexo主题

请查看[文档](https://hexo.io/zh-cn/docs/themes.html) ，自行安装配置



# 8、GitHub Actions问题解决

## 8.1、非法输入值

在 `pages.yml` 文件的 `Deploy` 步骤下，发布的时候需要一些参数配置，这些参数名是指定好的，不可以随便写，比如 `commit_msg`应该使用 `commit_message`

![](https://files.mdnice.com/user/34064/81d50c5b-188b-4925-b1f8-0da53d697b65.jpg)

```yml
commit_message: ${{ github.event.head_commit.message }}
```

> Warning: Unexpected input(s) 'commit_msg', valid inputs are ['deploy_key', 'github_token', 'personal_token', 'publish_branch', 'publish_dir', 'destination_dir', 'external_repository', 'allow_empty_commit', 'keep_files', 'force_orphan', 'user_name', 'user_email', 'commit_message', 'full_commit_message', 'tag_name', 'tag_message', 'enable_jekyll', 'disable_nojekyll', 'cname', 'exclude_assets']

## 8.2、The process '/usr/bin/git' failed with exit code 128

这个问题大概率是 `GITHUB_TOKEN` 造成的，参考[配置文档](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)

`GITHUB_TOKEN` 是一种 `GitHub` 应用程序安装访问令牌。 可以使用安装访问令牌代表仓库中安装的 `GitHub` 应用程序进行身份验证。令牌的权限仅限于包含您的工作流程的仓库。

![](https://files.mdnice.com/user/34064/909ecbe7-ad36-4d09-a511-6236bdc317c5.png)

解决：

- 查看 `yml` 文件中的名字是否写错

```
github_token: ${{ secrets.GITHUB_TOKEN }}
```

- 在 仓库 `Settings/Actions/general` 下，修改 `GITHUB_TOKEN` 的权限

![](https://files.mdnice.com/user/34064/99653c2c-38e5-4a03-a190-1dad2586c372.png)

## 8.3、deploy key问题

```
ERROR: Permission to all-smile/blog.git denied to deploy key
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

解决：

- 查看 `pages.yml` 中引用的变量名称是否跟 GitHub 仓库上设置的一样

- 公私钥是否匹配，如果不匹配，则重新生成添加即可


👉👉 如果还有其它问题也可以看一下[这里](https://github.com/peaceiris/actions-gh-pages#readme)，应该会有帮助的😊

# 最后

- 本地写文只需要在写完之后`push`到远程仓库即可发布

- 其它电脑本地使用，有git就可以了，直接拉取远程仓库源码，在本地创建文件、编辑、推送远端，即可发布

- 也可以用`github.dev`在线创建、编辑、发文

---

🎈🎈🎈

🌹 持续更文，关注我，你会发现一个踏实努力的宝藏前端😊，让我们一起学习，共同成长吧。

🎉 喜欢的小伙伴记得点赞关注收藏哟，回看不迷路 😉

🎁 欢迎大家评论交流, 蟹蟹😊
