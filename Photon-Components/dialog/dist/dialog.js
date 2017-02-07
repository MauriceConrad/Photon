function dialogAction(dialog, options) {
  var electron = require("electron");
  var remote = electron.remote;
  var BrowserWindow = remote.BrowserWindow;
  var currWindow = remote.getCurrentWindow();
  if (dialog.show === true) {
    dialog.show = false;
    currWindow.setResizable(currWindow.resizable);
    currWindow.setFocusable(true);
    currWindow.dialogWindow.hide();
  }
  else {
    if (dialog.show == undefined) currWindow.resizable = currWindow.isResizable();
    dialog.show = true;
    var dialogWidth = 400;
    var dialogHeight = 300;
    var pos = calcDialogPos(dialogWidth);
    console.log(pos);
    currWindow.dialogWindow = new BrowserWindow({
      parent: currWindow,
      frame: false,
      x: pos[0],
      y: pos[1],
      height: dialogHeight,
      width: dialogWidth,
      show: true,
      vibrancy: "popover",
      frame: false,
      alwaysOnTop: true,
      resizable: true,
      backgroundColor: "#e9e9e9"
    });
    currWindow.setResizable(false);
    currWindow.setFocusable(false);
    currWindow.dialogWindow.setResizable(false);

  }
  function calcDialogPos(width) {
    return [currWindow.getPosition()[0] + (currWindow.getSize()[0] / 2 - width / 2), document.getElementsByClassName("window-content")[0].offsetTop + currWindow.getPosition()[1]];
  }
}
window.addEventListener("resize", function() {
  console.log();
});
