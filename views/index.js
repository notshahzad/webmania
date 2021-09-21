var h = 600;
w = 400;
const app = new PIXI.Application({ height: h, width: w });
document.body.appendChild(app.view);
var graphics = new PIXI.Graphics();

graphics.beginFill(0xffffff);
graphics.lineStyle(1, 0);

graphics.drawRect(0, h, 100, -20);
graphics.drawRect(100, h, 100, -20);
graphics.drawRect(200, h, 100, -20);
graphics.drawRect(300, h, 100, -20);

class tiles {
  constructor(pos) {
    this.pos = pos;
    this.fall = 0;
    this.speed = 6;
    this.current;
  }
  genrate() {
    this.tile = new PIXI.Graphics();
    var intervalId = setInterval(() => {
      this.tile.clear();
      this.tile.beginFill(0xffffff);
      this.tile.lineStyle(1, 0);
      this.current = this.tile.drawRect(this.pos, this.fall, 100, 20);
      this.fall += this.speed;
      this.current.id = Math.floor(Math.random() * 1000);
      app.stage.addChild(this.current);
      if (this.fall == h) {
        clearInterval(intervalId);
        this.pos = null;
        this.fall = null;
        console.log(app.stage.children);
        this.current.destroy();
      }
    }, 0);
  }
}
//testing shit below
// document.addEventListener("keypress", (key) => {
//   var map = [];
//   map.push(key.key);
//   for (let keys = 0; keys <= map.length; keys++) {
//     if (map[keys] == "a") s = new tiles(0).genrate();
//     if (map[keys] == "s") s = new tiles(100).genrate();
//     if (map[keys] == "k") s = new tiles(200).genrate();
//     if (map[keys] == "l") s = new tiles(300).genrate();
//   }
// });
app.stage.addChild(graphics);
