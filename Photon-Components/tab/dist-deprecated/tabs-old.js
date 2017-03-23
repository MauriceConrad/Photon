(function() {
  var tabControlReference = {
    currTabGroup: "none",
    parentHasClass: function(element, className) {
      var currParent = element;
      var containsClass = false;
      var classElement;
      var childs = [];
      while (currParent.parentNode != null && containsClass == false) {
        childs.push(currParent);
        if (currParent.classList) {
          if (currParent.classList.contains(className)) {
            containsClass = true;
            classElement = currParent;
          }
        }
        currParent = currParent.parentNode;
      }
      return {
        "containsClassName": containsClass,
        "classElement": classElement,
        "childs": childs
      };
    },
    fillObjDefaults: function(obj, defaultReference) {
      var objKeys = Object.keys(defaultReference);
      for (var i = 0; i < objKeys.length; i++) {
        if (obj[objKeys[i]] == undefined) {
          obj[objKeys[i]] = defaultReference[objKeys[i]];
        }
      }
      return obj;
    }
  };
  window.addEventListener("mousedown", function(event) {
    var hasParentClass = tabControlReference.parentHasClass(event.target, "tab-group");
    var element = hasParentClass.classElement;
    if (hasParentClass.containsClassName == true && element.initialized != true) {
      if (element.activeItem) {
        if (element.activeItem.classList.contains("dragging")) {
          console.log("Bug Handling");
          element.activeItem.left = 0;
        }
      }
      if (element.initialized != true) {
        element.initTabGroup(element);
      }
      element.mouseDownHandler(hasParentClass.childs[hasParentClass.childs.length - 2], event);

    }
  }, false);
  window.addEventListener("mouseup", function(event) {
    var element = tabControlReference.currTabGroup;
    element.mouseDown = false;
    var success = false;
    if (element.dragFireCount > 0) {
      for (var i = 0; i < element.tabItemsDraggable.length; i++) {
        if (event.pageX > element.tabItemsDraggable[i].leftDiff && event.pageX < element.tabItemsDraggable[i].leftDiff + element.tabItemsDraggable[i].offsetWidth) {
          element.activeItem.newNodePos = element.tabItemsDraggable[i].nodePos;
          success = true;
        }
      }
      if (event.pageX < element.tabItemsDraggable[0].leftDiff && success == false) {
        var tabItemCounter = 0;
        while (element.tabItems[tabItemCounter].classList.contains("tab-item-fixed") == true) {
          tabItemCounter++;
        }
        element.activeItem.newNodePos = tabItemCounter;
      }
      element.moveItem(element.activeItem, element.activeItem.newNodePos, true);
    }
    element.dragFireCount = 0;
  }, false);
  window.addEventListener("mousemove", function(event) {
    var element = tabControlReference.currTabGroup;
    if (element.mouseDown == true && element.activeItem.classList.contains("tab-item-fixed") == false) {
      element.dragFireCount++;
      if (element.dragFireCount == 1) {
        for (var i = 0; i < element.tabItemsDraggable.length; i++) {
          element.tabItemsDraggable[i].style.width = element.tabItemsDraggable[i].offsetWidth + "px";
          element.tabItemsDraggable[i].classList.add("dragging");
        }
      }
      if (element.dragFireCount > 10) {
        var relDrag =  event.pageX - element.dragStart;
        element.activeItem.style.left = relDrag + "px";
        //console.log("relDrag", relDrag);
        var tabDragEvent = new CustomEvent("tabDrag", {
          detail: {
            tabPosition: element.activeItem.nodePos,
            tab: element.activeItem,
            drag: relDrag
          }
        });
        element.dispatchEvent(tabDragEvent);
        for (var i = 0; i < element.tabItemsDraggable.length; i++) {
          if (element.tabItemsDraggable[i] != tabControlReference.currTabGroup.activeItem && element.tabItemsDraggable[i].classList.contains("btn") == false) {
            if (element.tabItemsDraggable[i].nodePos < tabControlReference.currTabGroup.activeItem.nodePos) {
              if (element.tabItemsDraggable[i].leftDiff + element.tabItemsDraggable[i].offsetWidth > event.pageX) {
                element.tabItemsDraggable[i].left = tabControlReference.currTabGroup.activeItem.offsetWidth;
                if (element.tabItemsDraggable[i].leftDiff < event.pageX) {
                  tabControlReference.currTabGroup.activeItem.newNodePos--;
                }
              }
              else {
                element.tabItemsDraggable[i].left = 0;
              }
            }
            if (element.tabItemsDraggable[i].nodePos > tabControlReference.currTabGroup.activeItem.nodePos) {
              if (element.tabItemsDraggable[i].leftDiff < event.pageX) {
                element.tabItemsDraggable[i].left = 0 - tabControlReference.currTabGroup.activeItem.offsetWidth;
                if (element.tabItemsDraggable[i].leftDiff + element.tabItemsDraggable[i].offsetWidth > event.pageX) {
                  tabControlReference.currTabGroup.activeItem.newNodePos = element.tabItemsDraggable[i].nodePos;
                }
              }
              else {
                element.tabItemsDraggable[i].left = 0;
              }
            }
            if (element.tabItemsDraggable[i].left != element.tabItemsDraggable[i].leftBefore) {
              element.tabItemsDraggable[i].drags++;
              element.tabItemsDraggable[i].style.left = element.tabItemsDraggable[i].left + "px";
            }
            element.tabItemsDraggable[i].leftBefore = element.tabItemsDraggable[i].left;
          }
        }
      }
    }
  }, false);
  HTMLDivElement.prototype.initTabGroup = function(element) {
    if (element.classList.contains("tab-group")) {
      if (element.initialized != true) {
        tabControlReference.currTabGroup = element;
        element.tabItems = element.getElementsByClassName("tab-item");
        element.tabItemsDraggable = [];
        for (var i = 0; i < element.tabItems.length; i++) {
          if (element.tabItems[i].classList.contains("tab-item-fixed") == false) {
            element.tabItemsDraggable.push(element.tabItems[i]);
          }
          if (element.tabItems[i].getElementsByClassName("icon-close-tab").length > 0) {
            //console.log(element.tabItems[i]);
            element.tabItems[i].getElementsByClassName("icon-close-tab")[0].addEventListener("click", function() {
              var tabGroupResult = tabControlReference.parentHasClass(this, "tab-group");
              var tabItemResult = tabControlReference.parentHasClass(this, "tab-item");
              tabGroupResult.classElement.closeTab(tabItemResult.classElement, {
                animated: true
              });

            }, false);
          }
          if (element.tabItems[i].classList.contains("btn-add-tab") && element.tabItems[i].hasEvent != true) {
            //console.log(element.tabItems[i]);
            element.tabItems[i].hasEvent = true;
            element.tabItems[i].addEventListener("click", function() {
              var newTabItem = element.addTab({
                position: "last",
                closeBtn: true,
                isActive: true,
                animated: true,
                content: document.createTextNode("New Tab")
              });
            }, false);
          }
        }
        element.activeItem = element.getElementsByClassName("active")[0];
        element.dragStart = 0;
        element.dragFireCount = 0;
        element.initTabItem = function(e, nodePosI) {
          e.addEventListener("mousedown", function(event) {
            element.mouseDownHandler(this, event);
          }, false);
          e.nodePos = nodePosI;
          e.left = 0;
          e.leftBefore = 0;
        }
        for (var i = 0; i < element.tabItems.length; i++) {
          element.initTabItem(element.tabItems[i], i);
        }
        element.mouseDownHandler = function(e, evt) {
          var closeBtnIndicator = tabControlReference.parentHasClass(evt.target, "icon-close-tab");
          if (closeBtnIndicator.containsClassName == false && e.classList.contains("btn") == false) {
            element.mouseDown = true;
            element.dragStart = evt.pageX;
            for (var i = 0; i < element.tabItems.length; i++) {
              element.tabItems[i].leftDiff = element.tabItems[i].offsetLeft;
              element.tabItems[i].newNodePos = element.tabItems[i].nodePos;
              element.tabItems[i].style.left = "0px";
            }
            element.activateItem(e);
          }
        }
        element.initialized = true;
      }
    }
  }
  HTMLDivElement.prototype.activateItem = function(e) {
    var hasParentClass = tabControlReference.parentHasClass(this, "tab-group");
    if (hasParentClass.containsClassName == true && e.classList.contains("btn") == false) {
      if (this.initialized != true) {
        this.initTabGroup(this);
      }
      if (e.classList.contains("active") == false) {
        if (this.activeItem) {
          this.activeItem.classList.remove("active");
        }
        this.activeItem = e;
        e.classList.add("active");
        var tabActivateEvent = new CustomEvent("tabActivate", {
  	      detail: {
            tabPosition: e.nodePos,
            tab: e
  	      }
        });
        this.dispatchEvent(tabActivateEvent);
      }
    }
    else {
      //console.error("Not allowed");
    }
  };
  HTMLDivElement.prototype.moveItem = function(e, pos, isAnimated) {
    var hasParentClass = tabControlReference.parentHasClass(this, "tab-group");
    if (e.classList.contains("tab-item-fixed") == true) {
      return console.error("Tab", e, "is fixed");
    }
    if (hasParentClass.containsClassName == true && e.classList.contains("tab-item") == true && e.classList.contains("tb-item-fixed") == false) {
      if (this.initialized != true) {
        this.initTabGroup(this);
      }
      var transitionKillTimeout = parseFloat(window.getComputedStyle(e, null).getPropertyValue("transition-duration").replace("s", "").replace(",", ".")) * 1000;
      if (isAnimated != true) {
        transitionKillTimeout = 0;
      }
      e.classList.add("active-in-transition");
      var styleLeftInt = parseInt(e.style.left.replace("px", ""));
      var targetAbsDiff = this.tabItems[pos].leftDiff - e.offsetLeft;
      var targetDiffRel = targetAbsDiff + styleLeftInt;
      var posBefore = e.nodePos;
      setTimeout(function(tabItem, tabGroup) {
        tabItem.style.left = targetDiffRel + "px";
        setTimeout(function(element) {
          if (e.nodePos != pos) {
            if (e.nodePos < pos) {
              var insertReference = element.tabItems[pos + 1];
            }
            if (e.nodePos > pos) {
              var insertReference = element.tabItems[pos];
            }
            element.insertBefore(e, insertReference);
          }
          e.classList.remove("active-in-transition");
          for (var i = 0; i < element.tabItems.length; i++) {
            element.tabItems[i].classList.remove("dragging");
            element.tabItems[i].style.removeProperty("width");
            element.tabItems[i].style.removeProperty("left");
            element.tabItems[i].nodePos = i;
            element.tabItems[i].left = 0;
            element.tabItems[i].leftBefore = 0;
            element.tabItems[i].mouseDown = false;
          }
          element.dragStart = 0;
          element.dragFireCount = 0;
          if (posBefore != pos) {
            var tabPositionChangeEvent = new CustomEvent("positionChange", {
      	      detail: {
                tabPositionBefore: posBefore,
                tabPositionNew: pos,
                tab: e
      	      }
            });
            element.dispatchEvent(tabPositionChangeEvent);
          }
        }, transitionKillTimeout, tabGroup);
      }, 10, e, this);
    }
    else {
      console.log("Not allowed");
    }
  };
  HTMLDivElement.prototype.addTab = function(options) {
    if (this.classList.contains("tab-group")) {
      options = tabControlReference.fillObjDefaults(options, {
        position: "last",
        closeBtn: true,
        isActive: false,
        animated: true,
        content: "New Tab"
      });
      var newTabItem = document.createElement("div");
      if (options.closeBtn == true) {
        var closeBtn = document.createElement("span");
        closeBtn.classList.add("icon-close-tab");
        newTabItem.appendChild(closeBtn);
      }
      if (typeof options.content == "object" && (options.content.tagName != undefined || options.content.nodeValue != undefined)) {
        var tabContentChild = options.content;
      }
      else if (typeof options.content == "string") {
        var tabContentChild = document.createTextNode(options.content)
      }
      else {
        console.log("Is something else", options.content);
      }
      newTabItem.classList.add("tab-item");
      newTabItem.appendChild(tabContentChild);
      var tabItems = this.getElementsByClassName("tab-item");
      if (options.position == "last") {
        var tabItemCounter = tabItems.length - 1;
        while (tabItems[tabItemCounter] != undefined && tabItems[tabItemCounter].classList.contains("tab-item-fixed")) {
          tabItemCounter--;
        }
        this.insertBefore(newTabItem, tabItems[tabItemCounter + 1]);
      }
      if (options.position == "first") {
        var tabItemCounter = 0;
        while (tabItems[tabItemCounter] != undefined && tabItems[tabItemCounter].classList.contains("tab-item-fixed")) {
          tabItemCounter++;
        }
        this.insertBefore(newTabItem, tabItems[tabItemCounter]);
      }
      var tabAddEvent = new CustomEvent("add", {
        detail: {
          tab: newTabItem,
          tabPosition: (tabItemCounter + 1)
        }
      });
      this.dispatchEvent(tabAddEvent);
      if (options.isActive == true) {
        if (this.initialized == true) {
          this.activateItem(newTabItem);
        }
        else {
          var activeClassArray = this.getElementsByClassName("active");
          if (activeClassArray.length > 0) {
            activeClassArray[0].classList.remove("active");
          }
          newTabItem.classList.add("active");
        }
      }
      if (options.animated == true) {
        var orgWidth = newTabItem.offsetWidth;
        newTabItem.classList.add("adding");
        var transitionKillTimeout = parseFloat(window.getComputedStyle(newTabItem, null).getPropertyValue("transition-duration").replace("s", "").replace(",", ".")) * 1000;
        setTimeout(function() {
          newTabItem.style.width = orgWidth + "px";
          setTimeout(function() {
            newTabItem.style.removeProperty("width");
            newTabItem.classList.remove("adding");
          }, transitionKillTimeout);
        }, 10);
      }
      this.initialized = false;
      return newTabItem;
    }

  };
  HTMLDivElement.prototype.closeTab = function(tabItem, options) {
    if (this.classList.contains("tab-group")) {
      if (this.initialized != true) {
        this.initTabGroup(this);
      }
      options = tabControlReference.fillObjDefaults(options, {
        animated: true
      });
      var orgWidth = tabItem.offsetWidth;
      var transitionKillTimeout = parseFloat(window.getComputedStyle(tabItem, null).getPropertyValue("transition-duration").replace("s", "").replace(",", ".")) * 1000;
      if (options.animated == false) {
        transitionKillTimeout = 0;
      }
      var normalTabs = [];
      for (var i = 0; i < this.tabItems.length; i++) {
        if (this.tabItems[i].classList.contains("tab-item-fixed") == false) {
          normalTabs.push(this.tabItems[i]);
        }
      }
      if (normalTabs.length > 1 || true) {
        tabItem.classList.add("adding");
        tabItem.style.width = orgWidth + "px";
        if (tabItem.classList.contains("active")) {
          if (this.children[tabItem.nodePos + 1].classList.contains("btn") == false &&
              this.children[tabItem.nodePos + 1].classList.contains("tab-item-fixed") == false) {
              this.activateItem(this.children[tabItem.nodePos + 1]);
          }
          else {
            this.activateItem(this.children[tabItem.nodePos - 1]);
          }
        }
        var tabCloseEvent = new CustomEvent("close", {
          detail: {
            tab: tabItem,
            tabPosition: tabItem.nodePos
          }
        });
        this.dispatchEvent(tabCloseEvent);
        setTimeout(function(tabItem, tabGroup) {
          tabItem.style.width = 0 + "px";
          setTimeout(function(tabGroup, tabItem) {
            tabGroup.removeChild(tabItem);
            tabGroup.initialized = false;
            tabGroup.initTabGroup(tabGroup);
          }, transitionKillTimeout, tabGroup, tabItem);
        }, 10, tabItem, this);
      }
      else {
        console.error("Not enough tab-items");
      }
    }
  }
})();
