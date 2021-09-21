var h = 600;
var w = 400;
flag = false;
function devmode() {
  flag = true;
}
fetch("http://localhost:5500/test/test.osu")
  .then((response) => response.text())
  .then((osufile) => {
    parsed_file = BeatMapParser(osufile);
    gameStart(parsed_file);
  });
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
    this.speed = 10;
    this.current;
  }
  genrate() {
    this.tile = new PIXI.Graphics();
    app.ticker.add(() => {
      if (this.fall < h - 10) {
        this.tile.clear();
        this.tile.beginFill(0xffffff);
        this.tile.lineStyle(1, 0);
        this.current = this.tile.drawRect(this.pos, this.fall, 100, 20);
        this.fall += this.speed;
        app.stage.addChild(this.current);
      }
      if (this.fall == h) {
        this.pos = null;
        this.fall = null;
        console.log(app.stage.children);
        this.current.destroy();
      }
    });
  }
}
function gameStart(osufile) {
  timer = 0.0;
  console.log(osufile);
  tilecounter = 0;
  app.ticker.add((delta) => {
    timer += delta * 10;
    console.log(timer, osufile[tilecounter].time);
    if (
      timer <= osufile[tilecounter].time + 15 &&
      timer >= osufile[tilecounter].time - 15
    ) {
      while (osufile[tilecounter].time == osufile[tilecounter + 1].time) {
        new tiles(osufile[tilecounter].lane).genrate();
        tilecounter++;
      }
      new tiles(osufile[tilecounter].lane).genrate();
      tilecounter++;
    }
    if (flag == true)
      if (tilecounter < osufile.length)
        if (timer > osufile[tilecounter].time + 25) tilecounter++;
  });
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
