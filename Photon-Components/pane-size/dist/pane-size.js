(function() {
  var sizingPane = false;
  var sizingPaneBounding = {};
  var sizingStartPos = [0, 0];
  window.addEventListener("mousedown", function(event) {
    var isPane = event.target.hasParentClass("pane");
    if (isPane.success == true) {
      var target = isPane.parents[isPane.parents.length - 1];
      var panes = target.parentNode.getElementsByClassName("pane");
      for (var i = 0; i < panes.length; i++) {
        var panePos = panes[i].getBoundingClientRect();
        var limiterPos = panePos.right;
        var mouseAcurracy = Math.abs(limiterPos - event.pageX);
        if (mouseAcurracy <= 5 && i < panes.length - 1) {
          sizingPane = panes[i];
          sizingPaneBounding = panePos;
          sizingStartPos = [event.pageX, event.pageY];
        }
      }
    }
  });
  window.addEventListener("mouseup", function() {
    sizingPane = false;
  });
  window.addEventListener("mousemove", function(event) {
    if (sizingPane) {
      var sizing = [event.pageX - sizingStartPos[0], sizingStartPos[1] - event.pageY];
      var currWidth = sizingPaneBounding.width;
      var newWidth = currWidth + sizing[0];
      sizingPane.style.maxWidth = 0;
      sizingPane.style.minWidth = 0;
      sizingPane.style[newWidth >= currWidth ? "minWidth" : "maxWidth"] = newWidth + "px";
    }
  });
})();

HTMLElement.prototype.hasParentClass = function(className) {
  var currParent = this;
  var parents = [];
  while (currParent.tagName != undefined) {
    parents.push(currParent);
    if (currParent.classList.contains(className)) {
      return {
        success: true,
        parents: parents
      }
    }
    currParent = currParent.parentNode;
  }
  return {
    success: false,
    parents: parents
  }
}
