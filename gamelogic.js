users = [];
function gamelogin({ name, room, id }) {
  if (name.length != 0 && room.length != 0) {
    room_users = users.filter((user) => user.room === room);
    if (room_users.length == 0) {
      user = { name, room, id };
      user["chitthi"] = [];
      user["online"] = true;
      user["turn"] = true;
      users.push(user);
      return users;
    } else if (room_users.length <= 3) {
      user = room_users.find(
        (user) => user.name === name && user.room === room
      );
      if (!user) {
        user = { name, room, id };
        user["chitthi"] = [];
        user["online"] = true;
        user["turn"] = false;
        users.push(user);
        return users;
      } else if (user && user.online == false) {
        user.id = id;
        user.online = true;
        return users;
      } else if (user && user.online == true) {
        console.log(id);
        console.log(user);
        return false;
      }
    } else if (room_users.length == 4) {
      return false;
    }
  } else {
    return false;
  }
}
function GetUserById(id) {
  const user = users.find((user) => user.id === id);
  if (user) {
    return user;
  }
}
function UsersInWaiting(room) {
  const user = users.filter(
    (user) => user.room === room && user.online == true
  );
  var UserNames = [];
  user.forEach((element) => {
    UserNames.push(element.name);
  });
  return UserNames;
}
function Offliner(id) {
  const user = users.find((user) => user.id === id);
  if (user) {
    user.online = false;
  }
}
function CheckAuth({ name, room }) {
  try {
    const user = users.find((user) => user.name === name && user.room === room);
    user.online = true;
    return user;
  } catch {
    return false;
  }
}
function UsersInCurrentRoom(room) {
  return users.filter((user) => user.room === room);
}
function GenerateChitti(room) {
  const user = UsersInCurrentRoom(room);
  if (user[0]["chitthi"].length == 0) {
    var chitti = [
      { name: "aam", value: 0 },
      { name: "jaam", value: 0 },
      { name: "kaju", value: 0 },
      { name: "badam", value: 0 },
    ];
    list2 = [];
    for (j = 0; j < 4; j++) {
      for (i = 0; i < 4; i++) {
        random = Math.floor(Math.random() * 4);
        if (chitti[random].value < 4) {
          chitti[random].value++;
          user[j]["chitthi"].push(chitti[random].name);
        } else {
          i--;
        }
      }
    }
  }
}
function sendchitti(name, room) {
  const user = users.find((user) => user.name === name && user.room === room);
  return user.chitthi;
}
function UserSendingChtthi(room) {
  const user = users.find((user) => user.room === room && user.turn == true);
  return user;
}
function ChangeUserId(name, socid) {
  const user = users.find((user) => user.name === name);
  user.id = socid;
  console.log(user);
}
function ChitthiPass(chitthi, name, room) {
  const allusers = users.filter((user) => user.room === room);
  const crntuser = users.find(
    (user) => user.room === room && user.name === name
  );
  for (var i = 0; i < crntuser["chitthi"].length; i++) {
    if (crntuser["chitthi"][i] === chitthi) {
      crntuser["chitthi"].splice(i, 1);
      crntuser.turn = false;
      break;
    } else {
      console.log("f this shit");
    }
  }
  var crntuserindex = allusers.indexOf(crntuser);
  if (crntuserindex <= 2) {
    crntuserindex += 1;
  } else {
    crntuserindex = 0;
  }
  allusers[crntuserindex]["chitthi"].push(chitthi);
  allusers[crntuserindex].turn = true;
  //CheckWin({ crntuserindex, chitthi, room });
}
function CheckWin({ crntuserindex, chitthi, room }) {
  var allusers = users.filter((user) => user.room === room);
  let tempuser = Object.assign({}, allusers[crntuserindex]);
  console.log(tempuser);
  for (var i = 0; i < tempuser["chitthi"].length; i++) {
    if (tempuser["chitthi"][i] === chitthi) {
      tempuser["chitthi"].splice(i, 1);
      break;
    }
  }
  const allEqual = (arr) => arr.every((val) => val === arr[0]);
  var win = allEqual(tempuser["chitthi"]);
  if (win == true) {
    for (i = 0; i < 4; i++) {
      allusers[i]["chitthi"] = [];
    }
    GenerateChitti(allusers[0].room);
  }
}
exports.gamelogin = gamelogin;
exports.UsersInWaiting = UsersInWaiting;
exports.Offliner = Offliner;
exports.GetUserById = GetUserById;
exports.CheckAuth = CheckAuth;
exports.UsersInCurrentRoom = UsersInCurrentRoom;
exports.GenerateChitti = GenerateChitti;
exports.sendchitti = sendchitti;
exports.UserSendingChtthi = UserSendingChtthi;
exports.ChangeUserId = ChangeUserId;
exports.ChitthiPass = ChitthiPass;
