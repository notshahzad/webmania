BeatMapParser = (file) => {
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
    var x;
    if (dataline[0] == 64) x = 0;
    if (dataline[0] == 192) x = 100;
    if (dataline[0] == 320) x = 200;
    if (dataline[0] == 448) x = 300;
    beat = {
      type: "circle",
      lane: x,
      time: eval(dataline[2]),
    };
    if (!dataline[dataline.length - 1].startsWith("0")) {
      beat.type = "slider";
      beat.end = eval(dataline[dataline.length - 1].split(":")[0]);
    }
    sliderinfo.push(beat);
  }
  return sliderinfo;
};
