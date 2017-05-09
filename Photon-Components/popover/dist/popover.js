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
  var popoverBounds = {
    width: opts.size.width,
    height: opts.size.height
  }
  var targetBounds = opts.target.getBoundingClientRect();
  var pos = calcPos(arrowBounds, popoverBounds, targetBounds, win, opts.points);


  function calcPos(arrow, popover, target, win, points) {
    var winPos = win.getPosition();

    var result = {
      arrow: {
        left: 0,
        top: 0
      },
      popover: {
        left: 20,
        top: 20
      }
    };
    if (points === "top" || points === "bottom") {
      result.popover.left = Math.round(winPos[0] + target.left + target.width / 2 - popover.width / 2);
      result.popover.top = Math.round(winPos[1] + (points === "top" ? -(popover.height - target.top + arrow[points].height - 0) : (target.top + target.height + arrow[points].height)));

      result.arrow.left = Math.round(winPos[0] + target.left + target.width / 2 - arrow[points].width / 2);
      result.arrow.top = Math.round(result.popover.top + (points === "top" ? (popover.height - 2) : -(arrow[points].height)));
    }
    if (points === "left" || points === "right") {
      result.popover.left = Math.round(winPos[0] + target.left + (points === "left" ? -(popover.width + arrow[points].width) : (target.width + arrow[points].width)));
      result.popover.top = Math.round(winPos[1] + target.top + target.height / 2 - popover.height / 2);
    }
    return result;
  }
  var popover = new remote.BrowserWindow({
    show: true,
    parent: win,
    width: 0,
    height: 0,
    x: pos.popover.left,
    y: pos.popover.top,
    useContentSize: true,
    frame: false,
    resizable: false,
    vibrancy: opts.vibrancy,
    backgroundColor: opts.background,
    webPreferences: {
      devTools: true,
      experimentalFeatures: true
    },
    focusable: false
  });
  (function(popoverInstance, max) {
    var start = 0;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start;
      var scale = progress / max;


      var arr = JSON.parse(JSON.stringify(arrowBounds));
      arr[opts.points].width = roundMax(arrowBounds[opts.points].width * scale, arrowBounds[opts.points].width);
      arr[opts.points].height = roundMax(arrowBounds[opts.points].height * scale, arrowBounds[opts.points].height);

      console.log(arr[opts.points]);

      var popover = Object.create(popoverBounds);
      popover.width = roundMax(popoverBounds.width * scale, popoverBounds.width);
      popover.height = roundMax(popoverBounds.height * scale, popoverBounds.height);


      var pos = calcPos(arr, popover, targetBounds, win, opts.points);

      popoverInstance.setBounds({
        width: popover.width,
        height: popover.height,
        x: pos.popover.left,
        y: pos.popover.top
      });
      //console.log(arr[opts.points], arrowBounds);
      arrowFix.setBounds({
        width: arr[opts.points].width,
        height: arr[opts.points].height,
        x: pos.arrow.left,
        y: pos.arrow.top
      });
      //console.log(scale);
      if (progress < max) {
        window.requestAnimationFrame(step);
      }
      else {
        pos = calcPos(arrowBounds, popoverBounds, targetBounds, win, opts.points);
        popoverInstance.setBounds({
          width: popoverBounds.width,
          height: popoverBounds.height,
          x: pos.popover.left,
          y: pos.popover.top
        });
        //console.log(arr[opts.points], arrowBounds);
        arrowFix.setBounds({
          width: arrowBounds[opts.points].width,
          height: arrowBounds[opts.points].height + 2,
          x: pos.arrow.left,
          y: pos.arrow.top
        });
      }
    }
    //window.requestAnimationFrame(step);

    function roundMax(int, max) {
      var round = Math.round(int);
      return round <= max ? round : max;
    }
  })(popover, 400);
  var arrowFix = new remote.BrowserWindow({
    parent: win,
    show: true,
    width: arrowBounds[opts.points].width,
    height: arrowBounds[opts.points].height,
    y: pos.arrow.top,
    x: pos.arrow.left,
    frame: false,
    transparent: true,
    resizable: false,
    focusable: false
  });

  pos = calcPos(arrowBounds, popoverBounds, targetBounds, win, opts.points);
  popover.setBounds({
    width: popoverBounds.width,
    height: popoverBounds.height,
    x: pos.popover.left,
    y: pos.popover.top
  });
  //console.log(arr[opts.points], arrowBounds);
  arrowFix.setBounds({
    width: arrowBounds[opts.points].width,
    height: arrowBounds[opts.points].height,
    x: pos.arrow.left,
    y: pos.arrow.top
  });

  var arrowPointers = {
    "bottom": '<html><head><style>body { margin: 0; padding: 0; }</style></head><body>' +
    '<svg width="100%" height="100%" viewBox="0 0 30 14" shape-rendering="geometricPrecision"><filter id="dropshadow" height="100%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dx="0" dy="2" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.6"/></feComponentTransfer><feMerge> <feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><path style="stroke: rgb(189, 189, 189); stroke-width: 1px; fill: ' + opts.background + '; filter: url(#dropshadow);" d="m0.75,14.832001l27.5,-0.151733c-4.333603,-1.220001 -7.905334,-4.245598 -13.16133,-13.680267c-6.357865,10.13227 -10.195733,12.543465 -14.338669,13.832" stroke-width="1px"/></svg>' +
    '</body></html>',
    "top": '<html><head><style>body { margin: 0; padding: 0; }</style></head><body>' +
    '<svg width="100%" height="100%" viewBox="0 0 30 14" shape-rendering="geometricPrecision"><filter id="dropshadow" height="100%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dx="0" dy="2" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.6"/></feComponentTransfer><feMerge> <feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><path style="transform: rotate(180deg); transform-origin: 50% 50%; stroke: rgb(80, 80 80); stroke-width: 1px; fill: ' + opts.background + '; filter: url(#dropshadow);" d="m0.75,14.832001l27.5,-0.151733c-4.333603,-1.220001 -7.905334,-4.245598 -13.16133,-13.680267c-6.357865,10.13227 -10.195733,12.543465 -14.338669,13.832" stroke-width="1px"/></svg>' +
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
