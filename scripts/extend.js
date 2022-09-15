
// bing SEO meta 标记
hexo.extend.injector.register(
  'head_begin',
  '<meta name="msvalidate.01" content="3816311BF4FE47986240954FB91B135F" />',
  'default'
);

// baidu seo
hexo.extend.injector.register(
  'head_begin',
  '<meta name="baidu-site-verification" content="code-xyJs6My2et" />',
  'default'
);

// google-site-verification
// hexo.extend.injector.register(
//   'head_begin',
//   '<meta name="google-site-verification" content="甜点cc,前端,Vue,React,DevOps" /> ',
//   'home'
// );


// 插入 Youtube 影片。
hexo.extend.tag.register('youtube', function (args) {
  console.log('args=', args);
  var id = args[0];
  return '<div class="video-container"><iframe width="560" height="315" src="http://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe></div>';
});

hexo.extend.console.register('config', 'Display configuration', function(args){
  console.log(hexo.config, args);
});