GM_addStyle(GM_getResourceText("Style"));

var IMAGES = {};
var IS_SHOW_PANEL = false;

let uiRoot = document.createElement("div");
uiRoot.setAttribute("class", "ui-imagesdownloader");
document.body.appendChild(uiRoot);

let uiPanel = document.createElement("div");
uiPanel.setAttribute("class", "ui-panel");
uiPanel.style.display = IS_SHOW_PANEL == true ? "block" : "none";
uiRoot.appendChild(uiPanel);

let listImages = document.createElement("div");
listImages.setAttribute("class", "list-images");
uiPanel.appendChild(listImages);

let uiControl = document.createElement("div");
uiControl.setAttribute("class", "ui-control");
uiPanel.appendChild(uiControl);
let btnRefresh = document.createElement("a");
btnRefresh.setAttribute("class", "btn-refresh");
btnRefresh.setAttribute("href", "javascript:void(0)");
btnRefresh.innerHTML = "Refresh";
btnRefresh.onclick = function () {
  CreateImages();
};
uiControl.appendChild(btnRefresh);
let btnSettings = document.createElement("a");
btnSettings.setAttribute("class", "btn-settings");
btnSettings.setAttribute("href", "javascript:void(0)");
btnSettings.innerHTML = "Settings";
btnSettings.onclick = function () {};
uiControl.appendChild(btnSettings);

let btnSwitcher = document.createElement("a");
btnSwitcher.setAttribute("class", "btn-switcher");
btnSwitcher.setAttribute("href", "javascript:void(0)");
btnSwitcher.innerHTML = IS_SHOW_PANEL == true ? "Hide" : "Show";
btnSwitcher.onclick = function () {
  IS_SHOW_PANEL = !IS_SHOW_PANEL;
  btnSwitcher.innerHTML = IS_SHOW_PANEL == true ? "Hide" : "Show";
  uiPanel.style.display = IS_SHOW_PANEL == true ? "block" : "none";
  if (IS_SHOW_PANEL == true) {
    CreateImages();
  } else {
    DestroyImages();
  }
};
uiRoot.appendChild(btnSwitcher);

function CreateImages() {
  let images = document.getElementsByTagName("img");
  Array.from(images).forEach((image) => {
    if ("getAttribute" in image && !image.getAttribute("tag")) {
      let unid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let dt = new Date().getTime();
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
      image.setAttribute("tag", unid);
      let itemImage = document.createElement("div");
      itemImage.setAttribute("tag", unid);
      itemImage.setAttribute("class", "item-image");
      itemImage.setAttribute("href", "javascript:void(0)");
      itemImage.onclick = function () {
        let dlgPreview = document.createElement("div");
        dlgPreview.setAttribute("class", "dlg-preview");
        dlgPreview.onclick = function () {
          dlgPreview.remove();
        };
        uiRoot.appendChild(dlgPreview);
        let uiPreview = document.createElement("div");
        uiPreview.setAttribute("class", "ui-preview");
        dlgPreview.appendChild(uiPreview);
        let icoPreview = document.createElement("img");
        icoPreview.setAttribute("class", "ico-image");
        icoPreview.setAttribute("src", image.src);
        uiPreview.appendChild(icoPreview);
      };
      listImages.appendChild(itemImage);
      let icoSelected = document.createElement("div");
      icoSelected.setAttribute("class", "ico-selected");
      itemImage.appendChild(icoSelected);
      let icoImage = document.createElement("img");
      icoImage.setAttribute("tag", "myui");
      icoImage.setAttribute("class", "ico-image");
      icoImage.setAttribute("src", image.src);
      itemImage.appendChild(icoImage);
      let txtLink = document.createElement("div");
      txtLink.setAttribute("class", "txt-link");
      txtLink.innerHTML = image.src;
      itemImage.appendChild(txtLink);
      IMAGES[unid] = { isselect: false, img: image, ui: itemImage };
    }
  });
}

function DestroyImages() {
  Object.keys(IMAGES).forEach((key) => {
    IMAGES[key].img.removeAttribute("tag");
    IMAGES[key].ui.remove();
  });
  IMAGES = {};
}

window.onscroll = function () {
  if (IS_SHOW_PANEL == true) {
    CreateImages();
  }
};
