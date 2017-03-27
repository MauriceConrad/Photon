function dialogAction(dialog, options) {
  if (!options) options = {};
  var opts = options.fillDefaults({
    action: "auto",
    speed: 0.3
  });
  if (opts.action == "auto") opts.action = dialog.classList.contains("show") ? "close" : "open";
  dialog.style.transitionDuration = opts.speed + "s";

  var overlay = document.querySelector(".dialog-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "dialog-overlay";
    document.getElementsByClassName("window-content")[0].appendChild(overlay);
  }
  if (opts.action === "close") {
    dialog.classList.remove("show");
    overlay.classList.remove("show");
  }
  else {
    dialog.classList.add("show");
    overlay.classList.add("show");
  }
  var cancelBtns = dialog.getElementsByClassName("btn-close-dialog");
  for (var i = 0; i < cancelBtns.length; i++) {
    cancelBtns[i].addEventListener("click", function() {
      dialogAction(dialog, {
        action: "close"
      });
    });
  }
}

Object.prototype.fillDefaults = function(defaults) {
  var keys = Object.keys(defaults);
  for (var i = 0; i < keys.length; i++) this[keys[i]] = typeof defaults[keys[i]] == "object" ? this[keys[i]].fillDefaults(defaults[keys[i]]) : (!(keys[i] in this) ? defaults[keys[i]] : this[keys[i]]);
  return this;
}
