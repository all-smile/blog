![pages workflow](https://github.com/all-smile/blog/actions/workflows/pages.yml/badge.svg)
# 1、整体流程概览（手动部署下）
1. 搭建hexo环境（一系列软件安装，配置）
2. hexo new post "文章名称"
3. 编写md文档
4. hexo clean
5. hexo generate
6. hexo deploy
7. 本地源码同步远程仓库

# 2、自动化部署（GitHub Actions）

`travisCI`收费了，弃用

1. 在项目根目录创建工作流文件 `.github\workflows\pages.yml`
2. 编写工作流`step`，`CI/CD`
3. 提交到远程，自动触发流水线，部署

完整流程参考我的掘金文章：[Hexo+GitHub Actions搭建博客，实现云端写作、一键发布](https://juejin.cn/post/7133927239153877022)，点个关注呀😊

# 3、创建一篇新文章
```bash
hexo new "My New Post"
```
生成 `source/_posts/My New Post.md` 文件，同时文章中的 title 为 "My New Post"

<!--
# 启动服务
```bash
hexo server

# 静态模式，服务器只处理 public 文件夹内的文件，而不会处理文件变动，
# 在执行时，您应该先自行执行 hexo generate，此模式通常用于生产环境（production mode）下。
hexo server -s
```

# 生成静态文件

`public`目录下

```bash
hexo generate

or
hexo g

# 完成后部署
hexo g -d
```

# 部署到远程站点

```bash
hexo deploy
```

# 自动化部署
```
.travis.yml
```
 -->

# 4、常用命令
```bash
hexo new "name"       # 新建文章
hexo new page "name"  # 新建页面
hexo g                # 生成页面
hexo d                # 部署
hexo g -d             # 生成页面并部署
hexo s                # 本地预览
hexo clean            # 清除缓存文件 (db.json) 和已生成的静态文件 (public)。在某些情况（尤其是更换主题后），如果发现您对站点的更改无论如何也不生效，您可能需要运行该命令。
hexo help             # 帮助
```

# 5、安装主题 `NexT`

更换`NexT`主题，文档实操性超级强，地址在[这里](https://theme-next.js.org/docs/getting-started/)

配置 GitHub Actions step

## 5.1、本地安装主题

```bash
git clone https://github.com/next-theme/hexo-theme-next themes/next
```

> 注意：本地安装主题之后，一定要修改 `.gitignore` 文件，忽略 `themes/next`
> 否则，GitHub CI 执行安装依赖的时候，会报错：`git submodule: already exists in the index`

## 5.2、GitHub Actions 配置 step

```yml
- name: Install Theme
  run: git clone https://github.com/next-theme/hexo-theme-next themes/next
```

## 5.3、修改主题配置

首先不能直接修改 `themes/next` 下的 `_config.yml` 文件，`Hexo` 允许我们在根目录通过 `_config.[themeName].yml` 来修改主题，优先级高于 `themes/next` 下的 `_config.yml` 配置

为此，我直接把 `themes/next` 下的 `_config.yml` 复制到站点根目录

```bash
cp themes/next/_config.yml ./_config.next.yml
```

然后参考[文档](https://theme-next.js.org/docs/getting-started/)， 一步步进行设置，要是不想麻烦，也可以直接 `Fork` 我的

# 6、submodule 使用

```bash
git clone https://github.com/next-theme/hexo-theme-next themes/next

# git submodule add -f https://github.com/all-smile/tenacity.git themes/tenacity
# git clone https://github.com/all-smile/tenacity.git themes/tenacity

# 删除
git rm -f --cached themes/tenacity

git rm -r --cached themes/tenacity


git submodule deinit themes/tenacity
git rm themes/tenacity

# 更新
git submodule init
git submodule update
```