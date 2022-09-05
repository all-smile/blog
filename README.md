![pages workflow](https://github.com/all-smile/blog/actions/workflows/pages.yml/badge.svg)
# 整体流程概览
1. 搭建hexo环境（一系列软件安装，配置）
2. hexo new post "文章名称"
3. 编写md文档
4. hexo clean
5. hexo generate
6. hexo deploy
# 创建一篇新文章
```bash
hexo new "My New Post"
```
生成 `source/_posts/My New Post.md` 文件，同时文章中的 title 为 "My New Post"

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

# 常用命令
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

## 安装主题

配置 GitHub Actions step

```bash
git submodule add -f https://github.com/all-smile/tenacity.git themes/tenacity
git clone https://github.com/all-smile/tenacity.git themes/tenacity

# 删除
git rm -f --cached themes/tenacity

git rm -r --cached themes/tenacity


git submodule deinit themes/tenacity
git rm themes/tenacity

# 更新
git submodule init
git submodule update
```

- `menu_id` 用来高亮页面所属菜单导航
- `social_icons` 小图标
- `auto_cover` 自动添加文章封面