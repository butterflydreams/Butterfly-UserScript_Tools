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
  let uiimages = document.getElementsByTagName("img");
  Array.from(uiimages).forEach((uiimage) => {
    if ("getAttribute" in uiimage && !uiimage.getAttribute("tag")) {
      let unid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let dt = new Date().getTime();
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
      let IMAGE = {};
      IMAGE.isselect = true;
      IMAGE.timer = null;
      IMAGE.time = 0;
      IMAGE.el = {};
      uiimage.setAttribute("tag", unid);
      IMAGE.ui = uiimage;
      let itemImage = document.createElement("div");
      itemImage.setAttribute("tag", unid);
      itemImage.setAttribute("class", "item-image");
      itemImage.setAttribute("href", "javascript:void(0)");
      itemImage.ontouchstart = function () {
        IMAGE.time = 0;
        IMAGE.timer = setInterval(() => {
          IMAGE.time += 20;
        }, 20);
      };
      itemImage.ontouchend = function () {
        if (IMAGE.timer != null) {
          if (IMAGE.time >= 200) {
            // On long press event.
            let dlgPreview = document.createElement("div");
            dlgPreview.setAttribute("class", "dlg-preview");
            uiRoot.appendChild(dlgPreview);
            let uiPreview = document.createElement("div");
            uiPreview.setAttribute("class", "ui-preview");
            dlgPreview.appendChild(uiPreview);
            let icoPreview = document.createElement("img");
            icoPreview.setAttribute("class", "ico-image");
            icoPreview.setAttribute("src", uiimage.src);
            uiPreview.appendChild(icoPreview);
            let btnClose = document.createElement("a");
            btnClose.setAttribute("class", "btn-close");
            btnClose.setAttribute("href", "javascript:void(0)");
            btnClose.onclick = function () {
              dlgPreview.remove();
            };
            uiPreview.appendChild(btnClose);
          } else {
            // On single click event.
            IMAGE.isselect = !IMAGE.isselect;
            IMAGE.el.parent.style.border = IMAGE.isselect == true ? "solid 2px #ff0000" : "none";
            IMAGE.el.child.style.backgroundColor = IMAGE.isselect == true ? "#00ff00" : "#a9a9a9";
          }
          IMAGE.time = 0;
          clearInterval(IMAGE.timer);
          IMAGE.timer = null;
        }
      };
      listImages.appendChild(itemImage);
      let icoSelected = document.createElement("div");
      icoSelected.setAttribute("class", "ico-selected");
      itemImage.appendChild(icoSelected);
      IMAGE.el.child = icoSelected;
      let icoImage = document.createElement("img");
      icoImage.setAttribute("tag", "myui");
      icoImage.setAttribute("class", "ico-image");
      icoImage.setAttribute("src", uiimage.src);
      itemImage.appendChild(icoImage);
      let txtLink = document.createElement("div");
      txtLink.setAttribute("class", "txt-link");
      txtLink.innerHTML = uiimage.src;
      itemImage.appendChild(txtLink);
      IMAGE.el.parent = itemImage;
      IMAGE[unid] = IMAGE;
    }
  });
}

function DestroyImages() {
  Object.keys(IMAGES).forEach((key) => {
    IMAGES[key].ui.removeAttribute("tag");
    IMAGES[key].el.parent.remove();
  });
  IMAGES = {};
}

window.onscroll = function () {
  if (IS_SHOW_PANEL == true) {
    CreateImages();
  }
};
