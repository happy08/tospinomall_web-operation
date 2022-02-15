module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "3e6d");
/******/ })
/************************************************************************/
/******/ ({

/***/ "3e6d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "Print", function() { return /* reexport */ Print; });
__webpack_require__.d(__webpack_exports__, "DirPrint", function() { return /* reexport */ DirPrint; });

// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@4.5.12@@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("79e4")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./print/packages/printarea.js
/* harmony default export */ var printarea = (class {
  constructor(option) {
    this.standards = {
      strict: 'strict',
      loose: 'loose',
      html5: 'html5'
    };
    this.selectArray = []; // 存储select的

    this.counter = 0;
    this.settings = {
      standard: this.standards.html5,
      extraHead: '',
      // 附加在head标签上的额外元素,使用逗号分隔
      extraCss: '',
      // 额外的css逗号分隔
      popTitle: '',
      // 标题
      endCallback: null,
      // 成功打开后的回调函数
      ids: '' // 局部打印的id

    };
    Object.assign(this.settings, option);
    this.init();
  }

  init() {
    this.counter++;
    this.settings.id = `printArea_${this.counter}`;
    let PrintAreaWindow = this.getPrintWindow(); // 创建iframe

    this.write(PrintAreaWindow.doc); // 写入内容

    this.print(PrintAreaWindow);
    this.settings.endCallback();
  }

  loadWindow(iframeWin = window, callback) {
    if (iframeWin.ActiveXObject) {
      iframeWin.onload = callback();
    } else if (iframeWin.addEventListener) {
      iframeWin.addEventListener('load', callback, false);
    } else if (iframeWin.attachEvent) {
      iframeWin.attachEvent('onload', callback);
    } else {
      iframeWin.onload = new function () {
        callback();
      }();
    }
  }

  print() {
    let iframe = document.getElementById(this.settings.id);
    let iframeWin = document.getElementById(this.settings.id).contentWindow;

    const _loaded = () => {
      iframeWin.focus();
      iframeWin.print();

      try {
        let canvasList = this.elsdom.querySelectorAll('.canvasImg');

        for (let i = 0; i < canvasList.length; i++) {
          let _parent = canvasList[i].parentNode;

          _parent.removeChild(canvasList[i]);
        }

        iframe.parentNode.removeChild(iframe);
      } catch (e) {
        console.log(e);
      }
    };

    setTimeout(() => {
      this.loadWindow(iframeWin, _loaded());
    });
  }

  write(PADocument) {
    PADocument.open();
    PADocument.write(`${this.docType()}<html>${this.getHead()}${this.getBody()}</html>`);
    PADocument.close();
  }

  docType() {
    if (this.settings.standard === this.standards.html5) {
      return '<!DOCTYPE html>';
    }

    var transitional = this.settings.standard === this.standards.loose ? ' Transitional' : '';
    var dtd = this.settings.standard === this.standards.loose ? 'loose' : 'strict';
    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
  }

  getHead() {
    let extraHead = '';
    let links = '';
    let style = '';

    if (this.settings.extraHead) {
      this.settings.extraHead.replace(/([^,]+)/g, m => {
        extraHead += m;
      });
    } // 复制所有link标签


    [].forEach.call(document.querySelectorAll('link'), function (item) {
      if (item.href.indexOf('.css') >= 0) {
        links += `<link type="text/css" rel="stylesheet" href="${item.href}" >`;
      }
    }); // 循环获取style标签的样式

    let domStyle = document.styleSheets;

    if (domStyle && domStyle.length > 0) {
      for (let i = 0; i < domStyle.length; i++) {
        try {
          if (domStyle[i].cssRules || domStyle[i].rules) {
            let rules = domStyle[i].cssRules || domStyle[i].rules;

            for (let b = 0; b < rules.length; b++) {
              style += rules[b].cssText;
            }
          }
        } catch (e) {
          console.log(domStyle[i].href + e);
        }
      }
    }

    if (this.settings.extraCss) {
      this.settings.extraCss.replace(/([^,\s]+)/g, m => {
        links += `<link type="text/css" rel="stylesheet" href="${m}">`;
      });
    }

    return `<head><title>${this.settings.popTitle}</title>${extraHead}${links}<style type="text/css">${style}</style></head>`;
  }

  getBody() {
    if (typeof this.settings.ids === 'string') {
      let ids = this.settings.ids;
      ids = ids.replace(new RegExp("#", "g"), '');
      this.elsdom = this.beforeHanler(document.getElementById(ids));
    } else if (typeof this.settings.ids === 'object') {
      this.elsdom = this.beforeHanler(this.settings.ids);
    }

    let ele = this.getFormData(this.elsdom);
    let htm = ele.outerHTML;
    return '<body>' + htm + '</body>';
  } // 克隆节点之前做的操作


  beforeHanler(elsdom) {
    let canvasList = elsdom.querySelectorAll('canvas'); // canvas转换png图片

    for (let i = 0; i < canvasList.length; i++) {
      if (!canvasList[i].style.display) {
        let _parent = canvasList[i].parentNode;

        let _canvasUrl = canvasList[i].toDataURL('image/png');

        let _img = new Image();

        _img.className = 'canvasImg';
        _img.style.display = 'none';
        _img.src = _canvasUrl; // _parent.replaceChild(_img, canvasList[i])

        _parent.appendChild(_img);
      }
    }

    return elsdom;
  } // 根据type去处理form表单


  getFormData(ele) {
    let copy = ele.cloneNode(true);
    let copiedInputs = copy.querySelectorAll('input,select,textarea');
    let canvasImgList = copy.querySelectorAll('.canvasImg,canvas');
    let selectCount = -1; // 处理所有canvas

    for (let i = 0; i < canvasImgList.length; i++) {
      let _parent = canvasImgList[i].parentNode;
      let item = canvasImgList[i]; // 删除克隆后的canvas节点

      if (item.tagName.toLowerCase() === 'canvas') {
        _parent.removeChild(item);
      } else {
        item.style.display = 'block';
      }
    } // 处理所有输入框


    for (let i = 0; i < copiedInputs.length; i++) {
      let item = copiedInputs[i];
      let typeInput = item.getAttribute('type');
      let copiedInput = copiedInputs[i]; // 获取select标签

      if (!typeInput) {
        typeInput = item.tagName === 'SELECT' ? 'select' : item.tagName === 'TEXTAREA' ? 'textarea' : '';
      } // 处理input框


      if (item.tagName === 'INPUT') {
        // 除了单选框 多选框比较特别
        if (typeInput === 'radio' || typeInput === 'checkbox') {
          if (item.checked) {
            copiedInput.setAttribute('checked', item.checked);
          }
        } else {
          copiedInput.value = item.value;
          copiedInput.setAttribute('value', item.value);
        } // 处理select

      } else if (typeInput === 'select') {
        selectCount++;

        for (let b = 0; b < ele.querySelectorAll('select').length; b++) {
          let select = ele.querySelectorAll('select')[b]; // 获取原始层每一个select

          !select.getAttribute('newbs') && select.setAttribute('newbs', b); // 添加标识

          if (select.getAttribute('newbs') == selectCount) {
            let opSelectedIndex = ele.querySelectorAll('select')[selectCount].selectedIndex;
            item.options[opSelectedIndex].setAttribute('selected', true);
          }
        } // 处理textarea

      } else {
        copiedInput.innerHTML = item.value;
        copiedInput.setAttribute('html', item.value);
      }
    }

    return copy;
  }

  getPrintWindow() {
    var f = this.Iframe();
    return {
      f: f,
      win: f.contentWindow || f,
      doc: f.doc
    };
  }

  Iframe() {
    let frameId = this.settings.id;
    let iframe; // let that = this

    try {
      iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      iframe.style.border = '0px';
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.right = '0px';
      iframe.style.top = '0px';
      iframe.setAttribute('id', frameId);
      iframe.setAttribute('src', new Date().getTime());
      iframe.doc = null;
      iframe.doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow ? iframe.contentWindow.document : iframe.document;
    } catch (e) {
      throw new Error(e + '. iframes may not be supported in this browser.');
    }

    if (iframe.doc == null) {
      throw new Error('Cannot find document.');
    }

    return iframe;
  }

});
// CONCATENATED MODULE: ./print/packages/print.js


function func(el, binding) {
  let obj = {};
  let localPrint = funcPrint();
  el.addEventListener('click', () => {
    if (typeof binding.value === 'string') {
      obj = {
        id: binding.value
      };
    } else if (typeof binding.value === 'object' && !!binding.value.id) {
      if (typeof binding.value.id === 'string') {
        obj = binding.value; // let ids = id.id.replace(new RegExp("#", "g"), '');

        let elsdom = document.querySelector(obj.id);
        if (!elsdom) console.log("id in Error"), obj = {};
      } else if (typeof binding.value.id === 'object') {
        obj = binding.value;
      }
    }

    if (obj.id) localPrint(obj); // 局部打印
    else window.print(); // 直接全局打印
  });
}

const funcPrint = () => {
  let close = true;
  return function (obj) {
    if (typeof obj === 'object') {
      var {
        id,
        standard,
        extraHead,
        extraCss,
        popTitle,
        endCallback
      } = obj;
    }

    if (close) {
      close = false;
      new printarea({
        ids: id || obj,
        // * 局部打印必传入id
        standard: standard || '',
        // 文档类型，默认是html5，可选 html5，loose，strict
        extraHead: extraHead || '',
        // 附加在head标签上的额外标签,使用逗号分隔
        extraCss: extraCss || '',
        // 额外的css连接，多个逗号分开
        popTitle: popTitle || '',

        // title的标题
        endCallback() {
          // 调用打印之后的回调事件
          if (typeof endCallback === 'function') endCallback();
          close = true;
        }

      });
    }
  };
};
const directivePrint = () => ({
  directiveName: 'print',

  mounted(el, binding) {
    func(el, binding);
  },

  inserted(el, binding) {
    func(el, binding);
  }

});
// CONCATENATED MODULE: ./print/index.js

/**
 * 函数调用打印
 * 
 * @param {Object} obj {id:dom对象或id, standard：文档类型,extraHead：head上的额外标签,extraCss：额外的css连接,popTitle：标题}
 * 
 */

const Print = funcPrint();
const DirPrint = directivePrint();
/* harmony default export */ var print = ({
  install(App) {
    App.directive('print', DirPrint);
    if (/^3/.test(App.version)) App.config.globalProperties.$print = funcPrint();
    if (/^2/.test(App.version)) App.prototype.$print = Print;
  }

});
// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@4.5.12@@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (print);



/***/ }),

/***/ "79e4":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ })

/******/ });
//# sourceMappingURL=index.common.js.map