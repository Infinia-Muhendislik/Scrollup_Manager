const axios = require("axios");
require("dotenv").config();
const Fs = require("fs");
const Path = require("path");
var internetAvailable = require("internet-available");
var express = require("express"),
  path = require("path"),
  service = express();
const { exec } = require("child_process");

service.set("port", process.env.PORT || 46311);
service.use(express.static("public"));
service.listen(service.get("port"), function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Running on port: " + service.get("port"));
  }
});
service.use(express.urlencoded());
service.use(express.json());

service.post("/resetNetwork", function (req, res) {
  console.log("Wifi network reset from: " + req.body.playerName);
  exec("sudo python3 /usr/lib/raspiwifi/reset_device/manual_reset.py", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  res.sendStatus(200);
});

var target = "http://127.0.0.1:4631";
const server = "https://app.scrollup.net";
var remoteList;
var myPlayer;
var play = false;
var loop = false;

var scrollupID = process.env.ID;
var s_key = process.env.key;
console.log("Scrollup: " + scrollupID);

var init = function () {
  axios.post(target + "/init/", { playerName: "Manager" }).then((res) => {
    myPlayer = res.data;
    axios
      .get(server + "/api/oynatma-listesi/get/", {
        params: {
          s_id: scrollupID,
          key: s_key,
        },
      })
      .then((res) => {
        remoteList = res.data;
      });
  });
};
var reset = function () {
  axios.post(target + "/reset/", { playerName: "Manager" }).then((res) => {
    return res.data;
  });
};
var togglePlay = function () {
  axios.post(target + "/play/", { val: !play }).then((res) => {
    play = res.data.play;
    console.log("Play set " + play);
    return res.data;
  });
};
var toggleLoop = function () {
  axios.post(target + "/loop/", { val: !loop }).then((res) => {
    loop = res.data.play;
    console.log("Loop set " + play);
    return res.data;
  });
};
var toggleStop = function () {
  axios.post(target + "/stop/", { playerName: "Manager" }).then((res) => {
    return res.data;
  });
};
var brightness = function (val) {
  axios.post(target + "/brightness/", { brightness: val }).then((res) => {
    console.log("Parlaklık set to " + val);
    return res.data;
  });
};

var setSize = function (width, height) {
  let screen = {
    width: width,
    height: height,
  };
  axios.post(target + "/screenSize/", screen).then((res) => {
    return res.data;
  });
};
var deleteMedia = function (id) {
  console.log(id + " için silme isteği gönderiliyor");
  axios.post(target + "/deleteMedia/", { id: id }).then((res) => {
    return res.data;
  });
};
var updateDuration = function (id, duration) {
  axios.post(target + "/updateDuration/", { id: id, duration: duration }).then((res) => {
    console.log(id + " için duration değiştirildi");
  });
};
var updateList = function (id, to) {
  axios.post(target + "/updateList/", { id: id, to: to }).then((res) => {
    return res.data;
  });
};
var playFrom = function (index) {
  axios.post(target + "/playFrom/", { index: index }).then((res) => {
    return res.data;
  });
};
var readFile = function (name, duration) {
  axios.post(target + "/readFile/", { fileName: name, duration: duration }).then((res) => {
    myPlayer = res.data;
  });
};

function isExist(fileName, arr) {
  for (let index = 0; index < arr.length; index++) {
    if (fileName == arr[index]) {
      console.log(arr[index] + " already installed");
      return true;
    }
  }
  return false;
}

function isExistRemote(fileName, arr) {
  for (let index = 0; index < arr.length; index++) {
    if (fileName == Path.basename(arr[index].media_url)) {
      return true;
    }
  }
  return false;
}

async function updateRemoteDuration() {
  if (remoteList != undefined && remoteList.length > 0 && myPlayer != undefined) {
    for (let i = 0; i < myPlayer.playList.length; i++) {
      for (let j = 0; j < remoteList.length; j++) {
        if (Path.basename(remoteList[j].media_url) == Path.basename(myPlayer.playList[i].fileName)) {
          console.log({
            id: myPlayer.playList[i].id,
            duration: remoteList[j].duration,
          });
          if (remoteList[j].duration != myPlayer.playList[i].duration) {
            updateDuration(myPlayer.playList[i].id, remoteList[j].duration);
            console.log(myPlayer.playList[i].id + " için duration değiştirildi");
          }
        }
      }
    }
  } else return false;
}

async function deleteLocals() {
  if (remoteList != undefined && remoteList.length > 0) {
    Fs.readdir(Path.join(__dirname, "../remote_media_player/app/media"), function (err, dir) {
      if (err) console.log(err);
      else {
        for (let index = 0; index < dir.length; index++) {
          if (!isExistRemote(dir[index], remoteList)) {
            if (dir[index] != ".gitignore") {
              console.log(dir[index] + " için silme başlatılıyor");
              axios.post(target + "/init/", { playerName: "Manager" }).then((res) => {
                myPlayer = res.data;
                for (j = 0; j < myPlayer.playList.length; j++) {
                  if (dir[index] == Path.basename(myPlayer.playList[j].fileName)) {
                    deleteMedia(myPlayer.playList[j].id);
                  }
                }
              });
            }
          }
        }
      }
    });
  }
}

async function checkState() {
  axios
    .get(server + "/api/oynatma-listesi/get/", {
      params: {
        s_id: scrollupID,
        key: s_key,
      },
    })
    .then((res) => {
      remoteList = res.data;
      console.log(remoteList);
      Fs.readdir(Path.join(__dirname, "../remote_media_player/app/media"), function (err, dir) {
        if (err) console.log(err);
        else {
          for (let index = 0; index < remoteList.length; index++) {
            const fileName = Path.basename(remoteList[index].media_url);
            if (!isExist(fileName, dir)) {
              const path = Path.resolve("../remote_media_player/app/media", fileName.replace(/\s/g, "")); //save directly to player
              const fstream = Fs.createWriteStream(path);
              var uri = server + remoteList[index].media_url + "/";
              const config = {
                method: "get",
                responseType: "stream",
              };
              console.log(fileName + " için istek gönderiliyor");
              axios.get(uri, config).then(function (res) {
                res.data.pipe(fstream);
              });
              fstream.on("close", function () {
                // readFile(fileName.replace(/\s/g, ""), remoteList[index].duration);
                axios.post(target + "/readFile/", { fileName: fileName.replace(/\s/g, ""), duration: remoteList[index].duration }).then((res) => {
                  myPlayer = res.data;
                });
              });
            }
          }
        }
      });
    });
}

var timer;
init();
internetAvailable({
  timeout: 10000,
  retries: 10,
})
  .then(function () {
    console.log("Internet available");
    setInterval(checkState, 30000);
    setInterval(deleteLocals, 39000);
    setInterval(updateRemoteDuration, 37000);
  })
  .catch(function () {
    console.log("No internet");
    global.clearTimeout(timer);
  });
