// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DELETION = exports.UPDATE = exports.PLACEMENT = exports.TAG_TEXT = exports.TAG_HOST = exports.TAG_ROOT = exports.ELEMENT_TEXT = void 0;
var ELEMENT_TEXT = Symbol.for("ELEMENT_TEXT");
exports.ELEMENT_TEXT = ELEMENT_TEXT;
var TAG_ROOT = Symbol.for("TAG_ROOT");
exports.TAG_ROOT = TAG_ROOT;
var TAG_HOST = Symbol.for("TAG_HOST");
exports.TAG_HOST = TAG_HOST;
var TAG_TEXT = Symbol.for("ELEMENT_TEXT"); // ???????????? 

exports.TAG_TEXT = TAG_TEXT;
var PLACEMENT = Symbol.for("PLACEMENT"); //????????????

exports.PLACEMENT = PLACEMENT;
var UPDATE = Symbol.for("UPDATE"); //????????????

exports.UPDATE = UPDATE;
var DELETION = Symbol.for("DELETION");
exports.DELETION = DELETION;
},{}],"unit.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setProps = setProps;

function setProps(dom, oldProps, newProps) {
  // for (let key in oldProps) {
  // }
  for (var key in newProps) {
    if (key !== 'children') {
      setProp(dom, key, newProps[key]);
    }
  }
}

function setProp(dom, key, value) {
  if (/^on/.test(key)) {
    dom[key.toLowerCase()] = value;
  } else if (key === 'style') {
    if (value) {
      for (var styleName in value) {
        dom.style[styleName] = value[styleName];
      }
    }
  } else {
    dom.setAttribute(key, value);
  }
}
},{}],"schedule.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

var _unit = require("./unit");

/**
 * ???????????? ??????????????????
 * ???????????? 
 * diff ???Reconiliation??? ?????? ??????????????????dom  ????????????  ?????? ????????? render ?????? ??????????????????????????? ????????? ?????? ???????????????dom ???
 * ????????????????????????????????? ????????????????????? ?????? ????????????????????? ??????????????????  ????????????effect list  ??????????????????????????? ????????????????????? ?????????????????????
 * 1. ?????? ??????dom ??????fiber ??? 2 ??????effect List
 * commit ?????? ??????dom ?????????????????? ????????????????????? ??????????????? ui ?????????
 */
var nextUnitOfWork = null; // ?????????fiber

var workInProgressRoot = null; //Rootfiber ??????

function scheduleRoot(rootFiber) {
  // {tag:TAG_ROOT,stateNode:container,props:{children:[element]}}
  workInProgressRoot = rootFiber;
  nextUnitOfWork = rootFiber;
}

function workLoop(deadLine) {
  // ????????????
  var shouldYield = false; // ????????????????????? ???????????????

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadLine.timeRemaining() < 1; // ????????????????????? ?????????????????? ?????? ?????????????????????
  }

  if (!nextUnitOfWork && workInProgressRoot) {
    // console.log("render????????????", workInProgressRoot)
    commitRoot();
  } else {
    requestIdleCallback(workLoop, {
      timeout: 500
    }); //  ???????????? ?????? ??????????????????????????????
  }
}

requestIdleCallback(workLoop, {
  timeout: 500
});

function commitRoot() {
  var currentFiber = workInProgressRoot.firstEffect;

  while (currentFiber) {
    commitWork(currentFiber);
    currentFiber = currentFiber.nextEffect;
  }

  workInProgressRoot = null;
}

function commitWork(currentFiber) {
  if (!currentFiber) return;
  var returnFiber = currentFiber.return;
  var returnDOM = returnFiber.stateNode;

  if (currentFiber.effectTag === _constants.PLACEMENT && returnDOM !== null && currentFiber.stateNode) {
    returnDOM.appendChild(currentFiber.stateNode);
  }

  currentFiber.effectTag = null;
}

function performUnitOfWork(currentFiber) {
  beginWork(currentFiber);

  if (currentFiber.child) {
    return currentFiber.child;
  }

  while (currentFiber) {
    completeUnitOfWork(currentFiber); // ???????????? ?????????????????? ?????????????????? ????????????????????? 

    if (currentFiber.sibling) {
      return currentFiber.sibling;
    }

    currentFiber = currentFiber.return; //????????????  ???????????????  ?????????????????????
  }
} // ????????? fiber ??????????????? ?????? fiber ???????????????????????? ?????????effect ???????????????effect list   ???????????????  effect list ????????????


function completeUnitOfWork(currentFiber) {
  var returnFiber = currentFiber.return;

  if (returnFiber) {
    ////??????????????????????????????effect ??? ??????????????????
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = currentFiber.firstEffect;
    }

    if (!!currentFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
      } else {
        returnFiber.lastEffect = currentFiber.lastEffect;
      }
    } //////////////////?????????
    // ?????????????????????????????????


    var effectTag = currentFiber.effectTag; // ??????effect fiber ??????????????? firstEffect ????????????????????????????????? effect fiber  lastEffect ?????????????????? ??????????????? ??? effect fiber
    // ????????????nextEffect ????????????????????? firstEffect = ?????????.nextEffect ?????????.nextEffect ?????????  lastEffect

    if (effectTag) {
      // ??????????????????
      if (returnFiber) {
        // A1 
        if (returnFiber.lastEffect) {
          returnFiber.lastEffect.nextEffect = currentFiber;
        } else {
          returnFiber.firstEffect = currentFiber;
        }

        returnFiber.lastEffect = currentFiber;
      }
    }
  }
}
/**
 * ??????????????????
 * 
 * completeUnitOfWork
 * @param {*} fiber 
 */


function beginWork(currentFiber) {
  // 1.??????dom ??????
  // 2. ?????????fiber
  if (currentFiber.tag === _constants.TAG_ROOT) {
    updateHostRoot(currentFiber);
  } else if (currentFiber.tag === _constants.TAG_TEXT) {
    updateHostText(currentFiber);
  } else if (currentFiber.tag === _constants.TAG_HOST) {
    updateHost(currentFiber);
  }
}

function updateHostRoot(currentFiber) {
  //???????????????
  // ????????????????????????????????????????????????????????????dom 2. ?????????fiber
  var newChildren = currentFiber.props.children;
  reconcilieChildren(currentFiber, newChildren); // ??????????????? [A1]
}

function updateHostText(currentFiber) {
  // ??????????????????
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = createDom(currentFiber);
  }
}

function updateHost(currentFiber) {
  // ????????????dom ??????
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = createDom(currentFiber);
  }

  reconcilieChildren(currentFiber, currentFiber.props.children);
}

function createDom(currentFiber) {
  // ??????fiber ???????????????dom
  if (currentFiber.tag === _constants.TAG_TEXT) {
    return document.createTextNode(currentFiber.props.text);
  } else if (currentFiber.tag === _constants.TAG_HOST) {
    var stateNode = document.createElement(currentFiber.type);
    updatDOM(stateNode, {}, currentFiber.props);
    return stateNode;
  }
}

function updatDOM(dom, oldProps, newProps) {
  (0, _unit.setProps)(dom, oldProps, newProps);
}

function reconcilieChildren(currentFiber, newChildren) {
  // ??????fiber  newchild ??????????????????dom  [A1]
  var newChildIndex = 0; // ?????????????????????

  var prevSibling; // ??????????????????fiber
  //????????????????????????dom ???????????? ???????????????dom??????fiber

  while (newChildIndex < newChildren.length) {
    var newChild = newChildren[newChildIndex]; // ????????????dom ?????? ????????????

    var tag = void 0;

    if (newChild.type === _constants.ELEMENT_TEXT) {
      tag = _constants.TAG_TEXT; // ????????????????????????
    } else if (typeof newChild.type === 'string') {
      tag = _constants.TAG_HOST; // ??????????????????dom??????
    } // beginWork??????fiber??? ???completeUnitOfWork ????????? ??????effect


    var newFiber = {
      tag: tag,
      type: newChild.type,
      props: newChild.props,
      stateNode: null,
      return: currentFiber,
      effectTag: _constants.PLACEMENT,
      // ??????????????? render ???????????????????????? 
      nextEffect: null // effect list ?????????????????????

    }; // ????????????  ??????????????? ??????sibling

    if (newFiber) {
      if (newChildIndex === 0) {
        // ?????????0 ???????????????  
        currentFiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }

      prevSibling = newFiber;
    }

    newChildIndex++;
  }
}

var _default = scheduleRoot;
exports.default = _default;
},{"./constants":"constants.js","./unit":"unit.js"}],"react-dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

var _schedule = _interopRequireDefault(require("./schedule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactDOM = {
  render: render
};
/**
 * ??????????????? ???????????????
 */

function render(element, container) {
  // container == root ??????dom
  console.log(element, "elementelement");
  var rootFiber = {
    tag: _constants.TAG_ROOT,
    //??????fiber ????????????tag  ?????? ???????????????
    stateNode: container,
    // ?????????????????????????????????????????????????????????stateNode????????????dom??????
    //props.children  ??????????????? ???????????????react ?????? ??????dom  ????????????????????? ??? ??????react ???????????? fiber
    props: {
      children: [element]
    } //??????filer ???children ?????????????????????????????? ?????????fiber ????????????filer  

  };
  console.log(rootFiber, "elementelement");
  (0, _schedule.default)(rootFiber);
}

var _default = ReactDOM;
exports.default = _default;
},{"./constants":"constants.js","./schedule":"schedule.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _reactDom = _interopRequireDefault(require("./react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import React from './react';
// console.log(React.createElement)
var style = {
  border: '3px solid red',
  margin: '5px'
};
var element = React.createElement("div", {
  id: "A1",
  style: style
}, "A1", React.createElement("div", {
  id: "B1",
  style: style
}, "B1", React.createElement("div", {
  id: "C1",
  style: style
}, "C1"), React.createElement("div", {
  id: "C2",
  style: style
}, "C2")), React.createElement("div", {
  id: 'B2',
  style: style
}, "B2"));
console.log(element, "element");

_reactDom.default.render(element, document.getElementById('root'));
},{"./react-dom":"react-dom.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61961" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ??? Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] ????  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">????</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.js.map