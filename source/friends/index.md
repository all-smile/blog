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
    display: flex;
    justify-content: flex-start;
    flex-flow: row wrap;
    align-items: flex-start;
}

.card {
    flex: 0 0 33.33%;
    overflow: hidden;
    padding: 1em;
    box-sizing: border-box;
    font-size: 1rem;
    border-radius: 4px;
    transition-duration: 0.15s;
    margin-bottom: 1rem;
    display: flex;
}

.card:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}

.card a {
    border: none;
}

.card .ava {
    width: 3rem!important;
    height: 3rem!important;
    margin: 0!important;
    margin-right: 1em!important;
    border-radius: 4px;
}

.card .card-header {
    font-style: italic;
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 3px;
}

.card .card-header a {
    font-style: normal;
    color: #2bbc8a;
    font-weight: bold;
    text-decoration: none;
    height: 20px;
    line-height: 20px;
}

.card .card-header a:hover {
    color: #d480aa;
    text-decoration: none;
}

.card .card-header .info {
    font-style: normal;
    color: #a3a3a3;
    font-size: 14px;
    min-width: 0;
    line-height: 22px;
    margin-top: 2px;
}
</style>
<div class="post-body">
   <div id="links">
      <div class="links-content">
         <div class="link-navigation">
            <div class="card">
               <img class="ava" src="https://m.i-xiao.space/images/base/profile.jpg" />
               <div class="card-header">
                     <a href="https://blog.i-xiao.space/">甜点cc’s blog</a>
                  <div class="info clamp2" title="这是一个分享IT技术的小站。GitHub Pages站点">这是一个分享IT技术的小站。GitHub Pages站点</div>
               </div>
            </div>
            <div class="card">
               <img class="ava" src="https://m.i-xiao.space/images/base/profile.jpg" />
               <div class="card-header">
                     <a href="https://m.i-xiao.space/">xiaojt's Blog</a>
                  <div class="info clamp2" title="Netlify站点">Netlify站点</div>
               </div>
            </div>
            <div class="card">
               <img class="ava" src="https://m.i-xiao.space/images/base/profile.jpg" />
               <div class="card-header">
                     <a href="https://m.i-xiao.space/">xiaojt's Blog</a>
                  <div class="info clamp2" title="Netlify站点">Netlify站点</div>
               </div>
            </div>
            <div class="card">
               <img class="ava" src="https://m.i-xiao.space/images/base/profile.jpg" />
               <div class="card-header">
                     <a href="https://m.i-xiao.space/">xiaojt's Blog</a>
                  <div class="info clamp2" title="Netlify站点">Netlify站点</div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>