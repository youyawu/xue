import Dep from "./dep";
class Observer {
  constructor(value) {
    this.value = value;
    this.walk(value);
  }
  walk(obj) {
    Object.keys(obj).forEach((key) => defineReactive(obj, key));
  }
}
const defineReactive = (obj, key) => {
  let val = obj[key];
  let childOb = observer(val);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      Dep.Target && dep.depend();
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
