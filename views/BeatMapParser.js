BeatMapParser = (file) => {
  lanemap = { 64: 0, 192: 100, 320: 200, 448: 300 };
  sliderinfo = [];
  bminfo = file
    .toString()
    .substring(
      file.toString().indexOf("[HitObjects]") + "[HitObjects]".length,
      file.toString().length
    )
    .split("\n");
  for (let i = 1; i <= bminfo.length - 1; i++) {
    dataline = bminfo[i].split(",");
    var laen = lanemap[dataline[0]];
    beat = {
      type: "tap",
      lane: laen,
      time: eval(dataline[2]),
    };
    sliderend = eval(dataline[dataline.length - 1].split(":")[0]);
    if (sliderend > beat.time) {
      beat.type = "drag";
      beat.end = sliderend;
    }
    sliderinfo.push(beat);
  }
  return sliderinfo;
};
