function bindEvent(mode) {
  document.onclick = (e) => {
    const { href } = e.target.closest("a[href]");
    if (!href || mode === "default") return;

    e.preventDefault();
    if (mode === "_blank") {
      window.open(href, mode);
    } else {
      window.location.href = href;
    }
  };
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ mode: "default" });
});

chrome.storage.onChanged.addListener(({ mode: { newValue } }) => {
  /**
   *切换模式时，只会改变当前聚焦的页面内链接打开方式;
   *其他页面不会变化
   */
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab.url?.startsWith("chrome://")) return;

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [newValue],
      func: bindEvent,
    });
  });
});
