---
title: 友链
date: 2022-09-16 11:34:27
comments: true
---
<style>
.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.clamp2 {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 2;
}

.links-content {
    margin-top: 1rem;
}

.link-navigation {
    display: grid;
    grid-template-columns: repeat(2,50%);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    margin: 5px;
    position: relative;
}

@media only screen and (max-width: 800px) {
  .link-navigation {
      grid-template-columns: repeat(1,100%);
  }
}

.card {
    width: 350px;
    box-shadow: 0 4px 11px 0 rgb(37 44 97 / 10%), 0 1px 3px 0 rgb(93 100 148 / 13%);
    position: relative;
    padding: 0 6px;
    max-width: 100%;
    height: 70px;
    align-items: center;
    display: flex;
    border-radius: 6px;
    background-color: #fff;
    margin: 10px 5px;
    color: #6b7280;
    cursor: pointer;
    justify-self: center;
}
.card:nth-child(3n+0) .links-icon {
    background-color: #34d399;
}
.card:nth-child(3n+1) .links-icon {
    background-color: #a78bfa;
}
.card:nth-child(3n+2) .links-icon {
    background-color: #f87171;
}
.links-icon {
    width: 22px;
    height: 22px;
    position: absolute;
    top: 0;
    right: 0;
    margin-right: -8px;
    margin-top: -7px;
    align-items: center;
    display: flex;
    border-radius: 6px;
    --transform-rotate: 45deg;
    transform: rotate(45deg);
    --tw-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
    box-shadow: 0 0 transparent,0 0 transparent,var(--tw-shadow);
}
.links-icon a {
    --transform-rotate: -45deg;
    transform: rotate(-45deg);
}
.links-icon a i.fa {
    color: #fff;
    position: relative;
    top: 1px;
    left: 3px;
    font-size: 12px;
}

.card::after {
  content: "";
  position: absolute;
  width: 5px;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 4px;
  opacity: 0.8;
}
.card:nth-child(1n)::after {
  background: linear-gradient(136.4deg, #ff7a6d, #ff4d3e);
}
.card:nth-child(2n)::after {
  background: linear-gradient(136.4deg, #5ddbe0, #00bcda);
}
.card:nth-child(3n)::after {
  background: linear-gradient(136.4deg, #3bdc48, #5cd12e);
}
.card:nth-child(4n)::after {
  background: linear-gradient(136.4deg, #febe2b, #ffa300);
}
.card:nth-child(5n)::after {
  background: linear-gradient(136.4deg, #9475f7, #7753e9);
}


.card:hover {
    box-shadow: 0 4px 11px 0 rgb(37 44 97 / 17%), 0 1px 3px 0 rgb(93 100 148 / 20%);
}

.card a {
    border: none;
}

.card .ava {
    display: inline-block;
    width: 60px !important;
    height: 60px !important;
    max-width: unset !important;
    border-radius: 6px;
    display: block;
    vertical-align: middle;
    margin-bottom: 0 !important;
    margin-left: 5px !important;
}

.card .card-header {
    margin-left: 10px;
    width: calc(100% - 80px);
    font-style: italic;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.card .card-header a {
    font-style: normal;
    color: #777aaf;
    font-weight: bold;
    text-decoration: none;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
}

.card .card-header a:hover {
    color: #d480aa;
    text-decoration: none;
}

.card .card-header .info {
    font-style: oblique;
    color: #6b7280;
    font-size: 12px;
    min-width: 0;
    line-height: 22px;
    margin-top: 2px;
}
</style>

---

<div class="post-body">
   <div id="links">
      <div class="links-content">
         <div class="link-navigation">
            <div class="card">
               <img class="ava" src="https://m.i-xiao.space/images/base/profile.jpg" />
               <div class="card-header">
                  <a class="ellipsis" title="甜点cc’s blog" href="https://blog.i-xiao.space/" target="_blank">甜点cc’s blog</a>
                  <div class="info ellipsis" title="这是一个分享IT技术的小站。GitHub Pages站点">这是一个分享IT技术的小站。GitHub Pages站点</div>
               </div>
               <div class="links-icon">
                  <a href="https://blog.i-xiao.space/" target="_blank" title="访问链接">
                  <i class="fa fa-paper-plane"></i>
                  </a>
               </div>
            </div>
            <div class="card">
               <img class="ava" src="https://m.i-xiao.space/images/base/grow.jpg" />
               <div class="card-header">
                  <a class="ellipsis" title="xiaojt’s blog" href="https://m.i-xiao.space/" target="_blank">xiaojt's Blog</a>
                  <div class="info ellipsis" title="Netlify站点">Netlify站点</div>
               </div>
               <div class="links-icon">
                  <a href="https://blog.i-xiao.space/" target="_blank" title="访问链接">
                  <i class="fa fa-heart"></i>
                  </a>
               </div>
            </div>
            <div class="card">
               <img class="ava" src="https://m.i-xiao.space/images/base/lion.png" />
               <div class="card-header">
                  <a class="ellipsis" title="xiaojt’s Garden" href="https://m.i-xiao.space/" target="_blank">xiaojt’s Garden</a>
                  <div class="info ellipsis" title="Netlify站点">Netlify站点</div>
               </div>
               <div class="links-icon">
                  <a href="https://blog.i-xiao.space/" target="_blank" title="访问链接">
                  <i class="fa fa-paper-plane"></i>
                  </a>
               </div>
            </div>
            <div class="card">
               <img class="ava" src="https://m.i-xiao.space/images/logo.jpg" />
               <div class="card-header">
                  <a class="ellipsis" title="xiaojt’s Garden" href="https://m.i-xiao.space/" target="_blank">xiaojt's Garden</a>
                  <div class="info ellipsis" title="一片自留地，欢快地生长着🌱🍅🥦">一片自留地，欢快地生长着🌱🍅🥦</div>
               </div>
               <div class="links-icon">
                  <a href="https://blog.i-xiao.space/" target="_blank" title="访问链接">
                  <i class="fa fa-heart"></i>
                  </a>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>

---

**交换友链：**

请添加本站友链后在下方留言申请（也可在下方公众号上发消息给我），期望您的站点:

- 独立博客
- 以原创内容为主，原创内容10篇以上
- 处于活跃状态，有一定的更新频率
- 未添加友链或申请未通过，评论留言会被隐藏。

**友链格式示例:**

名称: 甜点cc
链接: https://blog.i-xiao.space/
头像: https://blog.i-xiao.space/images/logo.jpg
简介: 一片自留地，欢快地生长着🌱🍅🥦

---

<center>欢迎微信扫码关注 "看见另一种可能"！</center>

<img src="/images/contact/qrcode_wechat.jpg" alt="wechat：看见另一种可能" />

<!-- ![wechat：看见另一种可能](https://raw.githubusercontent.com/all-smile/nav/v1.0.6/static/images/qrcode_wechat.jpg) -->