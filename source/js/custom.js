// 注入有问题
window.onload = function () {
  const timing = window.performance && window.performance.timing;
  const { navigationStart } = timing;
  // 白屏时间
  const whiteScreenTime = new Date().getTime() - navigationStart;
  console.log("%c whiteScreenTime =", "color: #A871FF", whiteScreenTime, "ms");

  // 清除 log
  console.clear();
  // 首屏时间
  const firstScreenTime = new Date().getTime() - navigationStart;
  console.log("%c firstScreenTime =", "color: #A871FF", firstScreenTime, "ms");
  console.log(
    "%c 甜点cc：相逢的还会再相逢",
    "color: #A871FF;font-size: 20px;font-weight: bold"
  );
  // console.log("%c https://home.i-xiao.space/", "color: #A871FF;font-size: 16px;font-weight: bold")

  // 崩溃欺骗
  var OriginTitle = document.title;
  var titleTime;
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      $('[rel="icon"]').attr("href", "/blog/images/base/crashed.png");
      document.title = "╭(°A°`)╮ 页面崩溃啦 ~";
      clearTimeout(titleTime);
    } else {
      $('[rel="icon"]').attr("href", "/blog/images/base/favicon.ico");
      // https://pic.imgdb.cn/item/631869a616f2c2beb101201c.jpg
      document.title = "(ฅ>ω<*ฅ) 噫又好了~" + OriginTitle;
      titleTime = setTimeout(function () {
        document.title = OriginTitle;
      }, 2000);
    }
  });
};
