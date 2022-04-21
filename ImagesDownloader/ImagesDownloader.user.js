GM_addStyle(GM_getResourceText("Style"));

class Image {
  constructor(unid, ui, elparent) {
    this._unid = unid;
    this._isselect = true;
    this._timer = null;
    this._time = 0;
    this._x = 0;
    this._y = 0;
    this._ui = ui;
    this._el = {};
    this._el.root = document.createElement("div");
    this._el.root.setAttribute("tag", this._unid);
    this._el.root.setAttribute("class", "item-image");
    this._el.root.setAttribute("href", "javascript:void(0)");
    if ("ontouchstart" in document.documentElement) {
      this._el.root.ontouchstart = this._OnEventStart.bind(this, true);
    } else {
      this._el.root.onmousedown = this._OnEventStart.bind(this, false);
    }
    if ("ontouchmove" in document.documentElement) {
      this._el.root.ontouchmove = this._OnEventMove.bind(this, false);
    } else {
      this._el.root.onmousemove = this._OnEventMove.bind(this, true);
    }
    if ("ontouchend" in document.documentElement) {
      this._el.root.ontouchend = this._OnEventEnd.bind(this);
    } else {
      this._el.root.onmouseup = this._OnEventEnd.bind(this);
    }
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

  _OnEventStart(istouch, event) {
    this._x = istouch == true ? event.touches[0].clientX : event.clientX;
    this._y = istouch == true ? event.touches[0].clientY : event.clientY;
    this._time = 0;
    this._timer = setInterval(() => {
      this._time += 20;
    }, 20);
  }
  _OnEventMove(istouch, event) {
    let x = istouch == true ? event.touches[0].clientX : event.clientX;
    let y = istouch == true ? event.touches[0].clientY : event.clientY;
    let distance = Math.sqrt(Math.pow(x - this._x, 2) + Math.pow(y - this._y, 2));
    if (distance > 10) {
      clearInterval(this._timer);
      this._time = 0;
      this._timer = null;
      this._x = 0;
      this._y = 0;
    }
  }
  _OnEventEnd() {
    if (this._timer != null) {
      if (this._time >= 200) {
        // On long press event.
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
      } else {
        // On single click event.
        this._isselect = !this._isselect;
        this._el.root.style.border = this._isselect == true ? "solid 2px #ff0000" : "none";
        this._el.select.style.backgroundColor = this._isselect == true ? "#00ff00" : "#a9a9a9";
      }
      clearInterval(this._timer);
      this._time = 0;
      this._timer = null;
      this._x = 0;
      this._y = 0;
    }
  }
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
UIROOT.appendChild(btnSwitcher);

window.onscroll = function () {
  if (IS_SHOW_PANEL == true) {
    IMAGES.CreateImages();
  }
};
