function Messenger(mainElement, options) {
  var childProcess = require('child_process');
  var exec = childProcess.exec;
  var self = this;
  var soundPath = "dist/sounds/";
  var sounds = {
    self: new Audio(soundPath + "/Sent_Message.wav"),
    extern: new Audio(soundPath + "/Received_Message.wav")
  }
  this.messageContainer = mainElement.getElementsByClassName("messages")[0];
  this.messageContainer.addEventListener("click", function() {
    if (this.activeMessage != undefined) this.activeMessage.classList.remove("active");
  });
  this.messageContainer.addEventListener("copy", function() {
    var clipboardText = this.activeMessage.getElementsByClassName("message-content")[0].textContent.replace(/"/g, '\\"');
    console.log(clipboardText);
    if (this.activeMessage.classList.contains("active")) {
      exec("osascript -e 'set the clipboard to \"" + clipboardText + "\"'", function(err, stdout, stderr) {});
    }
  });
  this.addMessage = function(options) {
    var type = options.type != undefined ? options.type : "self";
    var time = options.time != undefined ? (options.time) : (new Date().getTime());
    if (options.description) {
      var description = options.description.parseVars({
        time: parseTime(new Date(time))
      });
    }
    else {
      var description = "";
    }
    var messagesContent = (typeof options.content == "string" ? document.createTextNode(options.content) : options.content);

    var message = createElement({
      tagName: "li",
      attributes: {
        "data-type": type,
        "data-time": time,
        "data-message-id": createMessageHash(time),
        "data-account": options.account,
        "data-receiver": options.receiver
      },
      childs: [
        createElement({
          tagName: "div",
          className: "message-content",
          childs: [
            messagesContent
          ],
          eventListeners: [
            {
              type: "dblclick",
              callback: function() {
                self.selectMessage(this)
              }
            }
          ]
        }),
        createElement({
          tagName: "div",
          className: "message-description",
          childs: [
            document.createTextNode(description)
          ]
        })
      ]
    });
    self.messageContainer.appendChild(message);
    var messageAppResources = getUserHome() + "/../../Applications/Messages.app/Contents/Resources";
    var soundFile = options.sound != undefined ? (options.sound == "auto"? (type) : (options.sound)) : (type);
    if (soundFile != "none" && type != "system") sounds[soundFile].play();
    self.scrollToBottom();

  }
  this.getMessages = function() {
    var messages = [];
    var items = self.messageContainer.getElementsByTagName("li");
    for (var i = 0; i < items.length; i++) {
      var content = items[i].getElementsByClassName("message-content")[0];
      var description = items[i].getElementsByClassName("message-description")[0];
      messages.push({
        type: items[i].getAttribute("data-type"),
        time: items[i].getAttribute("data-time"),
        id: items[i].getAttribute("data-message-id"),
        content: content.innerHTML,
        description: description != undefined ? description.innerHTML : "none",
        account: items[i].getAttribute("data-account"),
        receiver: items[i].getAttribute("data-receiver")
      });
    }
    return messages;
  }
  this.scrollToBottom = function() {
    var scrollPos = self.messageContainer.scrollTop;
    var targetPos = self.messageContainer.scrollHeight - self.messageContainer.offsetHeight;
    self.messageContainer.scrollTop = targetPos;
  }
  this.selectMessage = function(e) {
    self.messageContainer.activeMessage = e.parentNode;
    self.messageContainer.activeMessage.classList.add("active");
    var selectEvent = new CustomEvent("select");
    selectEvent.detail = {
      message: self.messageContainer.activeMessage
    }
    self.messageContainer.dispatchEvent(selectEvent);
  }

  function createMessageHash(time) {
    var chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "!", "?", "$", "§", "%"];
    var randomStr = "";
    for (var i = 0; i < 10; i++) {
      randomStr += chars[Math.round(randomNumber(chars.length - 1))];
    }
    var timeStr = "";
    for (var i = 0; i < time.toString().length; i++) {
      timeStr += chars[time.toString()[i]];
    }
    return "#" + timeStr + "-" + randomStr
  }
  function randomNumber(start, end) {
    if (end == undefined) {
      end = start;
      start = 0;
    }
    var diff = end - start;
    var r = Math.random() * diff;
    return start + r;
  }
}
function createElement(options) {
  options.attributes = options.attributes == undefined ? {} : options.attributes;
  options.childs = options.childs == undefined ? [] : options.childs;
  options.eventListeners = options.eventListeners == undefined ? [] : options.eventListeners;
  options.className = options.className == undefined ? "" : options.className;
  var e = document.createElement(options.tagName);
  e.setAttribute("class", options.className);
  for (var i = 0; i < Object.keys(options.attributes).length; i++) {
    e.setAttribute(Object.keys(options.attributes)[i], options.attributes[Object.keys(options.attributes)[i]]);
  }
  for (var i = 0; i < options.childs.length; i++) {
    if (typeof options.childs[i] == "string") {
      e.innerHTML += options.childs[i];
    }
    else {
      e.appendChild(options.childs[i]);
    }
  }
  for (var i = 0; i < options.eventListeners.length; i++) {
    e.addEventListener(options.eventListeners[i].type, options.eventListeners[i].callback);
  }
  return e;
}
String.prototype.parseVars = function(vars) {
  var startPos = 0;
  var newStr = this.toString();
  while (newStr.indexOf("{{", startPos) >= 0) {
    var startsAt = newStr.indexOf("{{", startPos);
    var endsAt = newStr.indexOf("}}", startsAt);
    startPos = startsAt + 2;
    if (endsAt >= 0) {
      var name = newStr.substring(startPos, endsAt);
      newStr = newStr.replace("{{" + name + "}}", vars[name]);
    }
  }
  return newStr;
}
function parseTime(time, splitter) {
  return time.getHours() + (splitter != undefined ? splitter : ":") + time.getMinutes()
}
function getUserHome() {
  try {
    userHome = process.env.HOME || process.env.USERPROFILE;
  } catch (e) {
    userHome = "";
  }
  return userHome;
}

var childProcess = require('child_process');
var exec = childProcess.exec;

window.addEventListener("click", function(event) {
  var hasParent = event.target.hasParentClass("btn-emojis");
  if (hasParent.success === true) {
    var btn = hasParent.parents[hasParent.parents.length - 1];
    var target = document.querySelector(btn.getAttribute("data-insert-target"));
    if (target) {
      target.focus();
    }
    var command = 'osascript -e \'tell application "System Events" to key code 49 using {control down, command down}\'';
    exec(command);
  }
});

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
