(function() {
  window.addEventListener("mousedown", function(event) {
    var isBtn = hasParentSelector(event.target, ".btn-system:not(.btn-active)");
    if (isBtn) {
      var btn = isBtn[isBtn.length - 1];
      var bounds = btn.getBoundingClientRect();
      btn.style.width = bounds.width + "px";
      btn.modifiedWidth = btn.style.width;
      btn.classList.add("btn-active");
    }
  });
  window.addEventListener("mouseup", function() {
    var btns = document.getElementsByClassName("btn-system");
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].style.width === btns[i].modifiedWidth) {
        btns[i].style.removeProperty("width");
        btns[i].classList.remove("btn-active");
      }
    }
  });
  function hasParentSelector(e, selector) {
    var children = [];
    while ("matches" in e && !e.matches(selector)) {
      children.push(e);
      e = e.parentNode;
    }
    children.push(e);
    return ("matches" in e && e.matches(selector)) ? children : false;
  }

})();
