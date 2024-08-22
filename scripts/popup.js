const MODE_BLANK = "_blank";
const MODE_SELF = "_self";
const MODE_DEFAULT = "default";

function getDomainFromUrl(url) {
  const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// 设置当前网址打开方式的按钮组
const site_global_input = document.getElementById("site-global");
const site_default_input = document.getElementById("site-default");
const site_blank_input = document.getElementById("site-blank");
const site_self_input = document.getElementById("site-self");

// 设置全局打开方式的按钮组
const global_default_input = document.getElementById("global-default");
const global_blank_input = document.getElementById("global-blank");
const global_self_input = document.getElementById("global-self");

// step1:获取当前页面域名并展示
async function getCurrentUrl() {
  let tabs = await chrome.tabs.query({ active: true });
  let url = tabs[0].url;
  let domain = getDomainFromUrl(url);

  const site = document.getElementById("site");
  site.innerText = domain;
}
getCurrentUrl();

// step2:根据全局变量，设置选中状态
chrome.storage.local.get(null, (items) => {
  const { global_mode, site_mode_map } = items;

  // 设置全局选中状态
  switch (global_mode) {
    case MODE_BLANK:
      global_blank_input.setAttribute("checked", true);
      break;
    case MODE_SELF:
      global_self_input.setAttribute("checked", true);
      break;
    default:
      global_default_input.setAttribute("checked", true);
  }

  // 设置网站按钮选中状态
  let site_mode = site_mode_map?.[site.innerText];
  switch (site_mode) {
    case MODE_BLANK:
      site_blank_input.setAttribute("checked", true);
      break;
    case MODE_SELF:
      site_self_input.setAttribute("checked", true);
      break;
    case MODE_DEFAULT:
      site_default_input.setAttribute("checked", true);
      break;
    default:
      site_global_input.setAttribute("checked", true);
  }
});

// step3: 点击全局设置按钮，设置全局变量
[global_blank_input, global_self_input, global_default_input].forEach((el) => {
  el.addEventListener("click", () => {
    switch (el.id) {
      case "global-blank":
        chrome.storage.local.set({ global_mode: MODE_BLANK });
        break;
      case "global-self":
        chrome.storage.local.set({ global_mode: MODE_SELF });
        break;
      default:
        chrome.storage.local.set({ global_mode: MODE_DEFAULT });
    }
  });
});

// step4: 点击网站设置按钮，设置全局变量
[
  site_global_input,
  site_default_input,
  site_blank_input,
  site_self_input,
].forEach((el) => {
  el.addEventListener("click", async () => {
    let { site_mode_map: map = {} } =
      (await chrome.storage.local.get("site_mode_map")) || {};

    switch (el.id) {
      case "site-global":
        delete map[site.innerText];
        break;
      case "site-default":
        map[site.innerText] = MODE_DEFAULT;
        break;
      case "site-blank":
        map[site.innerText] = MODE_BLANK;
        break;
      case "site-self":
        map[site.innerText] = MODE_SELF;
        break;
    }
    chrome.storage.local.set({ site_mode_map: map });
  });
});
