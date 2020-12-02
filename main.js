const axios = require("axios");
require("dotenv").config();
const Fs = require("fs");
const Path = require("path");
var internetAvailable = require("internet-available");

var target = "http://127.0.0.1:4631";
const server = "http://192.168.88.42:8000";
var remoteList;
var play = false;
var loop = false;

var scrollupID = process.env.ID;
console.log(scrollupID);

var init = function () {
  axios.post(target + "/init/", { playerName: "Manager" }).then((res) => {
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
  axios.post(target + "/deleteMedia/", { id: id }).then((res) => {
    return res.data;
  });
};
var updateDuration = function (id, duration) {
  axios
    .post(target + "/updateDuration/", { id: id, duration: duration })
    .then((res) => {
      return res.data;
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
  axios
    .post(target + "/readFile/", { fileName: name, duration: duration })
    .then((res) => {
      console.log(res.data);
    });
};

async function checkState() {
  axios
    .get(server + "/api/oynatma-listesi/", {
      params: {
        slug: scrollupID,
      },
    })
    .then((res) => {
      remoteList = res.data;
      console.log(remoteList);
      for (let index = 0; index < remoteList.length; index++) {
        const fileName = remoteList[index].media_url.split("/").pop();
        // const path = Path.resolve(__dirname, "media", fileName);
        const path = Path.resolve("../remote_media_player/app/media", fileName); //save directly to player
        const fstream = Fs.createWriteStream(path);
        var uri = server + remoteList[index].media_url + "/";
        const config = {
          method: "get",
          responseType: "stream",
        };
        axios.get(uri, config).then(function (res) {
          res.data.pipe(fstream);
        });
        fstream.on("close", function () {
          readFile(fileName, remoteList[index].screen_time);
        });
      }
    });
}

//var timer = setInterval(checkState, 1000);

internetAvailable({
  timeout: 5000,
  retries: 10,
})
  .then(function () {
    console.log("Internet available");
    // checkState();
    // setTimeout(checkState, 10000);
  })
  .catch(function () {
    console.log("No internet");
  });
