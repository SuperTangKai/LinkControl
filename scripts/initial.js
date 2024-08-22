// 每次进入一个新页面时，修改a标签事件代理
chrome.storage.local.get(null, ({ global_mode, site_mode_map }) => {
  let domain = window.location.host;
  // 优先采用当前页面域名设置的打开方式
  let mode = site_mode_map?.[domain] || global_mode;
  bindEvent(mode);
});

// 全局代理a标签的点击事件
function bindEvent(mode) {
  document.onclick = (e) => {
    const { href } = e.target.closest("a[href]") || {};
    if (!href || mode === "default") return;

    e.preventDefault();
    if (mode === "_blank") {
      window.open(href, mode);
    } else {
      window.location.href = href;
    }
  };
}
