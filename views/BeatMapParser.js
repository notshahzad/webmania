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
      beat = {
        type: "circle",
        x: dataline[0],
        y: dataline[1],
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