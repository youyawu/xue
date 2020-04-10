let uid = 0;
export default class Dep {
  static Target = null;
  constructor() {
    this.uid = uid++;
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  depend() {
    Dep.Target.addDep(this);
  }
  notify() {
    this.subs.forEach((sub) => sub.update());
  }
}
