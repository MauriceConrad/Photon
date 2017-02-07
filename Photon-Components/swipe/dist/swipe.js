var electron = require('electron');
var mainWindow = electron.remote.getCurrentWindow();


var swipeReference = {
  lastSwipeItem: 0,
  lastElement: 0,
  isNotASwipeItem: false,
  wheelHasStarted: true,
  scrollEnded: false,
  transTimeout: 0,
  overscrolled: false,
  scaleLeftActions: function(element, width) {
    var swipeActionWidth = 0;
    var actionLeft = 0;
    var wasOverscrolledIsTrue = false;
    if (element.leftSwipeAction.wasOverscrolled == true) {
      wasOverscrolledIsTrue = true;
    }
    if (element.leftSwipeAction.completeWidth >= width) {
      swipeActionWidth = width;
      actionLeft = width / element.leftActions.length;
      element.leftSwipeAction.wasOverscrolled = false;
      if (element.leftActions[0]) {
        element.leftActions[0].style.removeProperty("z-index");
      }
    }
    else {
      swipeActionWidth = element.leftSwipeAction.completeWidth + ((width - element.leftSwipeAction.completeWidth) * 0.5);
      actionLeft = element.leftSwipeAction.completeWidth / element.leftActions.length;
      element.leftSwipeAction.wasOverscrolled = true;
      if (true) {
        if (width - element.leftSwipeAction.completeWidth > 110) {
          /*element.leftActions[0].style.transition = "width 0.3s";*/
          element.classList.add("smart-action");
          if (element.leftActions[0]) {
            element.leftActions[0].style.zIndex = "3";
            element.leftActions[0].style.removeProperty("width");
          }
          if (swipeReference.smartActionTimeout != undefined) {
            clearTimeout(swipeReference.smartActionTimeout);
          }
        }
        else {
          element.classList.remove("smart-action");
          //element.leftActions[0].style.width = (element.leftSwipeAction.completeWidth / element.leftActions.length) + "px";
        }
      }
    }
    element.leftSwipeAction.style.width = swipeActionWidth + "px";
    if (element.leftActions.length > 1) {
      for (var i = 0; i < element.leftActions.length; i++) {
        element.leftActions[i].style.left = (actionLeft * i) + "px";
      }
    }
    else if (element.leftActions.length == 1) {
      element.leftActions[0].style.left = (0 - (element.leftSwipeAction.completeWidth - actionLeft)) + "px";
    }
  },
  scaleRightActions: function(element, width) {
    var actionRight = 0;
    var swipeActionWidth = 0;
    var wasOverscrolledIsTrue = false;
    if (element.leftSwipeAction.wasOverscrolled == true) {
      wasOverscrolledIsTrue = true;
    }
    if (element.rightSwipeAction.completeWidth >= width) {
      actionRight = width / element.rightActions.length;
      swipeActionWidth = width;
      element.rightSwipeAction.wasOverscrolled = false;
    }
    else {
      actionRight = element.rightSwipeAction.completeWidth / element.rightActions.length;
      swipeActionWidth = element.rightSwipeAction.completeWidth + ((width - element.rightSwipeAction.completeWidth) * 0.5);
      element.rightSwipeAction.wasOverscrolled = true;
    }
    element.rightSwipeAction.style.width = swipeActionWidth + "px";
    element.itemInner.style.marginLeft = (0 - swipeActionWidth) + "px";
    if (element.rightActions.length > 1) {
      for (var i = 0; i < element.rightActions.length; i++) {
        element.rightActions[i].style.right = (i * actionRight) + "px";
      }
    }
    else if (element.rightActions.length == 1) {
      element.rightActions[0].style.right = (0 - (element.rightSwipeAction.completeWidth - actionRight)) + "px";
    }
  },
  updateLeftActionManually: function(swipe, transDelay) {
    var transDiff = swipe - (0 - swipeReference.lastSwipeItem.swipe);
    if (transDiff < 0) {
      transDiff = 0 - transDiff;
    }
    transDelay = transDiff * 0.003 + 0.2;
    swipeReference.lastSwipeItem.swipe = 0 - swipe;
    swipeReference.updateTransitions(swipeReference.lastSwipeItem.leftSwipeAction, swipeReference.lastSwipeItem.leftActions, "all " + transDelay + "s", "all " + transDelay + "s");
    setTimeout(function() {
      swipeReference.scaleLeftActions(swipeReference.lastSwipeItem, swipe);
      swipeReference.transTimeout = setTimeout(function() {
        swipeReference.updateTransitions(swipeReference.lastSwipeItem.leftSwipeAction, swipeReference.lastSwipeItem.leftActions, "none", "none");
      }, transDelay * 1000);
    }, 10);

  },
  updateRightActionManually: function(swipe, transDelay) {
    var transDiff = swipe - swipeReference.lastSwipeItem.swipe;
    if (transDiff < 0) {
      transDiff = 0 - transDiff;
    }
    transDelay = transDiff * 0.003 + 0.2;
    swipeReference.lastSwipeItem.swipe = swipe;
    swipeReference.updateTransitions(swipeReference.lastSwipeItem.rightSwipeAction, swipeReference.lastSwipeItem.rightActions, "width " + transDelay + "s", "right " + transDelay + "s");
    swipeReference.lastSwipeItem.itemInner.style.transition = "margin-left " + transDelay + "s";
    setTimeout(function() {
      swipeReference.scaleRightActions(swipeReference.lastSwipeItem, swipe);
      swipeReference.transTimeout = setTimeout(function() {
        swipeReference.updateTransitions(swipeReference.lastSwipeItem.rightSwipeAction, swipeReference.lastSwipeItem.rightActions, "none", "none");
        swipeReference.lastSwipeItem.itemInner.style.transition = "none";
      }, transDelay * 1000);
    }, 10);
  },
  updateTransitions: function(swipeAction, swipes, transStr1, transStr2) {
    if (swipeAction.style) {
      swipeAction.style.transition = transStr1;
      for (var i = 0; i < swipes.length; i++) {
        swipes[i].style.transition = transStr2;
      }
    }
  },
  fireEvent: function(dir, element, actions, eventType, isSmart) {
    isSmart = isSmart == true ? true : false;
    var swipeEvent = new CustomEvent(eventType, {
	     detail: {
		      "direction": dir,
          "element": element,
          "actions": actions,
          "swipeItem": swipeReference.lastSwipeItem,
          "smart": isSmart
	     }
    });
    swipeReference.lastSwipeItem.dispatchEvent(swipeEvent);
  }
};

window.addEventListener("wheel", function(evt) {
  var isSwipeItem = hasParent(event.target, "list-item-swipe");
  var element = isSwipeItem.element;
  if (swipeReference.wheelHasStarted == true || element != swipeReference.lastElement) {
    swipeReference.lastElement = element;
    swipeReference.lastSwipeItem = element;
    swipeReference.isNotASwipeItem = false;
    if (isSwipeItem.hasParent == true) {
      element.hasLeftSwipes = false;
      element.hasRightSwipes = false;
      element.leftSwipeAction = "none";
      element.rightSwipeAction = "none";
      element.itemInner = "none";
      element.leftActions = [];
      element.rightActions = [];
      element.swipeStart = 0;
      element.swipeDir = "none";
      element.overscroll = 0;
      element.inTouch = true;
      element.wasInLeft = false;
      element.wasInRight = false;
      if (element.swipePos == undefined) {
        element.swipePos = "center";
      }
      if (element.swipe == undefined) {
        element.swipe = 0;
      }
      element.leftSwipeAction.wasOverscrolled == false;
      var swipeActionNodes = element.getElementsByClassName("swipe-actions");
      for (var i = 0; i < swipeActionNodes.length; i++) {
        if (swipeActionNodes[i].classList.contains("swipe-actions-left")) {
          element.hasLeftSwipes = true;
          element.leftSwipeAction = swipeActionNodes[i];
          element.leftActions = element.leftSwipeAction.getElementsByClassName("action");
          for (var a = 0; a < element.leftActions.length; a++) {
            if (element.leftActions[a].clickEvent != true) {
              element.leftActions[a].addEventListener("click", function() {
                swipeReference.fireEvent("left", this, swipeReference.lastSwipeItem.leftActions, "action", false);
                swipeReference.updateLeftActionManually(0, 0.5);
              }, false);
            }
            element.leftActions[a].clickEvent = true;
          }
        }
        if (swipeActionNodes[i].classList.contains("swipe-actions-right")) {
          element.hasRightSwipes = true;
          element.rightSwipeAction = swipeActionNodes[i];
          element.rightActions = element.rightSwipeAction.getElementsByClassName("action");
          for (var a = 0; a < element.rightActions.length; a++) {
            if (element.rightActions[a].clickEvent != true) {
              element.rightActions[a].addEventListener("click", function() {
                swipeReference.fireEvent("right", this, swipeReference.lastSwipeItem.rightActions, "action", false);
                swipeReference.updateRightActionManually(0, 0.5);
              }, false);
            }
            element.rightActions[a].clickEvent = true;
          }
        }
      }
      element.itemInner = element.getElementsByClassName("item-inner")[0];
      if (element.absoluteHeight == undefined) {
        element.absoluteHeight = element.offsetHeight;
      }
      if (element.hasLeftSwipes) {
        element.leftSwipeAction.style.height = element.absoluteHeight + "px";
        element.leftSwipeAction.completeWidth = 0;
        for (var i = 0; i < element.leftActions.length; i++) {
          element.leftActions[i].completeBeforeWidth = 0;
          for (var a = i; a > 0; a--) {
            element.leftActions[i].completeBeforeWidth += element.leftActions[a - 1].offsetWidth;
          }
          element.leftActions[i].orgWidth = element.leftActions[i].offsetWidth;
          element.leftSwipeAction.completeWidth += element.leftActions[element.leftActions.length - 1].offsetWidth;
        }
      }
      if (element.hasRightSwipes) {
        element.rightSwipeAction.style.height = element.absoluteHeight + "px";
        element.rightSwipeAction.completeWidth = 0;
        for (var i = 0; i < element.rightActions.length; i++) {
          element.rightActions[i].completeBeforeWidth = 0;
          for (var a = i; a > 0; a--) {
            element.rightActions[i].completeBeforeWidth += element.rightActions[a - 1].offsetWidth;
          }
          element.rightActions[i].orgWidth = element.rightActions[i].offsetWidth;
          element.rightSwipeAction.completeWidth += element.rightActions[i].offsetWidth;
        }
      }
      if (element.hasLeftSwipes == true && element.leftActions.length > 0) {

      }
    }
    else {
      swipeReference.isNotASwipeItem = true;
    }
  }
  else if (swipeReference.scrollEnded == false && swipeReference.isNotASwipeItem == false) {
    var isSwipeItem = hasParent(event.target, "list-item-swipe");
    var element = isSwipeItem.element;
    swipeReference.lastSwipeItem = element;
    if (isSwipeItem.hasParent == true) {
      if (
            ((element.swipe + event.deltaX > 0 && element.wasInLeft == true) || (element.swipe + event.deltaX > 0 && element.hasRightSwipes == false))
            ||
            ((element.swipe + event.deltaX < 0 && element.wasInRight == true) || (element.swipe + event.deltaX < 0 && element.hasLeftSwipes == false))
          ) {
      }
      else {
        element.swipe += event.deltaX;
        if (element.swipe < 0) {
          element.swipePos = "left";
          element.wasInLeft = true;
        }
        if (element.swipe > 0) {
          element.swipePos = "right";
          element.wasInRight = true;
        }
        if (element.swipeDirStart == undefined) {
          element.swipeDirStart = element.swipePos;
        }
        if (event.deltaX < 0) {
          element.swipeDir = "left";
        }
        if (event.deltaX > 0) {
          element.swipeDir = "right";

        }
        if (element.swipePos == "left") {
          swipeReference.scaleLeftActions(element, (0 - element.swipe));
        }
        if (element.swipePos == "right") {
          swipeReference.scaleRightActions(element, element.swipe);
        }
      }
    }
  }
  if (swipeReference.isNotASwipeItem == false) {
    swipeReference.wheelHasStarted = false;
  }
}, false);
mainWindow.on("scroll-touch-begin", function(event) {
  swipeReference.scrollEnded = false;
  if (swipeReference.lastSwipeItem) {
    swipeReference.lastSwipeItem.swipeDirStart = swipeReference.lastSwipeItem.swipePos;
    swipeReference.lastSwipeItem.inTouch = true;
    swipeReference.lastSwipeItem.wasInLeft = false;
    swipeReference.lastSwipeItem.wasInRight = false;
    clearTimeout(swipeReference.transTimeout);
    /*swipeReference.updateTransitions(swipeReference.lastSwipeItem.leftSwipeAction, swipeReference.lastSwipeItem.leftActions, "none", "none");
    swipeReference.updateTransitions(swipeReference.lastSwipeItem.rightSwipeAction, swipeReference.lastSwipeItem.rightActions, "none", "none");
    swipeReference.lastSwipeItem.itemInner.style.transition = "none";*/
    for (var i = 0; i < swipeReference.lastSwipeItem.leftActions.length; i++) {
      swipeReference.lastSwipeItem.leftActions[i].style.removeProperty("transition");
    }
    for (var i = 0; i < swipeReference.lastSwipeItem.rightActions.length; i++) {
      swipeReference.lastSwipeItem.rightActions[i].style.removeProperty("transition");
    }
    if (swipeReference.lastSwipeItem.leftSwipeAction.style) {
      swipeReference.lastSwipeItem.leftSwipeAction.style.removeProperty("transition");
    }
    if (swipeReference.lastSwipeItem.rightSwipeAction.style) {
      swipeReference.lastSwipeItem.rightSwipeAction.style.removeProperty("transition");
    }

  }

}, false);
mainWindow.on("scroll-touch-end", function(event) {
  swipeReference.wheelHasStarted = true;
  swipeReference.scrollEnded = true;
  if (swipeReference.lastSwipeItem) {
    swipeReference.lastSwipeItem.inTouch = false;
    if (swipeReference.lastSwipeItem.swipePos == "left") {
      if (0 - swipeReference.lastSwipeItem.swipe > swipeReference.lastSwipeItem.leftSwipeAction.completeWidth) {
        swipeReference.overscrolled = true;
      }
      else {
        swipeReference.overscrolled = false;
      }
      if (swipeReference.lastSwipeItem.swipeDir == "left" || (swipeReference.lastSwipeItem.swipeDir == "right" && swipeReference.overscrolled == true)) {
        //console.log("open left");
        if (swipeReference.lastSwipeItem.classList.contains("smart-action")) {
          swipeReference.lastSwipeItem.classList.remove("smart-action");
          swipeReference.fireEvent("left", swipeReference.lastSwipeItem.leftActions[0], swipeReference.lastSwipeItem.leftActions, "action", true);
          swipeReference.updateLeftActionManually(0, 0.5);
          swipeReference.fireEvent("left", swipeReference.lastSwipeItem.leftSwipeAction, swipeReference.lastSwipeItem.leftActions, "close");
          //swipeReference.lastSwipeItem.leftActions[0].style.width = (swipeReference.lastSwipeItem.leftSwipeAction.completeWidth / swipeReference.lastSwipeItem.leftActions.length) + "px";
        }
        else {
          swipeReference.updateLeftActionManually(swipeReference.lastSwipeItem.leftSwipeAction.completeWidth, 0.5);
          swipeReference.fireEvent("left", swipeReference.lastSwipeItem.leftSwipeAction, swipeReference.lastSwipeItem.leftActions, "open");
        }
      }
      if (swipeReference.lastSwipeItem.swipeDir == "right" && swipeReference.overscrolled == false) {
        swipeReference.updateLeftActionManually(0, 0.5);
        swipeReference.fireEvent("left", swipeReference.lastSwipeItem.leftSwipeAction, swipeReference.lastSwipeItem.leftActions, "close");
      }
    }
    if (swipeReference.lastSwipeItem.swipePos == "right") {
      if (swipeReference.lastSwipeItem.swipe > swipeReference.lastSwipeItem.rightSwipeAction.completeWidth) {
        swipeReference.overscrolled = true;
      }
      else {
        swipeReference.overscrolled = false;
      }
      if (swipeReference.lastSwipeItem.swipeDir == "right" || (swipeReference.lastSwipeItem.swipeDir == "left" && swipeReference.overscrolled == true)) {
        swipeReference.updateRightActionManually(swipeReference.lastSwipeItem.rightSwipeAction.completeWidth, 0.5);
        //console.log("open right");
        swipeReference.fireEvent("right", swipeReference.lastSwipeItem.rightSwipeAction, swipeReference.lastSwipeItem.rightActions, "open");
      }
      if (swipeReference.lastSwipeItem.swipeDir == "left" && swipeReference.overscrolled == false) {
        swipeReference.updateRightActionManually(0, 0.5);
        swipeReference.fireEvent("right", swipeReference.lastSwipeItem.rightSwipeAction, swipeReference.lastSwipeItem.rightActions, "close");
      }
    }
  }

}, false);

function hasParent(e, className) {
  var currParent = e.parentNode;
  var parent = e;
  var hasParentSuccess = false;
  var hasParentResult = false;
  var parentNode;
  while (hasParentSuccess == false) {
    if (parent) {
      if (parent.classList) {
        if (parent.classList.contains(className)) {
          hasParentSuccess = true;
          hasParentResult = true;
          parentNode = parent;
        }
        else {
          if (parent.parentNode) {
            parent = parent.parentNode;
          }
        }
      }
      else {
        hasParentSuccess = true;
        hasParentResult = false;
      }
    }
  }
  return {
    hasParent: hasParentResult,
    element: parentNode
  };
}
