GM_addStyle(GM_getResourceText("Style"));

class Image {
  constructor(unid, ui, elparent) {
    this._unid = unid;
    this._isselect = true;
    this._ui = ui;
    this._el = {};
    this._el.root = document.createElement("a");
    this._el.root.setAttribute("tag", this._unid);
    this._el.root.setAttribute("class", "item-image");
    this._el.root.setAttribute("href", "javascript:void(0)");
    this._gesture = new Hammer.Manager(this._el.root);
    this._gesture.add(new Hammer.Tap({ event: "doubletap", taps: 2 }));
    this._gesture.add(new Hammer.Tap({ event: "singletap" }));
    this._gesture.add(new Hammer.Press({ event: "press" }));
    this._gesture.get("doubletap").recognizeWith("singletap");
    this._gesture.get("singletap").requireFailure("doubletap");
    this._gesture.on("singletap", this._OnClickHandler.bind(this));
    this._gesture.on("doubletap", this._OnDoubleclickHandler.bind(this));
    this._gesture.on("press", this._OnPressHandler.bind(this));
    elparent.appendChild(this._el.root);
    this._el.select = document.createElement("div");
    this._el.select.setAttribute("class", "ico-selected");
    this._el.root.appendChild(this._el.select);
    this._el.icon = document.createElement("img");
    this._el.icon.setAttribute("tag", "ui-mydownloader");
    this._el.icon.setAttribute("class", "ico-image");
    this._el.icon.setAttribute("src", this._ui.src);
    this._el.root.appendChild(this._el.icon);
    this._el.link = document.createElement("div");
    this._el.link.setAttribute("class", "txt-link");
    this._el.link.innerHTML = this._ui.src;
    this._el.root.appendChild(this._el.link);
  }

  _OnClickHandler(event) {
    this._isselect = !this._isselect;
    this._el.root.style.border = this._isselect == true ? "solid 2px #ff0000" : "none";
    this._el.select.style.backgroundColor = this._isselect == true ? "#00ff00" : "#a9a9a9";
  }
  _OnDoubleclickHandler(event) {
    let dlgPreview = document.createElement("div");
    dlgPreview.setAttribute("class", "dlg-preview");
    dlgPreview.onclick = function () {
      dlgPreview.remove();
    };
    UIROOT.appendChild(dlgPreview);
    let uiPreview = document.createElement("div");
    uiPreview.setAttribute("class", "ui-preview");
    dlgPreview.appendChild(uiPreview);
    let icoPreview = document.createElement("img");
    icoPreview.setAttribute("class", "ico-image");
    icoPreview.setAttribute("src", this._ui.src);
    uiPreview.appendChild(icoPreview);
    let btnClose = document.createElement("a");
    btnClose.setAttribute("class", "btn-close");
    btnClose.setAttribute("href", "javascript:void(0)");
    btnClose.onclick = function () {
      dlgPreview.remove();
    };
    uiPreview.appendChild(btnClose);
  }
  _OnPressHandler(event) {}
}

class Images {
  constructor(elparent) {
    this._data = new Map();
    this._el = document.createElement("div");
    this._el.setAttribute("class", "list-images");
    elparent.appendChild(this._el);
  }

  static GetInstance(elparent) {
    if (!this._instance) {
      this._instance = new Images(elparent);
    }
    return this._instance;
  }

  CreateImages() {
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
        this._data.set(unid, new Image(unid, image, this._el));
      }
    });
  }

  DestroyImages() {
    this._data.forEach((value, key) => {
      value._ui.removeAttribute("tag");
      value._el.root.remove();
    });
    this._data.clear();
  }
}

var UIROOT = document.createElement("div");
UIROOT.setAttribute("class", "ui-imagesdownloader");
document.body.appendChild(UIROOT);
var IS_SHOW_PANEL = false;
let uiPanel = document.createElement("div");
uiPanel.setAttribute("class", "ui-panel");
uiPanel.style.display = IS_SHOW_PANEL == true ? "block" : "none";
UIROOT.appendChild(uiPanel);
var IMAGES = Images.GetInstance(uiPanel);
let btnSwitcher = document.createElement("a");
btnSwitcher.setAttribute("class", "btn-switcher");
btnSwitcher.setAttribute("href", "javascript:void(0)");
btnSwitcher.innerHTML = IS_SHOW_PANEL == true ? "Hide" : "Show";
btnSwitcher.onclick = function () {
  IS_SHOW_PANEL = !IS_SHOW_PANEL;
  btnSwitcher.innerHTML = IS_SHOW_PANEL == true ? "Hide" : "Show";
  uiPanel.style.display = IS_SHOW_PANEL == true ? "block" : "none";
  if (IS_SHOW_PANEL == true) {
    IMAGES.CreateImages();
  } else {
    IMAGES.DestroyImages();
  }
};
let dragx = 0;
let dragy = 0;
let isdrag = false;
let drag = new Hammer(btnSwitcher);
drag.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }));
drag.on("pan", function (event) {
  let target = event.target;
  if (isdrag == false) {
    isdrag = true;
    dragx = target.offsetLeft;
    dragy = target.offsetTop;
  }
  let x = event.deltaX + dragx;
  let y = event.deltaY + dragy;
  target.style.right = Math.abs(x) - 40 + "px";
  target.style.bottom = Math.abs(y) - 40 + "px";
  uiPanel.style.right = Math.abs(x) - 40 + "px";
  uiPanel.style.bottom = Math.abs(y) + 10 + "px";
  if (event.isFinal == true) {
    isdrag = false;
  }
});
UIROOT.appendChild(btnSwitcher);

window.onscroll = function () {
  if (IS_SHOW_PANEL == true) {
    IMAGES.CreateImages();
  }
};
