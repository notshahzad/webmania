var h = 600;
var w = 400;
var flag = false;
var speed = 20;
var timer,
  mappedkey,
  hitcounter = 0,
  health = 100;

var beatmaps = {};
const filereader = new FileReader();
var audio;
var healthbar = document.getElementById("health");
function ReadFile() {
  file = document.getElementById("osufile").files[0];
  appendbeatmaps = document.getElementById("beatmaps");
  console.log(file);
  unzip = new JSZip();
  unzip.loadAsync(file).then((data) => {
    console.log(data);
    data.forEach((element) => {
      elementname = element.split(".");
      if (elementname[elementname.length - 1] == "osu") {
        data.files[element].async("string").then((unparsedbeatmap) => {
          beatmap = BeatMapParser(unparsedbeatmap);
          beatmaps[element] = beatmap;
          appendbeatmaps.innerHTML += `<label for="${element}">${element}</label>
          <input type="radio" name="BM" value ='${element}' id = '${element}' value='${element}' >`;
        });
      }
      if (elementname[elementname.length - 1] == "mp3") {
        data.files[element].async("Blob").then((audioblob) => {
          audio = audioblob;
        });
      }
    });
  });
}
var score = document.getElementById("score");
function devmode() {
  flag = true;
}
function checkshit() {
  bm = document.querySelector('input[name="BM"]:checked').value;
  if (bm && audio) gameStart(beatmaps[bm], audio);
}

var keys = {};
var keymap = { 0: "a", 1: "s", 2: "k", 3: "l" };
var OnQueue = { 0: 0, 1: 0, 2: 0, 3: 0 };
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
    this.hitcall = true;
  }
  genrate() {
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
        OnQueue[this.lane / 100] = 0;
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
      if (this.pos <= h + 80 && this.pos >= h - 100) {
        if (OnQueue[this.lane / 100] == 0 && this.hitcall != null) {
          new CheckHit(this.lane, this).checkHit();
          OnQueue[this.lane / 100] = 1;
          this.hitcall = null;
        }
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
          if (health < 100) health += 10;
          console.log("drag success");
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
          (OnQueue[this.lane / 100] = 0),
          (this.mappedkey = null),
          (this.lane = null),
          (health -= 20),
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
        if (health < 100) health += 10;
        OnQueue[this.lane / 100] = 0;
        this.mappedkey = null;
        this.lane = null;
        this.st = null;
        this.self = null;
      }
    })),
      0;
  }
}
function stop() {
  audio.pause();
}
function gameStart(beatmap, audioblob) {
  audio = new Audio(URL.createObjectURL(audioblob));
  audio.play();
  timer = 0.0;
  tilecounter = 0;
  app.ticker.add(() => {
    healthbar.innerHTML = health;
    if (health <= 0) {
      audio.pause();
      window.document.body.innerText = "lol you ded";
      app.ticker.stop();
      console.log("you died");
    }
    if (tilecounter < beatmap.length) {
      timer = audio.currentTime * 1000;
      keylistener();
      if (
        timer <= beatmap[tilecounter].time + 640 + 15 &&
        timer >= beatmap[tilecounter].time - 640 - 15
      ) {
        new tiles(
          beatmap[tilecounter].lane,
          beatmap[tilecounter].type,
          beatmap[tilecounter].end - beatmap[tilecounter].time || 20
        ).genrate();
        tilecounter++;
        while (beatmap[tilecounter].time == beatmap[tilecounter - 1].time) {
          new tiles(
            beatmap[tilecounter].lane,
            beatmap[tilecounter].type,
            beatmap[tilecounter].end - beatmap[tilecounter].time || 20
          ).genrate();
          tilecounter++;
        }
      }
      if (flag == true)
        if (tilecounter < beatmap.length)
          if (timer > beatmap[tilecounter].time + 25) tilecounter++;
    }
  });
}
app.stage.addChild(graphics);
