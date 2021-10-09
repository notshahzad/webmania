var h = 600;
var w = 400;
flag = false;
function devmode() {
  flag = true;
}
function getshit() {
  fetch("http://localhost:5500/test/test.osu")
    .then((response) => response.text())
    .then((osufile) => {
      parsed_file = BeatMapParser(osufile);
      // console.log(parsed_file);
      gameStart(parsed_file);
    });
}
const app = new PIXI.Application({ height: h, width: w });
document.body.appendChild(app.view);
var graphics = new PIXI.Graphics();
var ticker = app.ticker.shared;

graphics.beginFill(0xffffff);
graphics.lineStyle(1, 0);

graphics.drawRect(0, h, 100, -20);
graphics.drawRect(100, h, 100, -20);
graphics.drawRect(200, h, 100, -20);
graphics.drawRect(300, h, 100, -20);

class tiles {
  constructor(pos, type, tileend) {
    this.pos = pos;
    this.fall = 0;
    this.speed = 30;
    this.current;
    this.type = type;
    this.tileend = tileend;
  }
  genrate() {
    // 100ms == 330px
    this.tile = new PIXI.Graphics();
    console.log(this.tileend);
    app.ticker.add(() => {
      if (this.fall != null && this.fall < h + this.tileend) {
        this.tile.clear();
        this.tile.beginFill(0xffffff);
        this.tile.lineStyle(1, 0);
        this.current = this.tile.drawRect(
          this.pos,
          this.fall,
          100,
          -this.tileend
        );
        this.fall += this.speed;
        app.stage.addChild(this.current);
      } else if (this.fall == h + this.tileend) {
        this.pos = null;
        this.fall = null;
        this.current.destroy();
      }
    });
  }
}
function gameStart(osufile) {
  audio = new Audio("http://localhost:5500/test/audio.mp3");
  audio.play();
  timer = 0.0;
  tilecounter = 0;
  app.ticker.add(() => {
    // timer += delta * 16.75;
    // console.log(Math.round(timer), audio.currentTime);
    timer = audio.currentTime * 1000;
    // console.log(timer);
    // 333-334 ms time for tile to reach the end
    if (
      timer <= osufile[tilecounter].time + 334 + 15 &&
      timer >= osufile[tilecounter].time - 334 - 15
    ) {
      new tiles(
        osufile[tilecounter].lane,
        osufile[tilecounter].type,
        osufile[tilecounter].end - osufile[tilecounter].time || 20
      ).genrate();
      tilecounter++;
      while (osufile[tilecounter].time == osufile[tilecounter - 1].time) {
        new tiles(
          osufile[tilecounter].lane,
          osufile[tilecounter].type,
          osufile[tilecounter].end - osufile[tilecounter].time || 20
        ).genrate();
        tilecounter++;
      }
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
