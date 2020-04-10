import Watcher from "./watcher";
export default class Compile {
  constructor(el, vm) {
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    this.$vm = vm;
    if (this.$el) {
      this.$fragment = this.node2Fragment();
      this.init();
      this.$el.appendChild(this.$fragment);
    }
  }
  init() {
    this.compileElement(this.$fragment);
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
  isTextNode(node) {
    return node.nodeType === 3;
  }
  node2Fragment() {
    const fragment = document.createDocumentFragment();
    let t;
    while ((t = this.$el.firstChild)) {
      fragment.appendChild(t);
    }
    return fragment;
  }
  compileElement(el) {
    if (!el || !el.childNodes) return;
    Array.from(el.childNodes).forEach((node) => {
      this.isElementNode(node) && this.compileNode(node);
      this.isTextNode(node) &&
        /\{\{(.*?)\}\}/.test(node.textContent) &&
        this.compileText(node, RegExp.$1);
      this.compileElement(node);
    });
  }
  compileNode(node) {
    Array.from(node.attributes).forEach(({ name, value }) => {
      if (!this.isDirective(name)) return;
      const dir = name.substr(2);
      if (this.isEventDirective(dir))
        return compileUtil.eventHandler(node, this.$vm, value, dir);
      compileUtil[dir] && compileUtil[dir](node, this.$vm, value);
    });
  }
  compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp, "text");
  }
  isDirective(attr) {
    return attr.indexOf("x-") === 0;
  }
  isEventDirective(dir) {
    const [t] = dir.split(":");
    return t === "on";
  }
}
const compileUtil = {
  eventHandler(node, vm, exp, dir) {
    const [, eventType] = dir.split(":");
    const fn = vm.$options.methods && vm.$options.methods[exp];
    eventType && fn && node.addEventListener(eventType, fn.bind(vm), false);
  },
  text(node, vm, exp) {
    this.bind(node, vm, exp, "text");
  },
  html(node, vm, exp) {
    this.bind(node, vm, exp, "html");
  },
  class(node, vm, exp) {
    this.bind(node, vm, exp, "class");
  },
  model(node, vm, exp) {
    this.bind(node, vm, exp, "model");
    node.addEventListener("input", ({ target: { value } }) =>
      this._setVal(vm, exp, value)
    );
  },
  bind(node, vm, exp, dir) {
    const fn = updater[dir];
    if (!fn) return;
    fn(node, this._getVal(vm, exp));
    new Watcher(vm, exp, (val, oldVal) => fn(node, val, oldVal));
  },
  _getVal(vm, exp) {
    return exp.split(".").reduce((x, curr) => x[curr], vm);
  },
  _setVal(vm, exp, val) {
    const arr = exp.split(".");
    if (arr.length === 1) return (vm[exp] = val);
    const p = arr.pop();
    arr.reduce((x, c) => x[c], vm)[p] = val;
  },
};
const updater = {
  text(node, value) {
    node.textContent = typeof value === "undefined" ? "" : value; //防止 0 false
  },
  html(node, value) {
    node.innerHTML = typeof value === "undefined" ? "" : value;
  },
  model(node, value) {
    node.value = typeof value === "undefined" ? "" : value;
  },
  class(node, value, oldVal) {
    const className = node.className;

    node.className = `${className.replace(oldVal, ``)} ${value}`
      .trim()
      .replace(/\s+/, " ");
  },
};
