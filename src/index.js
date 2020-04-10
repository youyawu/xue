import Xue from "./xue";
const xue = new Xue({
  el: "#app",
  data: {
    text: "text",
    html: "<p>p</p>",
    count: 0,
    className: "red",
  },
  methods: {
    click() {
      this.count += 1;
      this.className = this.count;
    },
  },
  computed: {
    x() {
      return this.text + this.count;
    },
  },
});
window.xue = xue;
console.log(xue);
