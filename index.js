// const app = require("express")();
// app.get("/", (req, res) => res.render(`${__dirname}/views/index.html`));
// app.listen(3000, () => console.log("listening on PORT 3000"));
// class SHITASS {
//   constructor(num) {
//     this.num = num;
//   }
//   temp() {
//     logthis(this);
//   }
// }
// var stas = new SHITASS(1);
// stas.temp();
// function logthis(self) {
//   self.num = 2;
//   console.log(stas);
// }
console.time("temp");
temp1 = 0;
e = setInterval(() => {
  temp1 += 1;
  console.log(temp1);
  if (temp1 == 700) {
    clearInterval(e);
    x();
  }
}, 1);
function x() {
  console.timeEnd(`temp`);
}
