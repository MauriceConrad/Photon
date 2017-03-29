(function() {
  var currTabGroup = null;
  window.addEventListener("mousedown", function(event) {
    // Check wether the target is a tab group
    var isTabGroup = hasParentClass(event.target, "tab-group");
    if (isTabGroup.success) {
      var group = isTabGroup.parents[isTabGroup.parents.length - 1];
      var isTabItem = hasParentClass(event.target, "tab-item");
      if (isTabItem.success && !hasParentClass(event.target, "icon-close-tab").success) {
        var item = isTabItem.parents[isTabItem.parents.length - 1];
        group.dragStart = [event.pageX, event.pageY];
        //item.classList.add("dragging");
        if (isDraggable(item)) {
          group.activeDraggingItem = item;
          group.classList.add("in-drag");
        }
        item.nodePos = getNodePos(item, group);
        // Activate tab item
        group.activateItem(item);
        currTabGroup = group;
      }
      var items = group.getElementsByClassName("tab-item");
      for (var i = 0; i < items.length; i++) {
        items[i].nodePos = i;
        items[i].bounding = items[i].getBoundingClientRect();
      }
    }
  });
  window.addEventListener("mouseup", function(event) {
    var x = event.pageX;
    var y = event.pageY;
    if (currTabGroup) {
      var items = currTabGroup.getElementsByClassName("tab-item");
      var itemsDraggable = getItemsDraggable(items);
      if (currTabGroup.activeDraggingItem) {
        var item = currTabGroup.activeDraggingItem;
        item.classList.remove("dragging");
        item.style.removeProperty("transform");
        var newPos = (function() {
          var pos = null;
          for (var i = 0; i < items.length; i++) {
            var leftX = items[i].bounding.left;
            var rightX = items[i].bounding.left + items[i].bounding.width;
            if (leftX <= x && rightX > x && isDraggable(items[i])) {
              pos = i;
            }
          }
          if (pos === null) {
            var firstItem = itemsDraggable[0];
            var lastItem = itemsDraggable[itemsDraggable.length - 1];
            pos = Math.abs(x - firstItem.bounding.left) >= Math.abs(x - (lastItem.bounding.left + lastItem.bounding.width)) ? lastItem.nodePos : firstItem.nodePos;
          }
          return pos;
        })();
        var diffX = items[newPos].bounding.left - item.bounding.left;
        diffX += diffX >= 0 ? -2 : 2;
        if (item.nodePos != newPos) item.style.transform = "translate(" + diffX + "px, 0px)";
        setTimeout(function(group) {
          group.moveItem(item, newPos);
          for (var i = 0; i < items.length; i++) {
            items[i].style.removeProperty("transform");
          }
          group.classList.remove("in-drag");
        }, getTransDur(item) * 1000, currTabGroup);
        currTabGroup.activeDraggingItem = null;
      }
      currTabGroup = null;
    }
  });
  window.addEventListener("mousemove", function(event) {
    var x = event.pageX;
    var y = event.pageY;
    if (currTabGroup && Math.abs(x - currTabGroup.dragStart[0]) >= 1) {
      var group = currTabGroup;
      var tabItems = group.getElementsByClassName("tab-item");
      if (group.activeDraggingItem) {
        var item = group.activeDraggingItem;
        item.classList.add("dragging");
        var bounding = item.getBoundingClientRect();
        // Drag active item
        var dragDiff = x - group.dragStart[0];
        item.style.transform = "translate(" + (dragDiff) + "px, 0px)";
        // Loop all tab items
        for (var i = 0; i < tabItems.length; i++) {
          var tabItem = tabItems[i];
          var leftX = tabItem.bounding.left;
          var rightX = tabItem.bounding.left + tabItem.bounding.width;
          if (i < item.nodePos) {
            if (x < rightX && isDraggable(tabItem)) {
              tabItem.style.transform = "translate(" + (bounding.width) + "px, 0px)";
            }
            else tabItem.style.removeProperty("transform");
          }
          if (i > item.nodePos) {
            if (x > leftX && isDraggable(tabItem)) {
              tabItem.style.transform = "translate(" + (-bounding.width) + "px, 0px)";
            }
            else tabItem.style.removeProperty("transform");
          }
        }
        var tabDragEvent = new CustomEvent("tabDrag", {
          detail: {
            tabPosition: item.nodePos,
            tab: item,
            drag: dragDiff
          }
        });
        group.dispatchEvent(tabDragEvent);
      }
    }
  });
  window.addEventListener("click", function(event) {
    var isTabGroup = hasParentClass(event.target, "tab-group");
    var group = isTabGroup.parents[isTabGroup.parents.length - 1];
    if (isTabGroup.success) {
      var isAddBtn = hasParentClass(event.target, "btn-add-tab");
      if (isAddBtn.success) {
        group.addTab({});
      }
    }
  });
  window.addEventListener("click", function(event) {
    var isTabGroup = hasParentClass(event.target, "tab-group");
    var group = isTabGroup.parents[isTabGroup.parents.length - 1];
    if (isTabGroup.success) {
      var isAddBtn = hasParentClass(event.target, "icon-close-tab");
      if (isAddBtn.success) {
        var isItem = hasParentClass(event.target, "tab-item");
        group.closeTab(isItem.parents[isItem.parents.length - 1], {});
      }
    }
  });
  HTMLDivElement.prototype.activateItem = function(item) {
    var isTabGroup = hasParentClass(this, "tab-group");
    if (isTabGroup.success) {
      var group = isTabGroup.parents[isTabGroup.parents.length - 1];
      var currActive = group.getElementsByClassName("active")[0];
      if (isEnableable(item) && currActive != item) {
        if (currActive) currActive.classList.remove("active");
        item.classList.add("active");
        // Fire activate event
        var tabActivateEvent = new CustomEvent("tabActivate", {
          detail: {
            tabPosition: item.nodePos,
            tab: item
          }
        });
        this.dispatchEvent(tabActivateEvent);
      }
    }
  }
  HTMLDivElement.prototype.moveItem = function(item, index) {
    var posBefore = item.nodePos;
    var items = this.getElementsByClassName("tab-item");
    this.insertBefore(item, items[index + (item.nodePos >= index ? 0 : 1)]);
    var tabPosEvent = new CustomEvent("positionChange", {
      detail: {
        tabPositionBefore: posBefore,
        tabPositionNew: index,
        tab: item
      }
    });
    if (posBefore != index) this.dispatchEvent(tabPosEvent);
  }
  HTMLDivElement.prototype.addTab = function(options) {
    var isTabGroup = hasParentClass(this, "tab-group");
    if (isTabGroup.success) {
      var group = isTabGroup.parents[isTabGroup.parents.length - 1];
      var opts = options.fillDefaults({
        position: "last",
        closeBtn: true,
        isActive: true,
        animated: true,
        content: document.createTextNode("New Tab")
      });
      var items = group.getElementsByClassName("tab-item");
      var itemsDraggable = getItemsDraggable(items);
      var newTab = document.createElement("div");
      newTab.classList.add("tab-item");
      if (opts.closeBtn) {
        var closeBtn = document.createElement("span");
        closeBtn.className = "icon-close-tab";
        newTab.appendChild(closeBtn);
      }
      newTab.appendChild(typeof opts.content === "string" ? document.createTextNode(opts.content) : opts.content);
      if (itemsDraggable.length > 0) {
        var appendRefItem = opts.position === "first" ? items[itemsDraggable[0].nodePos] : items[itemsDraggable[itemsDraggable.length - 1].nodePos + 1];
      }
      else {
        var appendRefItem = items[items.length - 1];
      }
      group.insertBefore(newTab, appendRefItem);
      if (opts.animated) {
        newTab.classList.add("adding");
        setTimeout(function() {
          if (itemsDraggable.length > 0) newTab.style.width = (itemsDraggable[0].bounding.width * itemsDraggable.length / (itemsDraggable.length + 1)) + "px";
        }, 10);
        setTimeout(function() {
          newTab.classList.remove("adding");
          newTab.style.removeProperty("width");
        }, itemsDraggable.length > 0 ? (getTransDur(newTab) * 1000) : 0);
      }
      newTab.nodePos = appendRefItem ? appendRefItem.nodePos : items.length - 1;
      var tabAddEvent = new CustomEvent("add", {
        detail: {
          tabPosition: newTab.nodePos,
          tab: newTab
        }
      });
      this.dispatchEvent(tabAddEvent);
      if (opts.isActive) group.activateItem(newTab);
    }
  }
  HTMLDivElement.prototype.closeTab = function(item, options) {
    var isTabGroup = hasParentClass(this, "tab-group");
    if (isTabGroup.success) {
      var group = isTabGroup.parents[isTabGroup.parents.length - 1];
      var opts = options.fillDefaults({
        animated: true
      });
      var items = group.getElementsByClassName("tab-item");
      var itemsDraggable = getItemsDraggable(items);
      if (item.classList.contains("active")) {
        var newActiveItem = items[item.nodePos + 1];
        group.activateItem(newActiveItem != undefined ? (isEnableable(newActiveItem) ? newActiveItem : items[item.nodePos - 1]) : itemsDraggable[0]);
      }
      item.classList.add("adding");
      item.style.width = item.bounding.width + "px";
      setTimeout(function() {
        item.style.removeProperty("width");
      }, 10);
      setTimeout(function() {
        group.removeChild(item);
      }, getTransDur(item) * 1000);
      var tabCloseEvent = new CustomEvent("close", {
        detail: {
          tabPosition: item.nodePos,
          tab: item
        }
      });
      this.dispatchEvent(tabCloseEvent);
    }
  };
  function isDraggable(item) {
    return !item.classList.contains("tab-item-fixed");
  }
  function isEnableable(item) {
    return item ? !item.classList.contains("btn") : null;
  }
  function getNodePos(e, parent) {
    for (var i = 0; i < parent.children.length; i++) {
      if (parent.children[i] === e) return i;
    }
  }
  function getTransDur(e) {
    return parseFloat(window.getComputedStyle(e, null).getPropertyValue("transition-duration").replace(/[a-z]/g, "").replace(/,/g, "."))
  }
  function getItemsDraggable(items) {
    var res = [];
    for (var i = 0; i < items.length; i++) {
      items[i].nodePos = i;
      if (isDraggable(items[i])) {
        res.push(items[i]);
      }
    }
    return res;
  }
  hasParentClass = function(currParent, className) {
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
  Object.prototype.fillDefaults = function (defaults) { /* Just a small self-made function to fill default objects */
    var keys = Object.keys(defaults);
    for (var i = 0; i < keys.length; i++) {
      if (typeof defaults[keys[i]] == "object") this[keys[i]] = this[keys[i]] != undefined ? this[keys[i]].fillDefaults(defaults[keys[i]]) : defaults[keys[i]];
      else if (!this[keys[i]]) this[keys[i]] = defaults[keys[i]];
    }
    return this;
  }

})();
