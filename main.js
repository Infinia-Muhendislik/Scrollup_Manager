const axios = require("axios");
var target = "http://127.0.0.1:4631";
var play = false;
var loop = false;
var state;
require("dotenv").config();
const { spawn } = require("child_process");

const startPlayer = spawn("./home/pi/player.sh");

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
var uploadFile = function (selectedFile) {
  //TODO TEST
  const formData = new FormData();
  formData.append("file", selectedFile);
  fetch(target + "/upload/" + selectedFile.name, {
    method: "POST",
    body: formData,
  });
};

var checkState = function () {
  console.log("lalala");
};
//var timer = setInterval(checkState, 1000);
