let toggleFlag = false;

function InterceptLink(e) {
  let text = document.getElementById("toggle-link-button").innerHTML;
  if (text === "已开启") {
    e.preventDefault();
    e.stopPropagation();
    let href = e.currentTarget.href;
    window.open(href, "_blank");
  }
}

const toggleButton = document.createElement("button");
toggleButton.id = "toggle-link-button";
toggleButton.innerHTML = "未开启";
toggleButton.style.cssText =
  "background-color:red; color:white; padding:20px; border-radius:10px; position:fixed; bottom:50px; right:20px; z-index:9999; cursor:pointer";

const refreshButton = document.createElement("button");
refreshButton.id = "refresh-link-button";
refreshButton.innerHTML = "Refresh";
refreshButton.style.cssText =
  "background-color:red; color:white; padding:20px; border-radius:10px; position:fixed; bottom:150px; right:20px; z-index:9999; cursor:pointer";

document.body.appendChild(toggleButton);
document.body.appendChild(refreshButton);

// 点击刷新按钮，实时给a标签绑定事件
refreshButton.addEventListener("click", (e) => {
  document.querySelectorAll("a").forEach((item) => {
    item.addEventListener("click", InterceptLink, true);
  });
});

// 只执行一次
toggleButton.addEventListener(
  "click",
  (e) => {
    document.querySelectorAll("a").forEach((item) => {
      item.addEventListener("click", InterceptLink, true);
    });
  },
  { once: true }
);

// 切换按钮，样式变化
toggleButton.addEventListener("click", (e) => {
  if (toggleFlag === false) {
    toggleButton.style.backgroundColor = "green";
    toggleButton.innerHTML = "已开启";
    toggleFlag = true;
  } else {
    toggleFlag = false;
    toggleButton.style.backgroundColor = "red";
    toggleButton.innerHTML = "未开启";
  }
});
