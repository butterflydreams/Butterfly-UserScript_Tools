GM_addStyle(GM_getResourceText("Style"));

class UIImage {
  constructor(unid, ui, elparent) {
    this.Add(unid, ui, elparent);
  }

  Add(unid, ui, elparent) {
    this._unid = unid;
    this._isselect = true;
    this._ui = ui;
    this._el = {};
    this._el.root = document.createElement("a");
    this._el.root.setAttribute("tag", this._unid);
    this._el.root.setAttribute("class", "item-image");
    this._el.root.setAttribute("href", "javascript:void(0)");
    this._gesture = new Hammer.Manager(this._el.root);
    this._gesture.add(new Hammer.Tap({ event: "tripletap", taps: 3 }));
    this._gesture.add(new Hammer.Tap({ event: "doubletap", taps: 2 }));
    this._gesture.add(new Hammer.Tap({ event: "singletap", taps: 1 }));
    this._gesture.add(new Hammer.Press({ event: "press" }));
    this._gesture.get("tripletap").recognizeWith("doubletap");
    this._gesture.get("tripletap").recognizeWith("singletap");
    this._gesture.get("doubletap").recognizeWith("singletap");
    this._gesture.get("singletap").requireFailure("tripletap");
    this._gesture.get("singletap").requireFailure("doubletap");
    this._gesture.get("doubletap").requireFailure("tripletap");
    this._gesture.on("singletap", this._OnClickHandler.bind(this));
    this._gesture.on("doubletap", this._OnDoubleclickHandler.bind(this));
    this._gesture.on("tripletap", this._OnTripleclickHandler.bind(this));
    this._gesture.on("press", this._OnPressHandler.bind(this));
    elparent.appendChild(this._el.root);
    this._el.icon = document.createElement("img");
    this._el.icon.setAttribute("tag", "ui-mydownloader");
    this._el.icon.setAttribute("class", "ico-image");
    this._el.icon.setAttribute("src", this._ui.src);
    this._el.root.appendChild(this._el.icon);
    this._el.link = document.createElement("div");
    this._el.link.setAttribute("class", "txt-link");
    this._el.link.innerText = this._ui.src;
    this._el.root.appendChild(this._el.link);
  }

  Remove() {
    this._ui.removeAttribute("tag");
    this._el.root.remove();
  }

  _OnClickHandler(event) {
    if (IS_EDIT_MODE == true) {
      // Selecting.
      this._isselect = !this._isselect;
      this._el.root.style.border = this._isselect == true ? "solid 2px #ff0000" : "none";
    } else {
      // Scrolling.
      let offset = this._ui.getBoundingClientRect().top - this._ui.getBoundingClientRect().height + window.scrollY;
      let position = offset > 0 ? offset : 0;
      window.scrollTo({
        top: position,
        behavior: "smooth"
      });
      let isreach = true;
      function OnReach() {
        this._ui.style.animation = "none";
        if (isreach == true && Math.abs(window.scrollY - position) <= 1) {
          this._ui.style.animation = "ani-scrollto 1000ms";
          isreach = false;
        }
      }
      OnReach.bind(this)();
      window.onscroll = OnReach.bind(this);
    }
  }
  _OnDoubleclickHandler(event) {
    if (IS_EDIT_MODE == true) {
    } else {
      // Previewing.
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
  }
  _OnTripleclickHandler(event) {
    console.log("On triple clicking!");
  }
  _OnPressHandler(event) {
    console.log("On pressing!");
  }
}

class UIImages {
  constructor(elparent) {
    this._data = new Map();
    this._el = document.createElement("div");
    this._el.setAttribute("class", "list-images");
    elparent.appendChild(this._el);
  }

  static GetInstance(elparent) {
    if (!this._instance) {
      this._instance = new UIImages(elparent);
    }
    return this._instance;
  }

  CreateUIImages() {
    let images = document.getElementsByTagName("img");
    Array.from(images).forEach((image) => {
      if ("getAttribute" in image && !image.getAttribute("tag")) {
        let img = new Image();
        img.src = image.src;
        img.onload = () => {
          if (img.fileSize > 0 || (img.width > 0 && img.height > 0)) {
            let unid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
              let dt = new Date().getTime();
              let r = (dt + Math.random() * 16) % 16 | 0;
              dt = Math.floor(dt / 16);
              return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
            });
            image.setAttribute("tag", unid);
            this._data.set(unid, new UIImage(unid, image, this._el));
          }
        };
      }
    });
  }

  DestroyUIImages() {
    this._data.forEach((value, key) => {
      value.Remove();
    });
    this._data.clear();
  }
}

var IS_EDIT_MODE = false;
var IS_SHOW_PANEL = false;
var UIROOT = document.createElement("div");
UIROOT.setAttribute("class", "ui-imagesdownloader");
document.body.appendChild(UIROOT);
let uiPanel = document.createElement("div");
uiPanel.setAttribute("class", "ui-panel");
uiPanel.style.display = IS_SHOW_PANEL == true ? "block" : "none";
UIROOT.appendChild(uiPanel);
let uiControllers = document.createElement("div");
uiControllers.setAttribute("class", "ui-controllers");
uiPanel.appendChild(uiControllers);
let btnEdit = document.createElement("a");
btnEdit.setAttribute("class", "btn-edit");
btnEdit.setAttribute("href", "javascript:void(0)");
btnEdit.innerText = "Edit";
btnEdit.onclick = function () {
  IS_EDIT_MODE = !IS_EDIT_MODE;
  btnEdit.innerText = IS_EDIT_MODE == true ? "Unedit" : "Edit";
};
uiControllers.appendChild(btnEdit);
let btnSetting = document.createElement("a");
btnSetting.setAttribute("class", "btn-setting");
btnSetting.setAttribute("href", "javascript:void(0)");
btnSetting.innerText = "Setting";
btnSetting.onclick = function () {
  console.log("On setting!");
};
uiControllers.appendChild(btnSetting);
let btnDownload = document.createElement("a");
btnDownload.setAttribute("class", "btn-download");
btnDownload.setAttribute("href", "javascript:void(0)");
btnDownload.innerText = "Download";
btnDownload.onclick = function () {
  console.log("On download!");
};
uiControllers.appendChild(btnDownload);
var UIIMAGES = UIImages.GetInstance(uiPanel);
let btnSwitcher = document.createElement("a");
btnSwitcher.setAttribute("class", "btn-switcher");
btnSwitcher.setAttribute("href", "javascript:void(0)");
btnSwitcher.innerText = IS_SHOW_PANEL == true ? "Hide" : "Show";
btnSwitcher.onclick = function () {
  IS_SHOW_PANEL = !IS_SHOW_PANEL;
  btnSwitcher.innerText = IS_SHOW_PANEL == true ? "Hide" : "Show";
  uiPanel.style.display = IS_SHOW_PANEL == true ? "block" : "none";
  if (IS_SHOW_PANEL == true) {
    UIIMAGES.CreateUIImages();
  } else {
    UIIMAGES.DestroyUIImages();
  }
};
let dragx = 0;
let dragy = 0;
let offset = 50; // Offset bottom between uiPanel and btnSwitcher.
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
  let w = target.offsetWidth;
  let h = target.offsetHeight;
  target.style.right = `${Math.abs(x) - w}px`;
  target.style.bottom = `${Math.abs(y) - h}px`;
  uiPanel.style.right = `${Math.abs(x) - w}px`;
  uiPanel.style.bottom = `${Math.abs(y) - h + offset}px`;
  if (event.isFinal == true) {
    isdrag = false;
  }
});
UIROOT.appendChild(btnSwitcher);

window.onscroll = function () {
  if (IS_SHOW_PANEL == true) {
    UIIMAGES.CreateUIImages();
  }
};
