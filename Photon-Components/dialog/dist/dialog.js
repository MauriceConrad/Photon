function dialogAction(dialog, options) {
  if (!options) options = {};
  var opts = fillDefaults(options, {
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
  function fillDefaults(obj, defaults) {
    var keys = Object.keys(defaults);
    for (var i = 0; i < keys.length; i++) obj[keys[i]] = typeof defaults[keys[i]] == "object" ? fillDefaults(obj[keys[i]], defaults[keys[i]]) : (!(keys[i] in obj) ? defaults[keys[i]] : obj[keys[i]]);
    return obj;
  }
}
