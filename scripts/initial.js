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
    const linkElement = e.target.closest("a[href]") || {};
    const href = linkElement.getAttribute("href");
    if (!href || !href.startsWith("http") || mode === "default") return;

    e.preventDefault();
    if (mode === "_blank") {
      window.open(href, mode);
    } else {
      window.location.href = href;
    }
  };
}
