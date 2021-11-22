var h = 600;
var w = 400;
var timer,
  mappedkey,
  hitcounter = 0;
var flag = false;
var speed = 15;
var score = document.getElementById("score");
function devmode() {
  flag = true;
}
function getshit() {
  fetch("http://localhost:5500/test/test2.osu")
    .then((response) => response.text())
    .then((osufile) => {
      parsed_file = BeatMapParser(osufile);
      gameStart(parsed_file);
    });
}

var keys = {};
var keymap = { 0: "a", 1: "s", 2: "k", 3: "l" };
const app = new PIXI.Application({ height: h, width: w });
document.body.appendChild(app.view);
var graphics = new PIXI.Graphics();

graphics.beginFill(0xffffff);
graphics.lineStyle(1, 0);

graphics.drawRect(0, h, 100, -20);
graphics.drawRect(100, h, 100, -20);
graphics.drawRect(200, h, 100, -20);
graphics.drawRect(300, h, 100, -20);

function keylistener() {
  document.addEventListener("keydown", (key) => {
    if (!keys[key.key]) {
      keys[key.key] = timer;
    }
  });
  document.addEventListener("keyup", (key) => {
    delete keys[key.key];
  });
}
class tiles {
  constructor(lane, type, tileend) {
    this.lane = lane;
    this.pos = 0;
    this.type = type;
    this.tileend = tileend;
  }
  genrate() {
    // 100ms == 330px
    //working on this rn
    this.tile = new PIXI.Graphics();
    app.ticker.add(() => {
      if (this.pos != null && this.pos <= h + this.tileend + 100) {
        this.tile.clear();
        this.tile.beginFill(0xffffff);
        this.tile.lineStyle(1, 0);
        this.tile.drawRect(this.lane, this.pos, 100, -this.tileend);
        this.pos += speed;
        app.stage.addChild(this.tile);
      } else if (this.pos >= h + this.tileend + 100) {
        this.lane = null;
        this.pos = null;
        this.tilend = null;
        // console.log("tile destroyed");
        try {
          this.tile.destroy();
        } catch {
          console.log(`tile not destroyed ${this.tile}`);
        }
      }
      //change pls
      if (this.pos <= h - 80 && this.pos >= h - 100) {
        new CheckHit(this.lane, this).checkHit();
      }
      if (
        this.type === "drag" &&
        this.pos <= h + this.tileend - 80 &&
        this.pos >= h + this.tileend - 100
      ) {
        if (
          keys[keymap[this.lane / 100]] &&
          timer - keys[keymap[this.lane / 100]] <= this.tileend + 100 &&
          timer - keys[keymap[this.lane / 100]] >= this.tileend - 100
        ) {
          hitcounter++;
          score.innerHTML = hitcounter;
        }
      }
    });
  }
}
class CheckHit {
  constructor(lane, self) {
    this.lane = lane;
    this.self = self;
  }
  checkHit() {
    // console.log(`checking ${lane}`);
    this.mappedkey = keymap[this.lane / 100];
    (this.st = setInterval(() => {
      if (this.self.pos == undefined) {
        clearInterval(this.st),
          (this.mappedkey = null),
          (this.lane = null),
          (this.st = null),
          (this.self = null);
      }
      if (
        keys[this.mappedkey] &&
        keys[this.mappedkey] >= timer - 100 &&
        keys[this.mappedkey] <= timer + 100
      ) {
        hitcounter++;
        score.innerHTML = hitcounter;
        clearInterval(this.st);
        this.mappedkey = null;
        this.lane = null;
        this.st = null;
        this.self = null;
      }
    })),
      0;
  }
}
function checkHit(lane) {
  // console.log(`checking ${lane}`);
  mappedkey = keymap[lane / 100];
  (st = setInterval(() => {
    if (
      keys[mappedkey] &&
      keys[mappedkey] >= timer - 100 &&
      keys[mappedkey] <= timer + 100
    ) {
      hitcounter++;
      clearInterval(st);
      mappedkey = null;
      console.log("cleared2");
    }
  })),
    0;
}
function stop() {
  audio.pause();
}
function gameStart(osufile) {
  audio = new Audio("http://localhost:5500/test/audio2.mp3");
  audio.play();
  timer = 0.0;
  tilecounter = 0;
  app.ticker.add(() => {
    timer = audio.currentTime * 1000;
    keylistener();
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
app.stage.addChild(graphics);
