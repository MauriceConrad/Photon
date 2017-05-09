function showPopover(context, options) {
  var opts = options.fillDefaults({
    target: document.body,
    points: "top",
    background: "#f2f2f2",
    vibrancy: "none",
    resources: [],
    size: {
      width: 100,
      height: 100
    },
    closeAtBlur: false
  });
  var fs = require("fs");
  var electron = require("electron");
  var remote = electron.remote;
  var win = remote.getCurrentWindow();

  var winPos = win.getPosition();
  var targetBounds = opts.target.getBoundingClientRect();

  var arrowBounds = {
    "top": {
      width: 30,
      height: 12
    },
    "bottom": {
      width: 30,
      height: 12
    },
    "left": {
      width: 12,
      height: 30
    },
    "right": {
      width: 12,
      height: 30
    }
  }


  var arrowY = {
    "top": winPos[1] + targetBounds.top + targetBounds.height - 1,
    "bottom": winPos[1] + targetBounds.top - arrowBounds[opts.points].height - 1,
    "left": Math.round(winPos[1] + targetBounds.top + arrowBounds[opts.points].height / 2) - targetBounds.height / 2
  }
  var arrowX = {
    "top": Math.round(winPos[0] + targetBounds.left + targetBounds.width / 2),
    "bottom": Math.round(winPos[0] + targetBounds.left + targetBounds.width / 2),
    "left": Math.round(winPos[0] + targetBounds.left - arrowBounds[opts.points].width + 6)
  }

  var popoverY = {
    "top": arrowY[opts.points] + arrowBounds[opts.points].height,
    "bottom": arrowY[opts.points] - opts.size.height + 2,
    "left": Math.round(arrowY[opts.points] - (arrowBounds[opts.points].height - opts.size.height) / 2)
  }
  var popoverX = {
    "top": arrowX[opts.points] - Math.round(opts.size.width / 2),
    "bottom": arrowX[opts.points] - Math.round(opts.size.width / 2),
    "left": Math.round(arrowX[opts.points] - opts.size.width)
  }

  var popover = new remote.BrowserWindow({
    show: true,
    parent: win,
    width: opts.size.width,
    height: opts.size.height,
    x: popoverX[opts.points],
    y: popoverY[opts.points],
    useContentSize: true,
    frame: false,
    resizable: false,
    vibrancy: opts.vibrancy,
    backgroundColor: opts.background,
    webPreferences: {
      devTools: true,
      experimentalFeatures: true
    }
  });
  var arrowFix = new remote.BrowserWindow({
    parent: popover,
    show: true,
    width: arrowBounds[opts.points].width,
    height: arrowBounds[opts.points].height,
    y: arrowY[opts.points],
    x: arrowX[opts.points] - Math.round(arrowBounds[opts.points].width / 2),
    frame: false,
    transparent: true,
    resizable: false,
    focusable: false
  });
  var arrowPointers = {
    "top": '<html><head><style>body { margin: 0; padding: 0; }</style></head><body>' +
    '<svg width="100%" height="100%" viewBox="0 0 30 14" shape-rendering="geometricPrecision"><filter id="dropshadow" height="100%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dx="0" dy="2" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.6"/></feComponentTransfer><feMerge> <feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><path style="stroke: rgb(189, 189, 189); stroke-width: 1px; fill: ' + opts.background + '; filter: url(#dropshadow);" d="m0.75,14.832001l27.5,-0.151733c-4.333603,-1.220001 -7.905334,-4.245598 -13.16133,-13.680267c-6.357865,10.13227 -10.195733,12.543465 -14.338669,13.832" stroke-width="1px"/></svg>' +
    '</body></html>',
    "bottom": '<html><head><style>body { margin: 0; padding: 0; }</style></head><body>' +
    '<svg width="100%" height="100%" viewBox="0 0 30 14" shape-rendering="geometricPrecision"><filter id="dropshadow" height="100%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dx="0" dy="2" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.6"/></feComponentTransfer><feMerge> <feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><path style="transform: rotate(180deg); transform-origin: 50% 50%; stroke: rgb(60, 60, 60); stroke-width: 1px; fill: ' + opts.background + '; filter: url(#dropshadow);" d="m0.75,14.832001l27.5,-0.151733c-4.333603,-1.220001 -7.905334,-4.245598 -13.16133,-13.680267c-6.357865,10.13227 -10.195733,12.543465 -14.338669,13.832" stroke-width="1px"/></svg>' +
    '</body></html>',
    "left": '<html><head><style>body { margin: 0; padding: 0; }</style></head><body>' +
    '<svg width="100%" height="100%" viewBox="0 0 22 42" shape-rendering="geometricPrecision"><filter id="dropshadow" height="100%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dx="0" dy="2" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.6"/></feComponentTransfer><feMerge> <feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><path style="transform: rotate(90deg); transform-origin: 50% 50%; stroke: rgb(60, 60, 60); stroke-width: 1px; fill: ' + opts.background + '; filter: url(#dropshadow);" d="m0.75,14.832001l27.5,-0.151733c-4.333603,-1.220001 -7.905334,-4.245598 -13.16133,-13.680267c-6.357865,10.13227 -10.195733,12.543465 -14.338669,13.832" stroke-width="1px"/></svg>' +
    '</body></html>'
  }

  arrowFix.loadURL('data:text/html;utf8,' + arrowPointers[opts.points]);


  win.on("blur", function() {
    if (opts.closeAtBlur) popover.close();
  });

  var resources = (function() {
    var str = "";
    opts.resources.forEach(function(resource) {
      var ext = resource.split("/").last.split(".").last;
      if (ext === "css") {
        str += '<style type="text/css">' + fs.readFileSync(__dirname + "/" + resource, "utf8") + '</style>'
      }
      else if (ext === "js") {
        str += '<script type="text/javascript">' + fs.readFileSync(__dirname + "/" + resource, "utf8") + '</script>'
      }
    });
    return str;
  })();

  var html = '<!DOCTYPE html>' +
  '<html>' +
    '<head>' +
      '<meta charset="utf-8">' +
      '<title>PopOver</title>' +
      resources +
    '</head>' +
    '<body>' +
      context +
    '</body>' +
  '</html>';

  popover.loadURL('data:text/html;utf8,' + html);
  //popover.webContents.openDevTools();
  return popover;
}
Object.prototype.fillDefaults = function(defaults) { // Default Version
  var keys = Object.keys(defaults);
  for (var i = 0; i < keys.length; i++) {
    if (typeof defaults[keys[i]] == "object" && !(defaults[keys[i]] instanceof Array) && keys[i] in this){
      this[keys[i]] = this[keys[i]].fillDefaults(defaults[keys[i]]);
    }
    else if (!(keys[i] in this)) {
      this[keys[i]] = defaults[keys[i]];
    }
  }
  return this;
}
Object.defineProperty(Array.prototype, "last", {
  get: function() {
    return this[this.length - 1];
  }
});
