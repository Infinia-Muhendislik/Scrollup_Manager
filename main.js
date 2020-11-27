var $ = require("jquery");
var target = "http://127.0.0.1:3000";
var play = false;
var loop = false;
var state;

var init = function () {
  $.post(target + "/init/", { playerName: "Manager" }, function (data) {
    state = JSON.parse(data);
  });
};
var togglePlay = function () {
  $.post(target + "/play/", { val: !play }, function (data) {
    state = JSON.parse(data);
    play = state.play;
    console.log("Play set " + play);
  });
};
var toggleStop = function () {
  $.post(target + "/stop/", { playerName: "Manager" }, function (data) {
    state = JSON.parse(data);
  });
};
var toggleLoop = function () {
  $.post(target + "/loop/", { val: !loop }, function (data) {
    state = JSON.parse(data);
    loop = state.loop;
    console.log("Loop set " + play);
  });
};
var brightness = function (val) {
  $.post(target + "/brightness/", { brightness: val }, function (data) {
    console.log("Parlaklık set to" + val);
    state = JSON.parse(data);
  });
};
var setSize = function (width, height) {
  let screen = {
    width: width,
    height: height,
  };
  $.post(target + "/screenSize/", screen, function (data) {
    state = JSON.parse(data);
  });
};
var deleteMedia = function (id) {
  $.post(target + "/deleteMedia/", { id: id }, function (data) {
    state = JSON.parse(data);
  });
};
var updateDuration = function (id, duration) {
  $.post(
    target + "/updateDuration/",
    { id: id, duration: duration },
    function (data) {
      state = JSON.parse(data);
    }
  );
};
var updateList = function (id, to) {
  $.post(target + "/updateList/", { id: id, to: to }, function (data) {
    state = JSON.parse(data);
  });
};
var playFrom = function (index) {
  $.post(target + "/playFrom/", { index: index }, function (data) {
    state = JSON.parse(data);
  });
};
var uploadFile = function (selectedFile) {
  //TODO TEST_THıS
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

var timer = setInterval(checkState, 1000);
