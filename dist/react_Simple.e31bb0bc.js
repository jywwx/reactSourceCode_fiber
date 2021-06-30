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
})({"react/set_state_queue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enqueueSetState = enqueueSetState;

var _reactDom = require("../react-dom");

/**
 * 1.异步更新state,短时间内把多个setState合并成一个(队列)
 * 2.一段时间之后 循环清空队列 渲染组件
 * 3.
 */
var setStateQueue = [];
var renderQueue = []; // 保存当前正在更新状态的组件

function enqueueSetState(stateChange, component) {
  if (setStateQueue.length === 0) {
    setTimeout(function () {
      flush();
    }, 0);
  } // 短时间内 合并多个setState


  setStateQueue.push({
    stateChange: stateChange,
    component: component
  }); // 如果renderQueue 中没有当前组件 就把组件添加进 组件队列

  var r = renderQueue.some(function (item) {
    return item === component;
  });

  if (!r) {
    // 证明是第一次添加
    renderQueue.push(component);
  }
} // 一段时间之后


function flush() {
  var item;

  while (item = setStateQueue.shift()) {
    var _item = item,
        stateChange = _item.stateChange,
        _component = _item.component; // 保存之前的状态

    if (!_component.preveState) {
      _component.preveState = Object.assign({}, _component.state);
    }

    if (typeof stateChange === 'function') {
      // 传进来的是一个回调函数
      Object.assign(_component.state, stateChange(_component.preveState, _component.props));
    } else {
      // 否则就是传进来的是一个对象 肯定是同步的
      Object.assign(_component.state, stateChange);
    }
  }

  var component;

  while (component = renderQueue.shift()) {
    (0, _reactDom.renderComponent)(component);
  }
}
},{"../react-dom":"react-dom/index.js"}],"react/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactDom = require("../react-dom");

var _set_state_queue = require("./set_state_queue");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component = /*#__PURE__*/function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.props = props;
    this.state = {};
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(stateChange) {
      (0, _set_state_queue.enqueueSetState)(stateChange, this);
    }
  }]);

  return Component;
}();

var _default = Component;
exports.default = _default;
},{"../react-dom":"react-dom/index.js","./set_state_queue":"react/set_state_queue.js"}],"react-dom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.diffNode = diffNode;

var _index = require("./index");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function diff(dom, vnode, container) {
  var ret = diffNode(dom, vnode);

  if (container) {
    container.appendChild(ret);
  } // return ret

}

function diffNode(dom, vnode) {
  var out = dom;

  if (vnode === undefined || vnode === null || typeof vnode === 'bool') {
    vnode = '';
  }

  if (typeof vnode === 'number') {
    vnode = String(vnode);
  } // 如果node 是字符串


  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        // 更新文本的内容
        dom.textContent = vnode;
      }
    } else {
      out = document.createTextNode(vnode);

      if (dom && dom.parentNode) {
        dom.parentNode.replaceNode(out, dom);
      }
    }

    return out;
  }

  if (typeof vnode.tag === 'function') {
    return diffComponent(out, vnode);
  } // 非文本的dom节点


  if (!dom) {
    out = document.createElement(vnode.tag);
  } // 比较子节点(dom节点 和组件)


  if (vnode.childrens && vnode.childrens.length > 0 || out.childNodes && out.childNodes.length > 0) {
    // 对比组件 或者子节点
    diffChildren(out, vnode.childrens);
  } // 比较当前节点的属性


  diffAttribute(out, vnode);
  return out;
}

function diffChildren(dom, vchildren) {
  var domChildren = dom.childNodes;
  var children = [];
  var keyed = {}; // 将有key的节点(用对象保存 hash表) 和没有key 的节点（用数组保存） 分开

  if (domChildren.length > 0) {
    domChildren.forEach(function (item) {
      children.push(item); // if (item.attributes !== undefined) {
      //     if ([...item.attributes].find(item => item.name === 'key') !== undefined) {
      //         keyed[item.attributes['key']] = item
      //     } else {
      //         children.push(item)
      //     }
      // }
    });
  }

  if (vchildren && vchildren.length > 0) {
    var min = 0;
    var childrenLen = children.length;

    _toConsumableArray(vchildren).forEach(function (vchild, i) {
      // 获取虚拟节点中所有的key
      var key = vchild.key;
      var child;

      if (key) {
        // 如果有key,找到对应key值得节点
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (childrenLen > min) {
        // 如果没有key，则优先查找类型相同的节点
        for (var j = min; j < childrenLen; j++) {
          var c = children[j];

          if (c) {
            child = c;
            children[j] = undefined;

            if (j === childrenLen - 1) {
              childrenLen--;
            }

            if (j === min) {
              min++;
            }

            break;
          }
        }
      } // 对比


      child = diffNode(child, vchild);
      var f = domChildren[i];

      if (child && child !== dom && child !== f) {
        // 如果更新前的对应位置为空,说明此节点是新增的
        if (!f) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    });
  }
}

function diffComponent(dom, vnode) {
  var comp = dom; // 如果组件没有变化

  if (comp && comp.constructor === vnode.tag) {
    // 重新设置属性
    (0, _index.setComponentprops)(comp, vnode.attrs); // 复制

    dom = comp.base;
  } else {
    // 组件类型发生变化
    if (comp) {
      // 先移出旧的组件
      unmountComonent(comp);
      comp = null;
    } else {
      //1. 创建新的组件
      comp = (0, _index.createComponent)(vnode.tag, vnode.attrs); //2.设置创建的组件的属性

      (0, _index.setComponentprops)(comp, vnode.attrs); //3. 给当前组件挂在base

      dom = comp.base;
    }
  }

  return dom;
}

function unmountComonent(comp) {
  removeNode(comp.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNod.removeNode(dom);
  }
}

function diffAttribute(dom, vnode) {
  var oldAttrs = {};
  var newAttrs = vnode.attrs; // dom是已经渲染了  原有的节点  vnode 是新的节点

  var domAttrs = dom.attributes;

  _toConsumableArray(domAttrs).forEach(function (item) {
    oldAttrs[item.name] = item.value;
  }); // 比较 属性
  // 如果原来属性跟新的属性对比，不在新的属性中，则将其移出 (属性值设置为undefined)


  for (var key in oldAttrs) {
    if (!(key in newAttrs)) {
      (0, _index.setAttribute)(dom, key, undefined);
    }
  }

  for (var _key in newAttrs) {
    //值不同 就更新属性的值
    if (oldAttrs[_key] !== newAttrs[_key]) {
      (0, _index.setAttribute)(dom, _key, newAttrs[_key]);
    }
  } /// 更新属性的值

}
},{"./index":"react-dom/index.js"}],"react-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAttribute = setAttribute;
exports.renderComponent = renderComponent;
exports.setComponentprops = setComponentprops;
exports.createComponent = createComponent;
exports.default = void 0;

var _component = _interopRequireDefault(require("../react/component.js"));

var _diff = require("./diff");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ReactDom = {
  render: render
};

function render(vnode, container, dom) {
  return (0, _diff.diff)(dom, vnode, container);
} // function _render(vnode) {
//     if (vnode === undefined || vnode === null || typeof vnode === 'bool') {
//         vnode = ''
//     }
//     //  如果vnode.tag 是函数 则渲染组件
//     if (typeof vnode.tag === 'function') {
//         ///1. 创建组件
//         const comp = createComponent(vnode.tag, vnode.attrs)
//             /////2.设置组件的属性
//         setComponentprops(comp, vnode.attrs)
//             /////3.组件渲染的节点对象返回
//         return comp.base
//     }
//     if (typeof vnode === 'number') {
//         vnode = String(vnode)
//     }
//     if (typeof vnode === 'string') { // 如果node 是文本节点
//         // 创建文本节点对象
//         return document.createTextNode(vnode)
//     } else { // 否则就是一个虚拟dom对象
//         const { tag, attrs } = vnode
//         const dom = document.createElement(tag)
//         if (attrs) { // 虚拟dom存在属性
//             Object.keys(attrs).forEach(key => {
//                 setAttribute(dom, key, attrs[key])
//             })
//         }
//         // 递归渲染子节点
//         vnode.childrens.forEach(child => {
//             render(child, dom)
//         })
//         return dom
//     }
// }


function createComponent(comp, props) {
  // 如果是类定义的组件 则创建实例 返回
  var inst;

  if (comp.prototype && comp.prototype.render) {
    inst = new comp(props);
  } else {
    // 如果是函数组件，将函数组件扩展成类组件 方便后面统一管理
    inst = new _component.default(props);
    inst.constructor = comp; // 给当前实例定制render 函数

    inst.render = function () {
      return this.constructor(props);
    };
  }

  return inst;
}

function setComponentprops(comp, props) {
  // 处理钩子函数
  if (!comp.base) {
    if (comp.componentWillMount) {
      comp.componentWillMount();
    }
  } else if (comp.componentWillReceiveProps) {
    comp.componentWillReceiveProps();
  } // 设置组件的属性


  comp.props = props; // 渲染组件

  renderComponent(comp);
}

function renderComponent(comp) {
  var base;
  var render = comp.render();
  base = (0, _diff.diffNode)(comp.base, render);

  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate();
  }

  if (comp.base) {
    if (comp.componentDidUpdate) {
      comp.componentDidUpdate();
    }
  } else if (comp.componentDidMount) {
    comp.componentDidMount();
  }

  comp.base = base;
} // 设置属性


function setAttribute(dom, key, value) {
  //将属性名className 转换为class
  if (key === 'className') {
    key = 'class';
  } // 如果是事件


  if (/on\w+/.test(key)) {
    // 转小写
    dom[key.toLowerCase()] = value;
  } else if (key === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && _typeof(value) === 'object') {
      for (var _key in value) {
        if (typeof value[_key] === 'number') {
          dom.style[_key] = value[_key] + 'px';
        } else {
          dom.style[_key] = value[_key];
        }
      }
    }
  } else {
    if (key in dom) {
      dom[key] = value || '';
    }

    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key, value);
    }
  }
}

var _default = ReactDom;
exports.default = _default;
},{"../react/component.js":"react/component.js","./diff":"react-dom/diff.js"}],"React/set_state_queue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enqueueSetState = enqueueSetState;

var _reactDom = require("../react-dom");

/**
 * 1.异步更新state,短时间内把多个setState合并成一个(队列)
 * 2.一段时间之后 循环清空队列 渲染组件
 * 3.
 */
var setStateQueue = [];
var renderQueue = []; // 保存当前正在更新状态的组件

function enqueueSetState(stateChange, component) {
  if (setStateQueue.length === 0) {
    setTimeout(function () {
      flush();
    }, 0);
  } // 短时间内 合并多个setState


  setStateQueue.push({
    stateChange: stateChange,
    component: component
  }); // 如果renderQueue 中没有当前组件 就把组件添加进 组件队列

  var r = renderQueue.some(function (item) {
    return item === component;
  });

  if (!r) {
    // 证明是第一次添加
    renderQueue.push(component);
  }
} // 一段时间之后


function flush() {
  var item;

  while (item = setStateQueue.shift()) {
    var _item = item,
        stateChange = _item.stateChange,
        _component = _item.component; // 保存之前的状态

    if (!_component.preveState) {
      _component.preveState = Object.assign({}, _component.state);
    }

    if (typeof stateChange === 'function') {
      // 传进来的是一个回调函数
      Object.assign(_component.state, stateChange(_component.preveState, _component.props));
    } else {
      // 否则就是传进来的是一个对象 肯定是同步的
      Object.assign(_component.state, stateChange);
    }
  }

  var component;

  while (component = renderQueue.shift()) {
    (0, _reactDom.renderComponent)(component);
  }
}
},{"../react-dom":"react-dom/index.js"}],"React/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactDom = require("../react-dom");

var _set_state_queue = require("./set_state_queue");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component = /*#__PURE__*/function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.props = props;
    this.state = {};
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(stateChange) {
      (0, _set_state_queue.enqueueSetState)(stateChange, this);
    }
  }]);

  return Component;
}();

var _default = Component;
exports.default = _default;
},{"../react-dom":"react-dom/index.js","./set_state_queue":"React/set_state_queue.js"}],"React/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = {
  createElement: createElement,
  Component: _component.default
};

function createElement(tag, attrs) {
  attrs = attrs || {};

  for (var _len = arguments.length, childrens = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    childrens[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: attrs,
    childrens: childrens,
    key: attrs.key || null
  };
}

var _default = {
  createElement: createElement,
  Component: _component.default
};
exports.default = _default;
},{"./component":"React/component.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _React = _interopRequireDefault(require("./React"));

var _reactDom = _interopRequireDefault(require("./react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ele = _React.default.createElement("div", {
  className: "active",
  title: "123"
}, "hellow, ", _React.default.createElement("span", null, "react")); // function Home() {
//     return (<div className="active" title="123">hellow, <span>react 函数组件</span></div>)
// }


var Home = /*#__PURE__*/function (_React$Component) {
  _inherits(Home, _React$Component);

  var _super = _createSuper(Home);

  function Home(props) {
    var _this;

    _classCallCheck(this, Home);

    _this = _super.call(this, props);
    _this.props = props;
    _this.state = {
      num: 0
    };
    return _this;
  }

  _createClass(Home, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      console.log('组件将要加载');
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      console.log('组件将要接受参数');
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      console.log('组件将要更新');
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      console.log("组件更新完成");
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log("组件加载完成");
    }
  }, {
    key: "handler",
    value: function handler() {
      this.setState({
        num: this.state.num + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _React.default.createElement("div", {
        className: "active",
        title: "123"
      }, "hellow,", _React.default.createElement("span", null, "react \u7C7B\u7EC4\u4EF6 ", this.state.num), _React.default.createElement("button", {
        onClick: this.handler.bind(this)
      }, "\u6478\u6211"));
    }
  }]);

  return Home;
}(_React.default.Component);

_reactDom.default.render(_React.default.createElement(Home, null), document.querySelector("#root")); // ReactDOM.render(ele,document.querySelector("#root"));
},{"./React":"React/index.js","./react-dom":"react-dom/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61627" + '/');

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
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
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
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
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
//# sourceMappingURL=/react_Simple.e31bb0bc.js.map