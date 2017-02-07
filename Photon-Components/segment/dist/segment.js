(function() {
  window.addEventListener("click", function() {
    var isBtnGroup = parentHasClass(event.target, "btn-group");
    var clickedBtn = isBtnGroup.childs[isBtnGroup.childs.length - 1];
    if (isBtnGroup.containsClassName == true) {
      isBtnGroup.classElement.updateBtnGroup(clickedBtn);
    }

  }, false);
  HTMLDivElement.prototype.updateBtnGroup = function(target) {
    if (this.classList.contains("btn-group")) {
      if (this.getAttribute("data-group-relationship") == "absolute" ||
          this.getAttribute("data-group-relationship") == "abs") {
        var activeElement = this.getElementsByClassName("active")[0];
        if (activeElement) activeElement.classList.remove("active");
        target.style.width = (target.offsetWidth) + "px";
        target.classList.add("active");
        var relationship = "absolute";
      }
      if (this.getAttribute("data-group-relationship") == "none") {
        var relationship = "none";
      }
      if (this.getAttribute("data-group-relationship") != "abs" &&
          this.getAttribute("data-group-relationship") != "absolute" &&
          this.getAttribute("data-group-relationship") != "none") {
        if (target.classList.contains("active")) {
          target.classList.remove("active");
          //target.style.width = (target.offsetWidth - 1) + "px";
        }
        else {
          target.classList.add("active");
          //target.style.width = (target.offsetWidth + 1) + "px";
        }
        var relationship = "relative";;
      }
      var btnGroupEvent = new CustomEvent("activate", {
        detail: {
          targetBtn: target,
          groupRelationship: relationship
        }
      });
      this.dispatchEvent(btnGroupEvent);
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
  function parentHasClass(element, className) {
    var currParent = element;
    var containsClass = false;
    var classElement;
    var childs = [];
    while (currParent.parentNode != null && containsClass == false) {
      childs.push(currParent);
      currParent = currParent.parentNode;
      if (currParent.classList) {
        if (currParent.classList.contains(className)) {
          containsClass = true;
          classElement = currParent;
        }
      }
    }
    return {
      "containsClassName": containsClass,
      "classElement": classElement,
      "childs": childs
    };
  }
  window.addEventListener("blur", function() {
    document.getElementsByClassName("window")[0].classList.add("blur");
  });
  window.addEventListener("focus", function() {
    document.getElementsByClassName("window")[0].classList.remove("blur");
  });

})();
