HTMLDivElement.prototype.updateCircleProgress = function(percentage) {
  if (this.classList.contains("progress-circle")) {
    if (typeof percentage == "number" && percentage >= 0) {
      var degree = (percentage / 100) * 360;
      var circleCoords = this.getCircleDegreeCoords(degree);
      var percentPosStr = circleCoords.left + "," + circleCoords.top;
      if (degree < 90) {
        var sourcePoint = 120 + "," + 0;
      }
      else if (degree < 180) {
        var sourcePoint = 100 + "," + 0 + " " + 100 + "," + 100;
      }
      else if (degree < 270) {
        var sourcePoint = 100 + "," + 0 + " " + 100 + "," + 100 + " " + 0 + "," + 100;
      }
      else if (degree <= 360) {
        var sourcePoint = 100 + "," + 0 + " " + 100 + "," + 100 + " " + 0 + "," + 100 + " " + 0 + "," + 0;
      }
    }
    else if (percentage != NaN) {
      return console.error("Degree needs to be a natural number!");
    }
    var leftSidePos = "100,100";
    var PolyPoints = "50,50 50,-100 " + sourcePoint + " " + percentPosStr;
    var borderStrokeWidth = 100 / parseFloat(window.getComputedStyle(this, null).getPropertyValue("width").replace("px", ""));
    this.svgBgUri = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><polygon style="fill: #555555; stroke: none;" points="' + PolyPoints + '"/></svg>';
    var svgMain = document.createElement("svg");
    svgMain.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgMain.setAttribute("viewBox", "0 0 100 100");
    svgMain.setAttribute("width", "100%");
    svgMain.setAttribute("height", "100%");
    var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.style.fill = "#555";
    polygon.style.stroke = "none";
    polygon.setAttribute("points", PolyPoints);
    svgMain.appendChild(polygon);
    while (this.childNodes.length > 0) {
      this.removeChild(this.childNodes[0]);
    }
    //this.appendChild(svgMain);
    this.innerHTML = this.svgBgUri;
    this.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,' + this.svgBgUri + '\')';
    this.progress = percentage;
  }
}
HTMLDivElement.prototype.getCircleDegreeCoords = function(degree) {
  var leftPercent = Math.sin(toRadians(degree));
  var topPercent = Math.cos(toRadians(degree));
  var leftPx = 50 + (leftPercent * 50);
  var topPx = 50 - (topPercent * 50);
  return {
    left: leftPx,
    top: topPx
  };
}
HTMLDivElement.prototype.progress = 0;
function toRadians(angle) {
  return angle * (Math.PI / 180);
}
