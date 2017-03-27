var electron = require('electron');
var remote = electron.remote;
var win = remote.getCurrentWindow();

win.on("blur", function() {
  var winElement = document.querySelector(".window");
  if (winElement) winElement.classList.add("no-focus");
});
win.on("focus", function() {
  var winElement = document.querySelector(".window");
  if (winElement) winElement.classList.remove("no-focus");
});
