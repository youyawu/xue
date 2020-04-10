import Dep from "./dep";
export default class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.depIds = [];
    this.getter = () => exp.split(".").reduce((x, curr) => x[curr], vm);
    this.value = this.get();
  }
  get() {
    Dep.Target = this;
    const val = this.getter();
    Dep.Target = null;
    return val;
  }
  addDep(dep) {
    if (this.depIds.includes(dep.uid)) return;
    this.depIds.push(dep.uid);
    dep.addSub(this);
  }
  update() {
    const val = this.get();
    const oldVal = this.value;
    if (val === oldVal) return;
    this.value = val;
    this.cb.call(this.vm, val, oldVal);
  }
}
