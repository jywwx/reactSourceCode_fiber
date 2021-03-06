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
exports.DELETION = exports.UPDATE = exports.PLACEMENT = exports.TAG_FUNCTION_COMPONENT = exports.TAG_CLASS = exports.TAG_TEXT = exports.TAG_HOST = exports.TAG_ROOT = exports.ELEMENT_TEXT = void 0;
var ELEMENT_TEXT = Symbol.for("ELEMENT_TEXT");
exports.ELEMENT_TEXT = ELEMENT_TEXT;
var TAG_ROOT = Symbol.for("TAG_ROOT");
exports.TAG_ROOT = TAG_ROOT;
var TAG_HOST = Symbol.for("TAG_HOST");
exports.TAG_HOST = TAG_HOST;
var TAG_TEXT = Symbol.for("ELEMENT_TEXT"); //??????????????????

exports.TAG_TEXT = TAG_TEXT;
var TAG_CLASS = Symbol.for("TAG_CLASS"); // ?????????????????????

exports.TAG_CLASS = TAG_CLASS;
var TAG_FUNCTION_COMPONENT = Symbol.for("TAG_FUNCTION_COMPONENT"); // ???????????? 

exports.TAG_FUNCTION_COMPONENT = TAG_FUNCTION_COMPONENT;
var PLACEMENT = Symbol.for("PLACEMENT"); //????????????

exports.PLACEMENT = PLACEMENT;
var UPDATE = Symbol.for("UPDATE"); //????????????

exports.UPDATE = UPDATE;
var DELETION = Symbol.for("DELETION");
exports.DELETION = DELETION;
},{}],"UpdateQuenu.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateQueue = exports.Update = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Update = function Update(payload) {
  _classCallCheck(this, Update);

  this.payload = payload;
}; // UpdataQuenu ?????????????????????????????????


exports.Update = Update;

var UpdateQueue = /*#__PURE__*/function () {
  function UpdateQueue() {
    _classCallCheck(this, UpdateQueue);

    this.firstUpdate = null;
    this.lastUpdate = null;
  }

  _createClass(UpdateQueue, [{
    key: "enqueueUpdate",
    value: function enqueueUpdate(update) {
      if (this.lastUpdate === null) {
        this.firstUpdate = this.lastUpdate = update;
      } else {
        this.lastUpdate.nextUpdate = update;
        this.lastUpdate = update;
      }
    }
  }, {
    key: "forceUpdate",
    value: function forceUpdate(state) {
      var currentUpdate = this.firstUpdate;

      while (currentUpdate) {
        var nextState = typeof currentUpdate.payload === 'function' ? currentUpdate.payload(state) : currentUpdate.payload;
        state = _objectSpread(_objectSpread({}, state), nextState);
        currentUpdate = currentUpdate.nextUpdate;
      }

      this.firstUpdate = this.lastUpdate = null;
      return state;
    }
  }]);

  return UpdateQueue;
}();

exports.UpdateQueue = UpdateQueue;
},{}],"unit.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setProps = setProps;

function setProps(dom, oldProps, newProps) {
  for (var key in oldProps) {
    if (key !== 'children') {
      if (newProps.hasOwnProperty(key)) {
        setProp(dom, key, newProps[key]);
      } else {
        dom.removeAttribute(key);
      }
    }
  }

  for (var _key in newProps) {
    if (_key !== 'children') {
      if (!oldProps.hasOwnProperty(_key)) {
        setProp(dom, _key, newProps[_key]);
      }
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
},{}],"scheduler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scheduleRoot = scheduleRoot;
exports.useReducer = useReducer;

var _constants = require("./constants");

var _UpdateQuenu = require("./UpdateQuenu");

var _unit = require("./unit");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var nextUnitOfWork = null; // ?????????fiber

var workInProgressRoot = null; //Rootfiber ??????

var currentRoot = null; //?????????????????? ?????????rootRlber

var workInProgressFiber = null; // ??????????????????fiber

var hookIndex = 0; // hooks ??????

var deletion = []; // ??????????????? ?????????effect list  ??????????????? ????????????

function scheduleRoot(rootFiber) {
  // {tag:TAG_ROOT,stateNode:container,props:{children:[element]}}
  if (currentRoot && currentRoot.alternate) {
    // ????????????????????????
    workInProgressRoot = currentRoot.alternate;

    if (rootFiber) {
      workInProgressRoot.props = rootFiber.props;
    }

    workInProgressRoot.alternate = currentRoot;
    console.log('?????????????????????', workInProgressRoot);
  } else if (currentRoot) {
    // ??????currentRoot??????  ???????????????????????????  
    if (rootFiber) {
      rootFiber.alternate = currentRoot;
      workInProgressRoot = rootFiber;
    } else {
      workInProgressRoot = _objectSpread(_objectSpread({}, currentRoot), {}, {
        alternate: currentRoot
      });
    }

    console.log('???????????????', workInProgressRoot);
  } else {
    // ????????????????????????
    console.log('???????????????', rootFiber);
    workInProgressRoot = rootFiber;
  }

  nextUnitOfWork = workInProgressRoot;
  workInProgressRoot.firstEffect = workInProgressRoot.lastEffect = workInProgressRoot.nextEffect = null;
  requestIdleCallback(workLoop, {
    timeout: 500
  });
}

function workLoop(deadLine) {
  // ????????????
  var shouldYield = false; // ????????????????????? ???????????????

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadLine.timeRemaining() < 1; // ????????????????????? ?????????????????? ?????? ?????????????????????
  }

  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot();
  } else {
    requestIdleCallback(workLoop, {
      timeout: 500
    }); //  ???????????? ?????? ??????????????????????????????
  }
} //**commit ?????? */


function commitRoot() {
  deletion.forEach(commitWork); // ??????effect list  ??????????????????????????? ??????

  var currentFiber = workInProgressRoot.firstEffect;

  while (currentFiber) {
    commitWork(currentFiber);
    currentFiber = currentFiber.nextEffect;
  }

  deletion.length = 0; // ???????????? ??????deletion??????

  currentRoot = workInProgressRoot; // ???????????????????????????fiber?????????currentFiber

  workInProgressRoot = null;
}

function commitWork(currentFiber) {
  if (!currentFiber) {
    return;
  }

  var returnFiber = currentFiber.return;

  while (returnFiber.tag !== _constants.TAG_HOST && returnFiber.tag !== _constants.TAG_ROOT && returnFiber.tag !== _constants.TAG_TEXT) {
    returnFiber = returnFiber.return;
  }

  var returnDOM = returnFiber.stateNode;

  if (currentFiber.effectTag === _constants.PLACEMENT) {
    // ??????????????? ?????????dom ?????? ??????????????? Fiber ????????????????????? ?????? ?????????????????????dom ????????????
    if (currentFiber.tag === _constants.TAG_CLASS) {
      return;
    }

    var nextFiber = currentFiber;

    while (nextFiber.tag !== _constants.TAG_HOST && nextFiber.tag !== _constants.TAG_TEXT) {
      nextFiber = currentFiber.child;
    }

    returnDOM.appendChild(nextFiber.stateNode);
  } else if (currentFiber.effectTag === _constants.DELETION) {
    return commitDeletion(currentFiber, returnDOM);
  } else if (currentFiber.effectTag === _constants.UPDATE) {
    if (currentFiber.type === _constants.ELEMENT_TEXT) {
      if (currentFiber.alternate.props.text !== currentFiber.props.text) {
        currentFiber.stateNode.textContent = currentFiber.props.text;
      }
    } else {
      updatDOM(currentFiber.stateNode, currentFiber.alternate.props, currentFiber.props);
    }
  }

  currentFiber.effectTag = null;
}

function commitDeletion(currentFiber, domReturn) {
  if (currentFiber.tag === _constants.TAG_HOST || currentFiber.tag === _constants.TAG_TEXT) {
    domReturn.removeChild(currentFiber.stateNode);
  } else {
    commitDeletion(currentFiber.child, domReturn);
  }
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
      }

      returnFiber.lastEffect = currentFiber.lastEffect;
    } //////////////////?????????
    // ?????????????????????????????????
    // ??????effect fiber ??????????????? firstEffect ????????????????????????????????? effect fiber  lastEffect ?????????????????? ??????????????? ??? effect fiber
    // ????????????nextEffect ????????????????????? firstEffect = ?????????.nextEffect ?????????.nextEffect ?????????  lastEffect


    if (currentFiber.effectTag) {
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
    //?????????fiber
    updateHostRoot(currentFiber);
  } else if (currentFiber.tag === _constants.TAG_TEXT) {
    //??????fiber
    updateHostText(currentFiber);
  } else if (currentFiber.tag === _constants.TAG_HOST) {
    //??????domfiber
    updateHost(currentFiber);
  } else if (currentFiber.tag === _constants.TAG_CLASS) {
    // ?????????fiber
    updateClassComponent(currentFiber);
  } else if (currentFiber.tag === _constants.TAG_FUNCTION_COMPONENT) {
    // ????????????fiber
    updateFunctionComponent(currentFiber);
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

function updateClassComponent(currentFiber) {
  // ???????????????
  if (!currentFiber.stateNode) {
    //????????????fiber ??? stateNode  ??????????????????
    currentFiber.stateNode = new currentFiber.type(currentFiber.props);
    currentFiber.stateNode.internalFiber = currentFiber;
    currentFiber.updateQueue = new _UpdateQuenu.UpdateQueue();
  } // ?????????????????????state ??????


  currentFiber.stateNode.state = currentFiber.updateQueue.forceUpdate(currentFiber.stateNode.state);
  reconcilieChildren(currentFiber, [currentFiber.stateNode.render()]);
}

function updateFunctionComponent(currentFiber) {
  // ??????????????????
  workInProgressFiber = currentFiber;
  hookIndex = 0;
  workInProgressFiber.hooks = [];
  var newChild = currentFiber.type(currentFiber.props);
  reconcilieChildren(currentFiber, [newChild]);
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
  if (dom && dom.setAttribute) (0, _unit.setProps)(dom, oldProps, newProps);
}

function reconcilieChildren(currentFiber, newChildren) {
  // ??????fiber  newchild ??????????????????dom  [A1]
  var newChildIndex = 0; // ?????????????????????

  var prevSibling; // ??????????????????fiber
  // ?????????currentFiber ???alternate ?????? currentFiber.alternate ???child ??????

  var oldFiber = currentFiber.alternate && currentFiber.alternate.child;
  if (oldFiber) oldFiber.firstEffect = oldFiber.lastEffect = oldFiber.nextEffect = null; //????????????????????????dom ???????????? ???????????????dom??????fiber

  while (newChildIndex < newChildren.length || oldFiber) {
    var newChild = newChildren[newChildIndex]; // ????????????dom ?????? ????????????

    var newFiber = void 0; // ??????fiber

    var sameType = oldFiber && newChild && oldFiber.type === newChild.type;
    var tag = void 0;

    if (newChild && typeof newChild.type === 'function' && newChild.type.prototype.isReactComponent) {
      tag = _constants.TAG_CLASS;
    } else if (newChild && typeof newChild.type === 'function') {
      tag = _constants.TAG_FUNCTION_COMPONENT;
    } else if (newChild && newChild.type === _constants.ELEMENT_TEXT) {
      tag = _constants.TAG_TEXT; // ????????????????????????
    } else if (newChild && typeof newChild.type === 'string') {
      tag = _constants.TAG_HOST; // ??????????????????dom??????
    } // beginWork??????fiber??? ???completeUnitOfWork ????????? ??????effect


    if (sameType) {
      // ?????????fiber ???????????????dom ????????? ??????  ??????????????????dom ?????? ??????dom ??????????????????
      if (oldFiber.alternate) {
        // ?????????????????????????????????
        newFiber = oldFiber.alternate; // ???????????? ?????????fiber  ??????????????? ????????? ??????????????? currentFiber.alternate.alternate

        newFiber.props = newChild.props;
        newFiber.alternate = oldFiber;
        newFiber.effectTag = _constants.UPDATE;
        newFiber.updateQueue = oldFiber.updateQueue || new _UpdateQuenu.UpdateQueue();
        newFiber.nextEffect = null;
      } else {
        newFiber = {
          tag: oldFiber.tag,
          type: oldFiber.type,
          props: newChild.props,
          // ????????????????????????dom ???props
          stateNode: oldFiber.stateNode,
          updateQueue: oldFiber.updateQueue || new _UpdateQuenu.UpdateQueue(),
          return: currentFiber,
          alternate: oldFiber,
          //??????fiber ???alternate ????????????fiber
          effectTag: _constants.UPDATE,
          // ??????????????? render ???????????????????????? 
          nextEffect: null // effect list ????????????????????? 

        };
      }
    } else {
      if (newChild) {
        //??????????????????dom ????????????null
        newFiber = {
          tag: tag,
          type: newChild.type,
          props: newChild.props,
          stateNode: null,
          return: currentFiber,
          updateQueue: new _UpdateQuenu.UpdateQueue(),
          effectTag: _constants.PLACEMENT,
          // ??????????????? render ???????????????????????? 
          nextEffect: null // effect list ?????????????????????

        };
      }

      if (oldFiber) {
        oldFiber.effectTag = _constants.DELETION;
        deletion.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling; //oldFiber????????????????????????
    } // ????????????  ??????????????? ??????sibling


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

function useReducer(reducer, initalValue) {
  var newHook = workInProgressFiber.alternate && workInProgressFiber.alternate.hooks && workInProgressFiber.alternate.hooks[hookIndex];

  if (newHook) {
    // ????????? ??????????????????????????? ????????????
    newHook.state = newHook.updateQueue.forceUpdate(newHook.state);
  } else {
    newHook = {
      state: initalValue,
      updateQueue: new _UpdateQuenu.UpdateQueue()
    };
  }

  var dispatch = function dispatch(action) {
    var payload = reducer ? new _UpdateQuenu.Update(reducer(newHook.state, action)) : action;
    newHook.updateQueue.enqueueUpdate(payload);
    scheduleRoot();
  };

  workInProgressFiber.hooks[hookIndex++] = newHook;
  return [newHook.state, dispatch];
}
},{"./constants":"constants.js","./UpdateQuenu":"UpdateQuenu.js","./unit":"unit.js"}],"react.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

var _UpdateQuenu = require("./UpdateQuenu");

var _scheduler = require("./scheduler");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * ??????????????????dom ?????????
 * @param {*} tag 
 * @param {*} props 
 * @param  {...any} children 
 */
function createElement(type, config) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    props: _objectSpread(_objectSpread({}, config), {}, {
      children: children.map(function (child) {
        // ????????????  ?????????element ??????  ??????????????? ?????? ????????????  ???????????????????????????????????????
        return _typeof(child) === 'object' ? child : {
          type: _constants.ELEMENT_TEXT,
          props: {
            text: child,
            children: []
          }
        };
      })
    })
  };
}

var Component = /*#__PURE__*/function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props; // this.UpdataQuenu = new UpdataQuenu()
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(playload) {
      var update = new _UpdateQuenu.Update(playload); //UpdataQuenu ????????????????????????????????????fiber????????? internalFiber

      this.internalFiber.updateQueue.enqueueUpdate(update);
      (0, _scheduler.scheduleRoot)(); // ????????????????????????
    }
  }]);

  return Component;
}();

Component.prototype.isReactComponent = {};
var React = {
  createElement: createElement,
  Component: Component,
  useReducer: _scheduler.useReducer
};
var _default = React;
exports.default = _default;
},{"./constants":"constants.js","./UpdateQuenu":"UpdateQuenu.js","./scheduler":"scheduler.js"}],"react-dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

var _scheduler = require("./scheduler");

var ReactDOM = {
  render: render
};
/**
 * ??????????????? ???????????????
 */

function render(element, container) {
  // container == root ??????dom
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
  (0, _scheduler.scheduleRoot)(rootFiber);
}

var _default = ReactDOM;
exports.default = _default;
},{"./constants":"constants.js","./scheduler":"scheduler.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("./react"));

var _reactDom = _interopRequireDefault(require("./react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// ?????????????????????
// userState ?????????????????? ?????????useReducer?????????  ??????userReducer
// class ClassCounter extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       number:0
//     }
//   }
//   onClick = () => {
//     this.setState (state=> ({number:state.number+1}))
//   }
//   render() {
//     return (
//       <div id="counter">
//         <span>{this.state.number}</span>
//         <button onClick={this.onClick.bind(this)}>???1</button>
//       </div>
//     )
//   }
// }
// // console.log(new ClassCounter(),"<ClassCounter />")
function FunctionCounter() {
  var _React$useReducer = _react.default.useReducer(reducer, {
    count: 0
  }),
      _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
      countState = _React$useReducer2[0],
      dispatch = _React$useReducer2[1];

  return _react.default.createElement("div", {
    id: "counter"
  }, _react.default.createElement("span", null, countState.count), _react.default.createElement("button", {
    onClick: function onClick() {
      dispatch({
        type: 'ADD'
      });
    }
  }, "\u52A01"));
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        count: state.count + 1
      };

    default:
      return state;
  }
}

_reactDom.default.render(_react.default.createElement(FunctionCounter, {
  name: "?????????"
}), document.getElementById('root')); // console.log(React.createElement)
// let style = {border:'3px solid red',margin:'5px'}
// let element1 = (
//   <div id="A1" style ={style}>
//     A1
//     <div id="B1" style ={style}>
//       B1
//       <div id="C1" style ={style}>
//       C1
//       </div>
//       <div id="C2" style ={style}>
//       C2
//       </div>
//     </div>
//     <div id='B2' style ={style}>B2</div>
//   </div>
// )
// ReactDOM.render(
//   element1,
//   document.getElementById('root')
// );
// let render2 = document.getElementById('render2')
// render2.addEventListener('click',()=>{
//   let element2 = (
//     <div id="A1" style ={style}>
//       A1-new
//       <div id="B1" style ={style}>
//       B2-new
//         <div id="C1" style ={style}>
//         C1
//         </div>
//         <div id="C2" style ={style}>
//         C2
//         </div>
//       </div>
//       <div id='B2' style ={style}>B2-new</div>
//       <div id='B3' style ={style}>B3</div>
//     </div>
//   )
//   ReactDOM.render(
//     element2,
//     document.getElementById('root')
//   );
// })
// let render3 = document.getElementById('render3')
// render3.addEventListener('click',()=>{
//   let element3 = (
//     <div id="A1-new2" style ={style}>
//       A1-new2
//       <div id="B1-new2" style ={style}>
//         B1-new2
//         <div id="C1-new2" style ={style}>
//         C1-new2
//         </div>
//         <div id="C2-new2" style ={style}>
//         C2-new2
//         </div>
//       </div>
//       <div id='B2-new2' style ={style}>B2-new</div>
//     </div>
//   )
//   ReactDOM.render(
//     element3,
//     document.getElementById('root')
//   );
// })
},{"./react":"react.js","./react-dom":"react-dom.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55492" + '/');

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
//# sourceMappingURL=/zhufengfierreactsub.e31bb0bc.js.map