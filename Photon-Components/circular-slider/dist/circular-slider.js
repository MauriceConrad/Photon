(function() {
  // Drive-By Initialization
  var mousedown = false;
  var activeCircular= false;
  window.addEventListener("mousedown", function(event) {
    var isCircularSlider = event.target.hasParentClass("circular-slider");
    if (isCircularSlider.success) {
      var slider = isCircularSlider.parents[isCircularSlider.parents.length - 1];
      activeCircular = slider;
    }
    mousedown = true;
    handleDrag(event);
  });
  window.addEventListener("mouseup", function(event) {
    activeCircular = false;
    mousedown = false;
  });
  window.addEventListener("mousemove", handleDrag);
  function handleDrag(event) {
    if (activeCircular) {
      var rect = activeCircular.getBoundingClientRect();
      var centerPoint = [rect.left + rect.width / 2, rect.top + rect.height / 2];
      var diff = [event.pageX - centerPoint[0], event.pageY - centerPoint[1]];
      var tan = diff[0] / diff[1];
      var angle = (diff[1] >= 0 ? 200 : (diff[0] >= 0 ? 0 : 400)) - Math.atan(tan) * (200 / Math.PI);
      activeCircular.setValue(angle);
      var changeEvent = new CustomEvent("change", {
        detail: {

        }
      });
      activeCircular.dispatchEvent(changeEvent);
    }
  }
  HTMLDivElement.prototype.setValue = function(angle) {
    if (this.classList.contains("circular-slider")) {
      var deg = 360 / 400 * angle;
      var dot = this.getElementsByClassName("dot")[0];
      if (dot) dot.style.transform = 'translate(0px, -140%) rotate(' + deg + 'deg)';
      this.value = angle;
    }
  }




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

})();
