const MODE_BLANK = "_blank";
const MODE_SELF = "_self";
const MODE_DEFAULT = "default";

const defaultInput = document.getElementById("default");
const blankInput = document.getElementById("blank");
const selfInput = document.getElementById("self");

// 根据全局变量，设置选中状态
chrome.storage.local.get("mode", ({ mode }) => {
  switch (mode) {
    case MODE_BLANK:
      blankInput.setAttribute("checked", true);
      break;
    case MODE_SELF:
      selfInput.setAttribute("checked", true);
      break;
    default:
      defaultInput.setAttribute("checked", true);
  }
});

defaultInput.addEventListener("click", () => {
  chrome.storage.local.set({ mode: MODE_DEFAULT });
});

blankInput.addEventListener("click", () => {
  chrome.storage.local.set({ mode: MODE_BLANK });
});

selfInput.addEventListener("click", () => {
  chrome.storage.local.set({ mode: MODE_SELF });
});
