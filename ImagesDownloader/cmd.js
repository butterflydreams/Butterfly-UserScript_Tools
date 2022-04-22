const fs = require("fs");

const SCRIPT = "ImagesDownloader.user.js";
const STYLE = "style.css";
const FILE = `(butterfly)${SCRIPT}`;

let style = fs.readFileSync(STYLE, "utf8");

let script = fs.readFileSync(SCRIPT, "utf-8");
script = script.replace('GM_addStyle(GM_getResourceText("Style"));', "");

let file = `// ==UserScript==
// @name         Butterfly丶ImagesDownloader
// @namespace    https://www.butterfly.pink
// @version      2022.04.18
// @description  Download all images on a Webpage one key.
// @author       Butterfly
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";
  let style = \`${style}\`;
  GM_addStyle(style);
  ${script}
})();
`;

fs.writeFile(FILE, file, function (err) {
  if (err) throw err;
  console.log(`==>【${FILE}】 is created successfully.`);
});
