window.addEventListener("click", function(event) {
  var isDetailsList = event.target.hasParentClass("list-select");
  if (isDetailsList.success === true) {
    var liItem = event.target.hasParentTag("li");
    isDetailsList.parents[isDetailsList.parents.length - 1].setActiveItem(liItem.parents[liItem.parents.length - 1]);
  }
});
HTMLElement.prototype.setActiveItem = function(li) {
  if (this.classList.contains("list-select")) {
    while (this.getElementsByClassName("active").length > 0) {
      this.getElementsByClassName("active")[0].classList.remove("active");
    }
    li.classList.add("active");
  }
}
window.addEventListener("dragstart", function(event) {
  var isDragList = event.target.hasParentClass("list-editable");
  if (isDragList.success === true) {
    var list = isDragList.parents[isDragList.parents.length - 1];
    for (var i = 0; i < list.children.length; i++) {
      list.children[i].n = i;
    }
    list.classList.add("dragging");
    list.dragElement = event.target;
  }
});
window.addEventListener("dragenter", function(event) {
  var isDragList = event.target.hasParentClass("list-editable");
  if (isDragList.success === true) {
    var list = isDragList.parents[isDragList.parents.length - 1];
    var isLiItem = event.target.hasParentTag("li");
    var li = isLiItem.parents[isLiItem.parents.length - 1];
    var listItems = list.getElementsByTagName("li");
    for (var i = 0; i < listItems.length; i++) {
      listItems[i].classList.remove("drag-over");
    }
    li.classList.add("drag-over");
    list.dragTarget = li;
  }
});
window.addEventListener("dragend", function(event) {
  var currDragLists = document.getElementsByClassName("dragging");
  for (var i = 0; i < currDragLists.length; i++) {
    var items = currDragLists[i].getElementsByTagName("li");
    for (var a = 0; a < items.length; a++) {
      items[a].classList.remove("drag-over");
    }
    currDragLists[i].classList.remove("dragging");
  }
  var isDragList = event.target.hasParentClass("list-editable");
  if (isDragList.success === true) {
    var list = isDragList.parents[isDragList.parents.length - 1];
    var dragElementClone = list.dragElement.cloneNode(true);
    list.insertBefore(dragElementClone, list.children[list.dragTarget.n + 1]);
    list.removeChild(list.dragElement);
  }
});
HTMLElement.prototype.editList = function(li) {
  if (this.classList.contains("list-editable")) {
    console.log(this);
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
HTMLElement.prototype.hasParentTag = function(tagName) {
  tagName = tagName.toUpperCase();
  var currParent = this;
  var parents = [];
  while (currParent.tagName != undefined) {
    parents.push(currParent);
    if (currParent.tagName == tagName) {
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
