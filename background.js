// 初次安装插件时，设置全局默认值
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ global_mode: "default" });
});

// 监听全局变量变化，并改变当前页面的打开方式
chrome.storage.onChanged.addListener(async ({ global_mode, site_mode_map }) => {
  let storage = await chrome.storage.local.get(null);
  /**
   *切换模式时，只会改变当前聚焦的页面内链接打开方式;
   *其他页面不会变化
   */
  let [tab] = await chrome.tabs.query({ active: true });
  let { url } = tab;
  if (url?.startsWith("chrome://")) return;

  let site_mode;
  // 切换全局配置时，且当前网站未配置，修改代理
  if (global_mode && !storage.site_mode_map?.[url]) {
    site_mode = global_mode.newValue;
  }
  if (site_mode_map) {
    site_mode = site_mode_map.newValue?.[url];
  }
  console.error("change===", site_mode);
  // 执行脚本
  site_mode &&
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [site_mode],
      func: bindEvent,
    });
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
