import { observer } from "./observer";
import Compile from "./compile";
export default class Xue {
  constructor(options = {}) {
    this.$options = options;
    let data = (this._data = this.$options.data);
    this.initComputed();
    this.proxy();
    observer(data);
    this.$compile = new Compile(options.el, this);
  }
  proxy() {
    Object.keys(this._data).forEach((key) =>
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return this._data[key];
        },
        set(newVal) {
          this._data[key] = newVal;
        },
      })
    );
  }
  initComputed() {
    if (typeof this.$options.computed !== "object") return;
    Object.keys(this.$options.computed).forEach((key) =>
      Object.defineProperty(this, key, {
        get: this.$options.computed[key],
      })
    );
  }
}
