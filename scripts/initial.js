// 进入一个新页面时，会先获取当前链接打开方式
chrome.storage.local.get("mode").then(({ mode }) => {
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
});
