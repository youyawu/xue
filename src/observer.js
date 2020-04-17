import Dep from "./dep";
class Observer {
  constructor(value) {
    this.value = value;
    this.walk(value);
    this.dep = new Dep();
    Object.defineProperty(value, "__ob__", {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }
  walk(obj) {
    Object.keys(obj).forEach((key) => defineReactive(obj, key));
  }
}
export const defineReactive = (obj, key, val = obj[key]) => {
  let childOb = observer(val);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.Target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
      }

      return val;
    },
    set(newVal) {
      if (newVal === val || (val !== val && newVal !== newVal)) return;
      val = newVal;
      childOb = observer(val);
      dep.notify();
    },
  });
};
export const observer = (value) => {
  if (!value || typeof value !== "object") return;
  return new Observer(value);
};
