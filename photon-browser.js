(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class ButtonGroup extends HTMLElement {
  constructor() {
    super();

    this.__typeHandler = {
      absolute: btn => this.__typeAbsoluteHandle(btn),
      relative: btn => this.__typeRelativeHandle(btn),
    };

    this.addEventListener("click", this.__handleClick);
  }
  activate(button) {
    let typeHandler = this.__typeHandler[this.type];
    typeHandler(button);
  }
  __handleClick(event) {
    const button = event.target.closest(".btn");
    if (button) {
      this.activate(button);

      button.dispatchEvent(new CustomEvent("activate", {
        bubbles: true,
        detail: {
          button: button
        }
      }));
    }
  }
  __typeAbsoluteHandle(button) {
    for (let button of this.buttons) {
      button.classList.remove("active");
    }
    button.classList.add("active");
  }
  __typeRelativeHandle(button) {
    if (button.classList.contains("active")) {
      button.classList.remove("active");
    }
    else {
      button.classList.add("active");
    }
  }
  attributeChangedCallback(attr, oldValue, newValue) {

  }
  get buttons() {
    return this.getElementsByClassName("btn");
  }
  get type() {
    return this.getAttribute("type") || "relative";
  }
  set type(value) {
    return this.setAttribute("type", value);
  }
}
ButtonGroup.observedAttributes = ["type"];


customElements.define("btn-group", ButtonGroup);


module.exports = ButtonGroup;

},{}],2:[function(require,module,exports){
const Button = {
  __mouseDown(event) {
    var btn = event.target.closest("*:not(btn-group) > .btn-system:not(.active)");
    if (btn) {
      // Clone button for sandboxing
      var sandboxBtn = btn.cloneNode(true);
      sandboxBtn.classList.add("sandbox");
      // Append the sanbox button to the DOM
      document.body.appendChild(sandboxBtn);
      // Get informations from sandbox button
      var sandboxBoundings = sandboxBtn.getBoundingClientRect();
      // Remove sanbox button from DOM
      document.body.removeChild(sandboxBtn);
      // Round up to 4 decimal numbers because more are not supported by CSS
      btn.style.width = sandboxBoundings.width + "px";
      // Add this width as stamp
      btn.__photonModifiedWidth = btn.style.width;
    }
  },
  __mouseUp(event) {
    var btns = document.getElementsByTagName("button");
    for (let btn of btns) {
      if (btn.__photonModifiedWidth === btn.style.width) {
        btn.style.removeProperty("width");
        delete btn.__photonModifiedWidth;
      }
    }
  }
};

window.addEventListener("mousedown", Button.__mouseDown);
window.addEventListener("mouseup", Button.__mouseUp);

module.exports = Button;

},{}],3:[function(require,module,exports){
class CircularSlider extends HTMLElement {
  constructor() {
    super();

    this.__angle = 0;

    this.addEventListener("mousedown", this.__handleMouseDown);
    window.addEventListener("mouseup", event => this.__handleMouseUp(event));
    window.addEventListener("mousemove", event => this.__handleMouseMove(event));

    const dot = document.createElement("div");
    dot.classList.add("dot");

    setTimeout(() => {
      this.appendChild(dot);
      this.attributeChangedCallback("value", undefined, this.getAttribute("value"));
    }, 0);

  }
  __handleMouseDown(event) {
    this.__mousedown = true;
    this.__handleMouseMove(event);
  }
  __handleMouseUp(event) {
    if (this.__mousedown) {
      this.dispatchEvent(new Event('change', {
        bubbles: true,
        cancelable: true
      }));
    }
    this.__mousedown = false;
  }
  __handleMouseMove(event) {
    if (this.__mousedown) {
      this.__angle = this.__getAngle(event);
      this.value = this.__angle;

      this.dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true
      }));
    }
  }
  connectedCallback() {
    this.__initialized = true;
    //this.attributeChangedCallback("value", undefined, this.getAttribute("value"));
  }
  attributeChangedCallback(attribute, oldValue, newValue) {
    const attributeHandlers = {
      value: value => this.__setAngle(value)
    };
    if (attribute in attributeHandlers && this.__initialized) {
      attributeHandlers[attribute](newValue);
    }
  }
  get dot() {
    return this.getElementsByClassName("dot")[0];
  }
  __getAngle(event) {
    const boundings = this.getBoundingClientRect();
    const center = {
      x: boundings.left + boundings.width / 2,
      y: boundings.top + boundings.height / 2
    };
    const diff = {
      x: event.pageX - center.x,
      y: event.pageY - center.y
    };
    const tan = diff.x / diff.y;
    const angle = (diff.y >= 0 ? 200 : (diff.x >= 0 ? 0 : 400)) - Math.atan(tan) * (200 / Math.PI);

    return angle;
  }
  __render() {
    const deg = 360 / 400 * this.__angle;
    this.dot.style.transform = 'translate(0px, -140%) rotate(' + deg + 'deg)';
  }
  __setAngle(angle) {
    this.__angle = parseFloat(angle);
    this.__render();
  }
  set value(value) {
    this.__setAngle(value);
    this.setAttribute("value", value);
  }
  get value() {
    return this.__angle;
  }
}
CircularSlider.observedAttributes = ["value"];



customElements.define("circular-slider", CircularSlider);

module.exports = CircularSlider;

},{}],4:[function(require,module,exports){
class ContentFrame extends HTMLElement {
  constructor() {
    super();

  }
}

module.exports = ContentFrame;

},{}],5:[function(require,module,exports){
class PhotonFrameInner extends HTMLElement {
  constructor() {
    super();

  }
}

module.exports = PhotonFrameInner;

},{}],6:[function(require,module,exports){
const __prototypeExtensions = require('../PrototypeExtensions');

class PhotonListSelect extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("dragstart", this.__handleDragStart);
    this.addEventListener("dragenter", this.__handleDragEnter);
    this.addEventListener("dragend", this.__handleDragEnd);
    this.addEventListener("drag", this.__handleDrag);
  }
  __handleDragStart(event) {
    if (event.target.parentNode === this) {
      this.drag = {
        target: event.target,
        lastTarget: event.target,
        get relPos() {
          const targetBoundings = this.target.getBoundingClientRect();
          return {
            x: this.position.x - targetBoundings.left,
            y: this.position.y - targetBoundings.top
          };
        },
        // Return the index (+ or -) addition for the new drag position relative to the drag target
        get insertIndexRel() {
          // Returns 1 or 0
          // 0 stants for "top" (The dragged index will be the original index of the drag target)
          // 1 stands for "bottom" (The dragged index will be the original index of the drag target + 1)
          // That's because we can calculate with these numbers in a very powerful way
          // 0 or 1 will be returned by converting the boolean result of the expression below to a number (0 = false, 1 = true) by using the bitwise operator &
          return (this.relPos.y - this.target.getBoundingClientRect().height / 2 > 0) & 1;
        },
      };
    }
  }
  __handleDragEnter(event) {
    if (event.target.parentNode === this) {
      const nextTarget = event.target.closest("list-select li");

      if (this.drag) {
        this.drag.lastTarget = this.drag.target;
        this.drag.target = nextTarget;
      }
    }
  }
  __handleDragEnd(event) {
    if (event.target.parentNode === this) {

      const targetClone = event.target.cloneNode(true);
      PhotonListSelect.removeGraphical(targetClone);

      const targetNodePos = __prototypeExtensions.nodePos(this.drag.target);

      // Get the reference element, the dragged element will be inserted before
      const insertRefElement = this.drag.target.parentNode.children[targetNodePos + this.drag.insertIndexRel];

      // If this reference element is undefined, it does not exist
      if (insertRefElement) {
        this.drag.target.parentNode.insertBefore(targetClone, insertRefElement);
      }
      // We are using appendChild to append it on the end
      else {
        this.drag.target.parentNode.appendChild(targetClone);
      }
      // Delete original node from DOM
      event.target.parentNode.removeChild(event.target);

      PhotonListSelect.removeGraphical(this.drag.target);


      this.drag = null;
    }
  }
  __handleDrag(event) {
    if (event.target.parentNode === this) {
      if (event.clientX && event.clientY) {
        this.drag.position = {
          x: event.clientX,
          y: event.clientY
        };
        // Reset graphical classes
        PhotonListSelect.removeGraphical(this.drag.lastTarget);
        PhotonListSelect.removeGraphical(this.drag.target);

        // 'insertIndexRel' is used to dtermine wether border top or border bottom should be drawn
        this.drag.target.classList.add(PhotonListSelect.__dragGraphicalCSSClasses[this.drag.insertIndexRel]);

      }
    }
  }
  static removeGraphical(target) {
    // Remove any possible graphical class from drag target
    for (let className of this.__dragGraphicalCSSClasses) {
      target.classList.remove(className);
    }
  }
}
// Static class references for drawing a border while dragging
PhotonListSelect.__dragGraphicalCSSClasses = ["drag-before", "drag-after"];

module.exports = PhotonListSelect;

},{"../PrototypeExtensions":40}],7:[function(require,module,exports){
const PhotonContent = {
  ContentFrame: require('./ContentFrame'),
  FrameInner: require('./FrameInner'),
  ListSelect: require('./ListSelect')
};


customElements.define("content-frame", PhotonContent.ContentFrame);
customElements.define("frame-inner", PhotonContent.FrameInner);
customElements.define("list-select", PhotonContent.ListSelect);


module.exports = PhotonContent;

},{"./ContentFrame":4,"./FrameInner":5,"./ListSelect":6}],8:[function(require,module,exports){

},{}],9:[function(require,module,exports){
(function (process,__dirname){
if (process.browser) {
  module.exports = function Dialog() {
    // Nothing happens
  }
}
else {
  const electron = require('electron');
  const { getTemplate } = require('../../helper');

  const path = require('path');

  const photonPath = path.normalize(__dirname + "/../../");

  function getBaseUrl(url) {
  	var re = new RegExp(/^.*\//);
  	return re.exec(url);
  }

  module.exports = async function Dialog(e, options = {}) {
    var templateScript = e;
    if (typeof e === "string") {
      templateScript = document.querySelector(e);
    }

    const boundings = {
      width: 500,
      height: 350
    };

    const template = await getTemplate(templateScript);

    const mainWindow = electron.remote.getCurrentWindow();

    const photonWin = document.querySelector("ph-window");

    var dialog = templateScript.__dialogWindow;
    if (!dialog) {
      dialog = new electron.remote.BrowserWindow(Object.assign({
        parent: mainWindow,
        //frame: false,
        //hasShadow: false,
        //transparent: true,
        show: false,
        //width: boundings.width,
        //height: boundings.height,
        //resizable: false,
        //focusable: false,
        //alwaysOnTop: true,
        vibrancy: "popover",
        modal: true,
        //'use-content-size': true
      }, options));

      const sheetOffset = photonWin.content.getBoundingClientRect().top;
      dialog.setSheetOffset(sheetOffset);

      dialog.once("ready-to-show", function() {
        dialog.show();
        setModalPos(dialog, mainWindow, {
          x: 0,
          y: sheetOffset
        });
      });

      mainWindow.on("resize", function(event) {
        dialog.setSheetOffset(sheetOffset);
        setModalPos(dialog, mainWindow, {
          x: 0,
          y: sheetOffset
        });
      });

      dialog.loadURL("file://" + __dirname + "/templateModal.html");

      const jsScript = getBaseUrl(mainWindow.getURL()) + templateScript.getAttribute("data-js") || "";

      dialog.webContents.on("did-finish-load", function() {
        dialog.webContents.executeJavaScript('document.querySelector(".modal-window").innerHTML = `' + template.replace(/`/g, "\\`") + '`;\n');
        if (templateScript.getAttribute("data-js")) {
          dialog.webContents.executeJavaScript('var script = document.createElement("script"); script.async = true; script.type = "text/javascript"; script.src = "' + jsScript + '"; document.head.append(script);');
        }
      });

      //dialog.webContents.openDevTools();

      window.dialog = dialog;

    }
  }

  function setModalPos(modal, main, offset = {}) {
    offset = {
      x: Math.round(main.getPosition()[0] + main.getSize()[0] / 2 - modal.getSize()[0] / 2),
      y: Math.round(main.getPosition()[1] + offset.y)
    };
    modal.setPosition(offset.x, offset.y);
  }

  function showModal(modal) {
    const size = modal.getSize();

    var start;
    var end = 500;
    function step(timestamp) {
      if (!start) {
        start = timestamp;
      }
      var progress = timestamp - start;
      if (progress < end) {
        requestAnimationFrame(step);
      }
      else {
        progress = end;
      }
      var height = Math.round(progress / end * size[1]);
      modal.setSize(size[0], height);
    }
    requestAnimationFrame(step);
  }

}

}).call(this,require('_process'),"/Desktop/Projects/Web/Photon/dist/PhotonDialog")
},{"../../helper":41,"_process":45,"electron":undefined,"path":44}],10:[function(require,module,exports){
class PhotonInputStepper extends HTMLElement {
  constructor() {
    super();
    /*
    const shadow = this.attachShadow({mode: 'open'});

    const addButton = document.createElement("button");
    const subButton = document.createElement("button");

    shadow.append(`
      <style>
        @import url( 'css/input-stepper.css' )
      </style>
    `);

    shadow.appendChild(addButton);
    shadow.appendChild(subButton);*/

    this.addEventListener("click", this.__handleClick);

  }
  get buttons() {
    const buttons = this.getElementsByTagName("button");
    return {
      add: buttons[0],
      sub: buttons[1]
    };
  }
  get for() {
    return document.querySelector(this.getAttribute("for"));
  }
  set for(value) {
    this.setAttribute("for", value);
  }
  get min() {
    return parseFloat(this.for.min) || PhotonInputStepper.__defaultMin;
  }
  get max() {
    return parseFloat(this.for.max) || PhotonInputStepper.__defaultMax;
  }
  get step() {
    return parseFloat(this.for.step) || PhotonInputStepper.__defaultStep;
  }
  get value() {
    return parseFloat(this.for.value);
  }
  __handleClick(event) {
    const button = event.target.closest("button");

    if (button === this.buttons.add) {
      this.add(this.step);
    }
    else if (button === this.buttons.sub) {
      this.add(-this.step);
    }
    this.for.dispatchEvent(new Event("input", {
      cancelable: true,
      bubbles: true
    }));
  }
  add(number) {
    var newValue = this.value + number;
    if (newValue > this.max) newValue = this.max;
    if (newValue < this.min) newValue = this.min;
    this.for.value = newValue;
  }
}
PhotonInputStepper.__defaultStep = 1;
PhotonInputStepper.__defaultMax = Infinity;
PhotonInputStepper.__defaultMin = -Infinity;

module.exports = PhotonInputStepper;

},{}],11:[function(require,module,exports){
const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");

Object.defineProperty(HTMLInputElement.prototype, "value", {
  get() {
   var suffix = this.getAttribute("data-suffix") || "";
   var value = valueDescriptor.get.apply(this);
   // If the type is "number", it will be replaced with "text" to allow normal chars like a-z. But it adds 'type-rule' for identifing it as an number field (only such fields will use the replace function that removes all chars except 0-9, '.' and '-')
   if (this.type === "number" && suffix) {
     this.type = "text";
     this.setAttribute("data-type-rule", "suffix");
   }
   // Replace all chars except 0-9, '.', '-'
   if (this.getAttribute("data-type-rule") === "suffix") {
     value = value.replace(/[^[0-9]\.\-]/g, "");
     return parseFloat(value) ? parseFloat(value) : value;
   }
   return value;
  },
  set(value) {
   var suffix = this.getAttribute("data-suffix") || "";
   // If the type is "number", it will be replaced with "text" to allow normal chars like a-z. But it adds 'type-rule' for identifing it as an number field (only such fields will use the replace function that removes all chars except 0-9, '.' and '-')
   if (this.type === "number" && suffix) {
     this.type = "text";
     this.setAttribute("data-type-rule", "suffix");
   }
   // Matches all input fields that have lost their 'number' type because of avoid the limitation 'number-chars-only'
   if (this.getAttribute("data-type-rule") === "suffix") {
     value = value + suffix;
   }
   valueDescriptor.set.apply(this, [value]);
   return true;
  }
});

const newValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");


window.addEventListener("change", function(event) {
  var suffix = event.target.getAttribute("data-suffix") || "";
  if (suffix) {
    event.target.value = event.target.value;
  }
});

window.addEventListener("load", function(event) {
  var numberSuffixInputs = document.querySelectorAll("input[data-suffix]");
  for (var i = 0; i < numberSuffixInputs.length; i++) {
    numberSuffixInputs[i].value = numberSuffixInputs[i].value;
  }
});



module.exports = newValueDescriptor;

},{}],12:[function(require,module,exports){
const Input = {
  InputStepper: require('./InputStepper'),
  InputSuffixPropertyDescriptor: require('./InputValuePrototype')
};


customElements.define("input-stepper", Input.InputStepper);


module.exports = Input;

},{"./InputStepper":10,"./InputValuePrototype":11}],13:[function(require,module,exports){
(function (process){
if (process.browser) {
  module.exports = function DropDownBrowser() {
    // Nothing happens
  }
}
else {
  const { Menu } = require('electron').remote;

  module.exports = function DropDown(target, template) {
    // Create menu from options template
    const menu = Menu.buildFromTemplate(template);
    // Get boundings of target
    const targetBounds = target.getBoundingClientRect();
    // Popup menu and set its position
    const res = menu.popup({
      x: Math.round(targetBounds.left),
      y: Math.round(targetBounds.top + targetBounds.height + 6),
      async: true
    });
    return menu;
  }
}

}).call(this,require('_process'))
},{"_process":45,"electron":undefined}],14:[function(require,module,exports){
class MessageContent extends HTMLElement {
  constructor() {
    super();


    //console.log(this);
  }
}
module.exports = MessageContent;

},{}],15:[function(require,module,exports){
class MessageDescription extends HTMLElement {
  constructor() {
    super();


    //console.log(this);
  }
}
module.exports = MessageDescription;

},{}],16:[function(require,module,exports){
const { argumentsSort } = require('./../../helper');

class MessagesView extends HTMLElement {
  constructor() {
    super();

    //console.log(this);
  }
  add() {
    const self = this;

    var { message, text } = argumentsSort(arguments, {
      text: "string",
      message: "object"
    });

    message = (message || {}).fillDefaults({
      content: {
        type: "text/plains",
        source: text || ""
      },
      timestamp: new Date().getTime(),
      type: "self"
    });
    Object.defineProperty(message, "id", {
      get() {
        for (var i = 0; i < self.messages.length; i++) {
          if (this === self.messages[i]) {
            return i;
          }
        }
      }
    });

    this.messages.push(message);

    this.__render(message);

    return message;
  }
  __render(message) {
    const li = document.createElement("li");
    li.setAttribute("type", message.type);
    li.__proto__.message = message;

    const msgContent = document.createElement("message-content");
    const msgDescription = document.createElement("message-description");

    for (let handler of this.__contentTypeHandler) {
      let handleable = message.content.type.match(handler.type);
      if (handleable) {
        handler.content(msgContent, message, li, this);
        handler.description(msgDescription, message, li, this);
        break;
      }
    }

    li.appendChild(msgContent);
    li.appendChild(msgDescription);

    message.__listItem = li;

    this.messagesList.appendChild(li);
  }
  get messagesList() {
    return this.getElementsByClassName('messages')[0];
  }
}
MessagesView.prototype.messages = [];

MessagesView.prototype.__contentTypeHandler = require('./contentHandler.js');
module.exports = MessagesView;

},{"./../../helper":41,"./contentHandler.js":17}],17:[function(require,module,exports){
const staticHandlers = {
  descriptionDefault(descriptionElement, message, li, self) {
    const now = new Date();
    const time = new Date(message.timestamp);
    var timeStr = time.getHours() + ":" + time.getMinutes();
    // If the difference of the message is more away than 1 day
    if (now.getTime() - time > 86400000 || true) {
      timeStr = time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear() + ", " + timeStr
    }
    descriptionElement.append(timeStr);

    if (self.messages[message.id - 1] && message.timestamp - self.messages[message.id - 1].timestamp < 60 * 1000) {
      //descriptionElement.hidden = true;
    }
  }
};

module.exports = [
  {
    type: /^text\/.*$/,
    content(contentElement, message, li, self) {
      contentElement.append(message.content.source);
    },
    description: staticHandlers.descriptionDefault
  },
  {
    type: /^image\/.*$/,
    content(contentElement, message, li, self) {
      const img = document.createElement("img");
      img.src = message.content.source;
      contentElement.append(img);
      li.classList.add("attachment");
    },
    description: staticHandlers.descriptionDefault
  },
  {
    type: /^audio\/.*$/,
    content(contentElement, message, li, self) {

      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = message.content.source;
      contentElement.append(audio);
      //console.log(audio);
      //audio.play();
      //audio.attachShadow({mode: 'open'});
      //audio.attachShadow({mode: 'close'});

      li.classList.add("attachment");
    },
    description: staticHandlers.descriptionDefault
  }
];

},{}],18:[function(require,module,exports){

const Messages = {
  MessagesView: require('./MessagesView'),
  MessageContent: require('./MessageContent'),
  MessageDescription: require('./MessageDescription')
};



customElements.define("messages-view", Messages.MessagesView);
customElements.define("message-content", Messages.MessageContent);
customElements.define("message-description", Messages.MessageDescription);

},{"./MessageContent":14,"./MessageDescription":15,"./MessagesView":16}],19:[function(require,module,exports){
class NavigationGroup extends HTMLElement {
  constructor() {
    super();

    //console.log(this);
  }
  get items() {
    return this.getElementsByTagName("nav-item");
  }
}

module.exports = NavigationGroup;

},{}],20:[function(require,module,exports){
class NavigationItem extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("click", event => this.__handleClick(event));
  }
  activate() {
    for (let item of this.group.items) {
      item.classList.remove("active");
    }
    this.classList.add("active");
  }
  get group() {
    return this.closest("nav-group");
  }
  __handleClick(event) {
    if (!this.classList.contains("active")) {
      this.activate();

      this.dispatchEvent(new CustomEvent("activate", {
        bubbles: true,
        detail: {

        }
      }));
    }
  }
}

module.exports = NavigationItem;

},{}],21:[function(require,module,exports){
const Navigation = {
  NavigationGroup: require("./NavGroup"),
  NavigationItem: require("./NavItem")
};

customElements.define("nav-group", Navigation.NavigationGroup);
customElements.define("nav-item", Navigation.NavigationItem);

},{"./NavGroup":19,"./NavItem":20}],22:[function(require,module,exports){
class NumberInput extends HTMLElement {
  constructor() {
    super();


    window.addEventListener("mousedown", (event) => {
      if (this != event.target) {
        this.focus = false;
      }
    });

    this.addEventListener("click", function(event) {
      this.focus = true;
    })

    window.addEventListener("keydown", event => {
      if (this.focus) {
        this.__handleKeyPress(event);
        NumberInput.__keyPressed = true;
      }
    });
    window.addEventListener("keyup", event => {
      NumberInput.__keyPressed = false;
    });
    // Cursor for handling input
    this.cursor = 0;

    this.__value = 0;
  }
  attributeChangedCallback(attr, oldValue, newValue) {
    this.__setValue(newValue);
  }
  __handleKeyPress(event) {
    // Get method name of handler
    var handlerMethod = (function(keyCode) {
      // Loop trough records and check them for possibility to handle the current key code
      for (let record of NumberInput.__keyCodes) {
        // Match the key code with the code matcher of the current record
        const keyCodeMatch = keyCode.match(record.code);
        // If the match is valid, return this record as the valid handler
        if (keyCodeMatch) {
          return {
            name: record.name,
            // Use all variables from match result (regular expression groups) excepting the first one because this is always the text itself
            matchResult: Array.from(keyCodeMatch.slice(1))
          };
        }
      }
    })(event.code);
    // If there exist a handler for this kind of key code, use it
    if (handlerMethod) {
      // Call the handler by its name and send all match variables (e.g. match groups) as arguments to the handler
      this.keyHandlers[handlerMethod.name].apply(this, handlerMethod.matchResult);
      this.registerFillTimer();

      this.dispatchEvent(new Event("input", {
        bubbles: true,
        detail: {

        }
      }));
    }
  }
  fill() {
    // Get the amount of digits that will be filled up
    const fillCount = this.maxlength - this.digits.length;

    const newDigits = new Array(fillCount).fill(0).concat(this.digits);

    //this.value = newDigits.join("");
    this.__setValue(newDigits.join(""));
  }
  registerFillTimer() {
    // Get current time and store it to prevent old timers to be fired
    this.lastTimerTime = new Date().getTime();
    // Create new timeout for
    setTimeout((thisTimer) => {
      // If this timer is the last one
      if (this.lastTimerTime === thisTimer) {
        this.fill();
      }
    }, this.cursorTimeout, this.lastTimerTime);
  }
  get cursorTimeout() {
    return parseInt(this.getAttribute("data-cursortimeout")) || NumberInput.__defaultCursorTimeout;
  }
  get value() {
    return new Number(this.__value);
  }
  get textValue() {
    return new String(this.__value).padStart(this.maxlength, "\u00A0");
  }
  set value(value) {
    this.__setValue(value);

    this.setAttribute("value", this.value);
  }
  __setValue(value) {
    // If the value is too big
    if (value > this.max) {
      // Set value to minimum (if exists) or to maximum instead
      value = this.min + Infinity ? this.min : this.max;
    }
    if (value < this.min) {
      // Set value to maximum (if exists) or to minimum instead
      value = this.max - Infinity ? this.max : this.min;
    }
    this.__value = value;

    while (this.childNodes.length > 0) {
      this.removeChild(this.childNodes[0]);
    }

    const textNode = document.createTextNode(this.textValue);

    this.appendChild(textNode);
  }
  get digits() {
    return this.textValue.replace(/\s/g, "").split("").map(number => parseInt(number));
  }
  get maxlength() {
    return (new Number(this.getAttribute("maxlength")) + 0) || 1;
  }
  set maxlength(length) {
    this.setAttribute("maxlength", length);
  }
  get max() {
    return new Number(this.getAttribute("max") || NumberInput.__defaultMax);
  }
  set max(maximal) {
    this.setAttribute("max", maximal);
  }
  get min() {
    return new Number(this.getAttribute("min") || NumberInput.__defaultMin);
  }
  set min(minimum) {
    this.setAttribute("min", minimum);
  }
  get step() {
    return new Number(this.getAttribute("step") || NumberInput.__defaultStep);
  }
  set step(stepValue) {
    this.setAttribute("step", stepValue);
  }
  set focus(value) {
    if (value) {
      this.classList.add("focus");
    }
    else {
      this.classList.remove("focus");
    }
  }
  get focus() {
    return this.classList.contains("focus");
  }
}
NumberInput.observedAttributes = ["value"];
NumberInput.__defaultCursorTimeout = 1000;
NumberInput.__defaultMin = -Infinity;
NumberInput.__defaultMax = Infinity;
NumberInput.__defaultStep = 1;
// Address each important key to a specific handler method
NumberInput.__keyCodes = [
  {
    code: /Digit([0-9])/,
    name: "number"
  },
  {
    code: "ArrowUp",
    name: "add"
  },
  {
    code: "ArrowDown",
    name: "sub"
  },
  {
    code: "ArrowRight",
    name: "next"
  },
  {
    code: "ArrowLeft",
    name: "previous"
  }
];
NumberInput.__keyPressed = false;


NumberInput.prototype.keyHandlers = {
  number(number) {

    number = new Number(number);


    // If length of 4 is reached, clear value
    if (this.digits.length >= this.maxlength) {
      this.value = "";
    }

    this.value = this.digits.concat(number).join("");
  },
  add() {
    this.value += this.step;
  },
  sub() {
    this.value -= this.step;
  },
  next() {
    if (!NumberInput.__keyPressed && this.nextElementSibling instanceof NumberInput) {
      this.focus = false;
      this.nextElementSibling.focus = true;
    }
  },
  previous() {
    if (!NumberInput.__keyPressed && this.previousElementSibling instanceof NumberInput) {
      this.focus = false;
      this.previousElementSibling.focus = true;
    }
  }
};


customElements.define("number-input", NumberInput);

module.exports = NumberInput;

},{}],23:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],24:[function(require,module,exports){
const __prototypeExtensions = require('./../PrototypeExtensions');
const { parseCSSProperty } = require('./../../helper');

const PaneSizer = {
  toleranceDiff: 15,
  mouseDown(event) {
    const position = {
      x: event.pageX,
      y: event.pageY
    };
    const nextPaneBorder = this.getNextPaneBorder(position);
    if (nextPaneBorder && nextPaneBorder.positionRel < this.toleranceDiff) {
      this.drag = Object.assign({
        start: Object.assign({}, position),
        get diff() {
          return {
            x: this.curr.x - this.start.x,
            y: this.curr.y - this.start.y
          };
        },
        curr: Object.assign({}, position)
      }, nextPaneBorder);
      this.drag.pane.__staticStyle = Object.assign({}, window.getComputedStyle(this.drag.pane));
    }
  },
  mouseUp(event) {
    this.drag = null;
  },
  mouseMove(event) {
    const position = {
      x: event.pageX,
      y: event.pageY
    };
    const nextPaneBorder = this.getNextPaneBorder(position);
    if (nextPaneBorder && nextPaneBorder.positionRel < this.toleranceDiff) {
      const windowElement = nextPaneBorder.pane.closest("window-content");
      windowElement.classList.add("sizing-pane");
    }
    else {
      const windowContents = document.querySelectorAll("window-content");
      for (let content of windowContents) {
        content.classList.remove("sizing-pane");
      }
    }

    if (this.drag) {
      this.drag.curr = position;
      const originalWidth = parseCSSProperty(this.drag.pane.__staticStyle["width"], "number");
      const newWidth = originalWidth + this.drag.diff.x;
      this.drag.pane.style.width = newWidth + "px";
      this.drag.pane.style.flex = "none";

      const resizeEvent = new Event("resize", {
        bubbles: true,
        detail: {
          newWidth: newWidth
        }
      });
      this.drag.pane.dispatchEvent(resizeEvent);
    }
  },
  get panes() {
    const panes = [
      document.getElementsByClassName('pane-sm'),
      document.getElementsByClassName('pane')
    ];
    return Array.merge(panes.map(nodePaneList => Array.from(nodePaneList)));
  },
  getPanesBorders(pane) {
    const nodePos = __prototypeExtensions.nodePos(pane);
    return {
      left: pane.previousElementSibling ? pane.getBoundingClientRect().left : null,
      right: pane.nextElementSibling ? pane.getBoundingClientRect().right : null
    };
  },
  getAllBorders(position) {
    const candiates = this.panes.filter(function(pane) {
      let boundings = pane.getBoundingClientRect();
      return position.y >= boundings.top && position.y <= boundings.bottom;
    });
    return Array.merge(candiates.map((pane) => {
      return Object.values(this.getPanesBorders(pane)).filter(border => border).map(function(pos) {
        return {
          position: pos,
          positionRel: Math.abs(position.x - pos),
          pane: pane
        };
      });
    }));
  },
  getNextPaneBorder(position) {
    const borders = this.getAllBorders(position);

    const border = borders[borders.indexOfKey(Math.min.apply(Math, borders.map(borderRecord => borderRecord.positionRel)), "positionRel")];

    return border;

  }
};

window.addEventListener("mousedown", event => PaneSizer.mouseDown(event));
window.addEventListener("mouseup", event => PaneSizer.mouseUp(event));
window.addEventListener("mousemove", event => PaneSizer.mouseMove(event));

module.exports = PaneSizer;

},{"./../../helper":41,"./../PrototypeExtensions":40}],25:[function(require,module,exports){
const { setSVGAttributes } = require('./../../helper');


class ProgressCircle extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: 'open'
    });

    const radius = ProgressCircle.__radius;

    const svg = document.createElementNS(ProgressCircle.__svgNameSpace, "svg");
    setSVGAttributes(svg, {
      style: 'width: 100%; height: 100%;',
      viewBox: -50 + " " + -50 + " " + (100) + " " + (100)
    });
    this.pathElement = document.createElementNS(ProgressCircle.__svgNameSpace, "path");
    setSVGAttributes(this.pathElement, {
      style: "fill: #555;"
    });
    svg.append(this.pathElement);

    const circleBorder = document.createElementNS(ProgressCircle.__svgNameSpace, "circle");
    setSVGAttributes(circleBorder, {
      style: "fill: none; stroke: #555; stroke-width: 5px;",
      cx: 0,
      cy: 0,
      r: radius
    });
    svg.append(circleBorder);


    shadow.appendChild(svg);
  }
  attributeChangedCallback(attribute, oldValue, newValue) {
    const attributeHandlers = {
      value: value => this.__visualCalc(value),
    };
    if (attribute in attributeHandlers) {
      attributeHandlers[attribute](newValue);
    }
  }
  get value() {
    return parseFloat(this.getAttribute("value"));
  }
  __visualCalc(value) {
    const progress = Math.PI * 2 * (value === 1 ? 0.99999999 : value);
    this.coords = {
      x: Math.sin(progress) * ProgressCircle.__radius,
      y: Math.cos(progress) * ProgressCircle.__radius
    };
  }
  set value(value) {
    this.__visualCalc(value);
    this.setAttribute("value", value);
  }
  set coords(coords) {
    const radius = ProgressCircle.__radius;
    this.path = "M 0,0 l 0," + -radius + " A " + radius + " " + radius + " 0 " + (coords.x < 0 & 1) + " 1 " + coords.x + "," + -coords.y;
  }
  set path(value) {
    this.pathElement.setAttributeNS(null, "d", value);
  }
}
ProgressCircle.observedAttributes = ["value"];
ProgressCircle.__svgNameSpace = "http://www.w3.org/2000/svg";
ProgressCircle.__radius = 50;




customElements.define("progress-circle", ProgressCircle);



module.exports = ProgressCircle;

},{"./../../helper":41}],26:[function(require,module,exports){
const inputValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");

const RangeSlider = {
  inputHandle(event) {
    const inputRange = event.target.closest("input[type='range']");
    if (inputRange) {
      RangeSlider.sliderVisualCalc(inputRange);
    }
  },
  sliderVisualCalc(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const value = parseFloat(slider.value) || 0;


    slider.style.backgroundSize = (100 * ((value - min) / (max - min))) + "% 100%";

    if (slider.classList.contains("slider-vertical")) {
      slider.style.marginBottom = slider.getBoundingClientRect().width + "px";
    }

  },
  __inputValuePropertySetter(value) {
    inputValueDescriptor.set.apply(this, [value]);
    if (this.type === "range") {
      RangeSlider.sliderVisualCalc(this);
      return true;
    }
  }
};

Object.defineProperty(HTMLInputElement.prototype, "value", {
  get: inputValueDescriptor.get,
  set: RangeSlider.__inputValuePropertySetter
});

window.addEventListener("input", RangeSlider.inputHandle);

module.exports = RangeSlider;

},{}],27:[function(require,module,exports){
const Slider = {
  RangeSlider: require('./RangeSlider')
};


module.exports = Slider.RangeSlider;

},{"./RangeSlider":26}],28:[function(require,module,exports){
class PhotonSwipeActionList extends HTMLElement {
  constructor() {
    super();
  }
  get actions() {
    return this.getElementsByTagName("swipe-action");
  }
  get innerWidth() {
    return Array.from(this.actions).map(action => action.__staticBoundings.width).reduce((acc, value) => acc + value);
  }
  get role() {
    return this.getAttribute("role");
  }
}

module.exports = PhotonSwipeActionList;

},{}],29:[function(require,module,exports){
class PhotonListGroup extends HTMLElement {
  constructor() {
    super();
  }
}

module.exports = PhotonListGroup;

},{}],30:[function(require,module,exports){
class PhotonListItemInner extends HTMLElement {
  constructor() {
    super();
  }
}

module.exports = PhotonListItemInner;

},{}],31:[function(require,module,exports){
const { hasParentSelector, getTransDur, parseCSSProperty } = require('./../../helper');

try {
  var electron = require('electron');
  var mainWindow = electron.remote.getCurrentWindow();

  mainWindow.on("scroll-touch-begin", function(event) {
    PhotonListItem.__gestureTouch = true;
  });
  mainWindow.on("scroll-touch-end", function(event) {
    PhotonListItem.__gestureTouch = false;
  });
}
catch (e) {

}

class PhotonListItem extends HTMLElement {
  constructor() {
    super();

    const self = this;

    this.addEventListener("wheel", this.__wheelHandler);

    this.__dragStart = null;

    this.addEventListener("mousedown", this.__mouseDownHandler);
    window.addEventListener("mouseup", event => this.__mouseUpHandler(event));
    window.addEventListener("mousemove", event => this.__mouseMoveHandler(event));

    this.addEventListener("mousemove", event => event.preventDefault());

    // Current scrolling difference
    this.currScroll = 0;
    // Wether scrolling has begon already
    // Used to determine wether a "wheel" event is the first time fired while a single gesture
    this.gesture = {
      direction: null,
      // Get the index of the direction
      get dirName() {
        return PhotonListItem.__directions.keyFromValue(this.direction);
      },
      get actionList() {
        // Return action-list element from action lists within this list item
        return self.actionLists[this.dirName];
      },
      // Return the type of gesture
      get type() {
        // If the gesture's direction and the touch direction are equal, the user is opening the swipe actions, otherwise closing
        return (this.direction === this.touch.direction || this.overscroll) ? "open" : "close";
      },
      // Return the theoretically candidate for being s smart action
      get smartCandidate() {
        return this.actionList.actions[this.direction < 0 ? 0 : (this.actionList.actions.length - 1)]
      },
      // Return wether smart action is streched (smartness)
      get smartAction() {
        return false;
        const totalActionsWidth = this.scrollDiff;
        const listItemTotalWidth = self.getBoundingClientRect().width;

        return totalActionsWidth >= listItemTotalWidth;
      },
      // Touch data
      touch: null,
      // Theoretically scroll of mousewheel that is performed in this gesture (Everything is interpreted 1:1)
      scroll: 0,
      // Real scroll that is used (Overscoll is not interpreted 1:1) and absoluted
      get scrollDiff() {
        const scrollAbs = Math.abs(this.scroll);
        return this.overscroll ? PhotonListItem.__overscrollCalc(this.actionList.innerWidth, this.overscroll) : scrollAbs;
      },
      // Theoretically overscroll (Overscoll is interpreted 1:1)
      get overscroll() {
        const overscroll = Math.abs(this.scroll) - this.actionList.innerWidth;
        return overscroll > 0 ? overscroll : 0;
      },
      // Real overscroll that is rendered (Not 1:1)
      get overscrollPx() {
        const overscrollPx = this.scrollDiff - this.actionList.innerWidth;
        return overscrollPx > 0 ? overscrollPx : 0;
      },
      speed: 0
    };

    try {
      mainWindow.on("scroll-touch-end", (event) => {
        if (this.gesture.direction && this.gesture.touch) {
          this.__touchEndHandler(event);
        }
      });
    }
    catch (e) {

    }
  }
  /*get actionLists() {
    const actionLists = Array.from(this.getElementsByTagName("action-list"));
    return [
      actionLists.filter(list => list.role === "left")[0],
      actionLists.filter(list => list.role === "right")[0]
    ];
  }*/
  get actionLists() {
    const actionLists = Array.from(this.getElementsByTagName("action-list"));
    return {
      left: actionLists.filter(list => list.role === "left")[0],
      right: actionLists.filter(list => list.role === "right")[0]
    };
  }
  get inner() {
    return this.getElementsByTagName("item-inner")[0];
  }
  __touchEndHandler(event) {
    const self = this;
    // User is not touching anymore, handle this case's CSS specifications without the class 'touching'
    this.classList.remove("touching");
    // Get gesture's type
    const type = this.gesture.type;
    // Get the last speed
    const speed = this.gesture.speed;
    // Calculate the transition duration that is relative to the speed
    {
      // General calulcation
      let transDur = 1.5 / speed;
      // Define minimum and maxiumum of duration
      let min = 0.2;
      let max = 0.6;
      // Apply minimum and maxiumum value to the transition duration
      transDur = transDur > min ? transDur : min;
      transDur = transDur < max ? transDur : max;
      // Set the duration as CSS property to action list, all actions and the list inner
      {
        this.gesture.actionList.style.transitionDuration = transDur + "s";
        for (let action of this.gesture.actionList.actions) {
          action.style.transitionDuration = transDur + "s";
        }
        this.inner.style.transitionDuration = transDur + "s";
      }
    }
    // Quit gesture (Call some resetting stuff)
    this.__quitGesture();
    // Handle a different type of action with a different handler
    const actionTypeHandlers = {
      open() {
        self.__openActions();
      },
      close() {
        self.__closeActions();
      }
    };
    // Handle type of interaction with its handler ("open" || "close")
    actionTypeHandlers[type]();
  }
  // Open wrapper for external openings
  open(direction) {
    // Try to close a possible open swipe
    try {
      this.close();
    }
    catch (e) {}
    // Set direction
    this.gesture.direction = direction;
    // Intitialize gesture
    this.__initGesture();
    // Open swipes internaly
    this.__openActions();
  }
  close() {
    // Try to close a possible open swipe
    try {
      this.__closeActions();
    }
    // There seems to be no open swipe
    catch (e) {
      throw new Error("No open swipe");
    }
  }
  __openActions() {
    // Set scroll position to the full width of current action list of current gesture (Multiplied with the direction's sign)
    this.gesture.scroll = this.gesture.actionList.innerWidth * Math.sign(this.gesture.direction);
    // Render the new scroll position
    this.__render();

    this.gesture.actionList.dispatchEvent(new CustomEvent("swipe", {
      bubbles: true,
      detail: {
        action: "open",
        swipe: this.gesture.actionList
      }
    }));
  }
  __closeActions() {
    const actionList = this.gesture.actionList;
    // Set scroll position
    this.gesture.scroll = 0;
    // Render the new scroll position
    this.__render();
    // Reset the gesture because we are in the normal situation now and both directions can be swiped to
    this.gesture.direction = null;

    actionList.dispatchEvent(new CustomEvent("swipe", {
      bubbles: true,
      detail: {
        action: "close",
        swipe: actionList
      }
    }));
  }
  __initGesture() {
    for (let action of this.gesture.actionList.actions) {
      // Freeze CSS properties to get original CSS values later (e.g. they become changed)
      action.__staticCSSProperties = Object.assign({}, window.getComputedStyle(action));
      // Freeze boundings to get original boundings when they are already changed later
      action.__staticBoundings = action.getBoundingClientRect();
    }
  }
  __quitGesture() {
    this.gesture.scroll = Math.abs(this.gesture.scroll) > this.gesture.actionList.innerWidth ? this.gesture.actionList.innerWidth : this.gesture.scroll;
    for (let action of this.gesture.actionList.actions) {
      action.style.removeProperty("width");
    }
  }
  __wheelHandler(event) {
    const self = this;

    const delta = event.deltaX;

    if (PhotonListItem.__gestureTouch) {
      this.scrollDelta(delta);
    }

  }
  scrollDelta(delta) {
    const direction = delta * Infinity;
    const swipeIsValid = !!this.actionLists[PhotonListItem.__directions.keyFromValue(direction)];
    // Determine wether the user is really touching now and swiping to this direction is abled
    // Swiping in this direction is abled if there exist a action list or, if not, a gesture is active which means we can scroll back
    if (true && (swipeIsValid || this.gesture.direction)) {
      this.classList.add("touching");
      if (!this.gesture.direction) {
        // First time fired while a single gesture
        this.gesture.direction = direction;
        this.__initGesture();
      }
      // Real touch begin event handling because global event does not refer to target, therefore the first wheel event fired while a touch is used
      if (!this.gesture.touch) {
        this.gesture.touch = {};
      }
      // Set current touch's direction
      this.gesture.touch.direction = delta * Infinity;

      this.gesture.speed = Math.abs(delta);

      // Add delta to scroll while the gesture's direction is not deceived
      // In such a case, if the direction would be turned, go to 0
      this.gesture.scroll += (this.gesture.scroll + delta) * Infinity === this.gesture.direction ? delta : 0 - this.gesture.scroll;
      // Render the new scroll position
      this.__render();
    }
  }
  __mouseDownHandler(event) {
    this.__dragStart = {
      x: event.pageX,
      y: event.pageY
    };
    this.classList.add("touching");
  }
  __mouseUpHandler(event) {
    this.__dragStart = null;
    this.__drag = null;
    this.classList.remove("touching");

    if (this.gesture.direction && this.gesture.touch) {
      this.__touchEndHandler(event);
    }
  }
  __mouseMoveHandler(event) {
    /*
      NOTE
      Please note that the mouse controller is a fallback for the normal wheel controller.
      Therefore the mouse position is interpreted as delta you know from wheel event. This is because the API is originally designed for such wheel events
    */

    if (this.__dragStart) {
      const currDrag = {
        x: -(event.pageX - this.__dragStart.x),
        y: -(event.pageY - this.__dragStart.y)
      };

      if (this.__drag) {
        const delta = currDrag.x - this.__drag.x;

        this.scrollDelta(delta);
      }

      this.__drag = currDrag;
    }
  }
  __render() {
    // Get the related action list to the gesture's direction
    const actionList = this.gesture.actionList;

    const scrollDiff = this.gesture.scrollDiff;

    // Global interaction with left & right swipes

    // Set each action's margin
    const marginBase = (actionList.innerWidth - scrollDiff) / actionList.actions.length;

    // Render bounce effect of overscroll
    if (this.gesture.overscroll) {
      // Calculate bounce
      let actionBounce = PhotonListItem.__calcActionBounce(this.gesture.overscrollPx / actionList.actions.length);
      // Add bounce to every action
      for (let action of this.gesture.actionList.actions) {
        // Add bounce to orignal width (stored in '__staticWidth' which stores the original width as CSS property)
        action.style.width = (parseCSSProperty(action.__staticCSSProperties["width"], "number") + actionBounce) + "px";
      }
    }
    // Handle each action
    for (let action of this.gesture.actionList.actions) {
      // Calculate the margin for current action
      let margin = marginBase * action.__nodePos;
      // Only use the margin if the inner width is smaller than total width
      margin = margin > 0 ? margin : 0;
      // Use margin as right margin for current action
      action.style.right = margin + "px";
    }

    // Set action list's width to scrolled area
    actionList.style.width = scrollDiff + "px";

    const specialDirectionHandle = {
      left: () => {},
      right: () => this.inner.style.marginLeft = -scrollDiff + "px"
    };
    // Call special swipe calculations for the current direction
    specialDirectionHandle[this.gesture.dirName]();


    // Handle smart action
    // Check wether there exist currently an action that should be used smartly
    if (this.gesture.smartAction) {
      this.gesture.smartCandidate.smart = true;
    }
    // No smart action
    else {
      this.gesture.smartCandidate.smart = false;
    }
  }
  static __overscrollCalc(max, overscroll) {
    return max + overscroll * 0.5;
  }
  static __calcActionBounce(bounce) {
    return bounce / 5;
  }
}
PhotonListItem.__gestureTouch = false;
PhotonListItem.__directions = {
  left: -Infinity,
  right: Infinity
};


module.exports = PhotonListItem;

},{"./../../helper":41,"electron":undefined}],32:[function(require,module,exports){
const __prototypeExtensions = require('./../PrototypeExtensions');

class PhotonSwipeAction extends HTMLElement {
  constructor() {
    super();
  }
  get __nodePos() {
    return __prototypeExtensions.nodePos(this);
  }
  set smart(value) {
    if (value) {
      this.classList.add("smart");
    }
    else {
      this.classList.remove("smart");
    }
  }
  get smart() {
    return this.classList.contains("smart");
  }
}


module.exports = PhotonSwipeAction;

},{"./../PrototypeExtensions":40}],33:[function(require,module,exports){

const Swipe = {
  ListItem: require('./ListItem'),
  ListGroup: require('./ListGroup'),
  ListItemInner: require('./ListInner'),
  SwipeActionList: require('./ActionList'),
  SwipeAction: require('./SwipeAction')
};

customElements.define("list-group", Swipe.ListGroup);
customElements.define("list-item", Swipe.ListItem);
customElements.define("item-inner", Swipe.ListItemInner);
customElements.define("action-list", Swipe.SwipeActionList);
customElements.define("swipe-action", Swipe.SwipeAction);


module.exports = Swipe;

},{"./ActionList":28,"./ListGroup":29,"./ListInner":30,"./ListItem":31,"./SwipeAction":32}],34:[function(require,module,exports){
const { hasParentSelector, getTransDur } = require('./../../helper');

class PhotonTabGroup extends HTMLElement {
  constructor() {
    super();
    //this.addEventListener("");
  }
  get items() {
    return this.getElementsByTagName("tab-item");
  }
  get itemsDraggable() {
    return Array.from(this.items).filter(item => item.dragability);
  }
  get itemsEnableable() {
    return Array.from(this.items).filter(item => !item.isButton);
  }
  moveTab(item, index) {
    // If tab moves really and does not remain on its old position
    if (index != item.__nodePos) {
      var posBefore = item.__nodePos;
      this.insertBefore(item, this.items[index + (posBefore >= index ? 0 : 1)]);
      item.dispatchEvent(new CustomEvent("tabMove", {
        bubbles: true,
        detail: {
          tab: item,
          position: index
        }
      }));
    }
  }
  activateTab(item) {
    // If the tab is enableable (no button itself!) and not still active
    if (!item.isButton && !item.active) {
      for (let item of this.items) {
        item.classList.remove("active");
      }
      item.classList.add("active");
      item.dispatchEvent(new CustomEvent("tabActivate", {
        bubbles: true,
        detail: {
          tab: item
        }
      }));
      return true;
    }
    return false;
  }
  closeTab(item, options) {
    options = options.fillDefaults({
      animated: false
    });
    // If the tab that will be closed, is the active one
    if (item.active) {
      // Get the index of this tab in the list of possible enableable tabs
      let currItemIndexEnableable = this.itemsEnableable.indexOf(item);
      // Use the tab before or the tab behind this one as the next one
      let nextActiveItem = this.itemsEnableable[currItemIndexEnableable - 1] || this.itemsEnableable[currItemIndexEnableable + 1];
      // Activate this next tab
      this.activateTab(nextActiveItem);
    }
    if (options.animated) {
      item.classList.add("adding");
      item.style.width = item.__staticBoundings.width + "px";
      setTimeout(function() {
        item.style.removeProperty("width");
      }, 10);
      setTimeout(() => {
        this.removeChild(item);
      }, getTransDur(item) * 1000);
    }
    else {
      this.removeChild(item);
    }
    item.dispatchEvent(new CustomEvent("tabClose", {
      bubbles: true,
      detail: {
        tab: item,
        options: options
      }
    }));
  }
  addTab(options = {}) {
    options = options.fillDefaults({
      position: "last",
      closeBtn: true,
      isActive: true,
      animated: true,
      content: document.createTextNode("New Tab")
    });
    var newTab = document.createElement("tab-item");
    if (options.closeBtn) {
      var closeBtn = document.createElement("button");
      closeBtn.setAttribute("action", "close");
      newTab.appendChild(closeBtn);
    }
    newTab.appendChild(typeof options.content === "string" ? document.createTextNode(options.content) : options.content);
    if (this.itemsDraggable.length > 0) {
      var appendRefItem = options.position === "first" ? this.itemsDraggable[0] : this.items[this.itemsDraggable.last.__nodePos + 1];
    }
    else {
      var appendRefItem = this.items.last;
    }
    // Calculate new tab's width to perform transition
    //const newTabWidth = this.itemsDraggable[0].getBoundingClientRect().width * this.itemsDraggable.length / (this.itemsDraggable.length + 1);
    const newTabWidth = this.getTabWidth(this.itemsDraggable.length + 1);
    if (appendRefItem) {
      this.insertBefore(newTab, appendRefItem);
    }
    else {
      this.appendChild(newTab);
    }
    if (options.animated) {
      newTab.classList.add("adding");
      setTimeout(() => {
        if (this.itemsDraggable.length > 0) {
          newTab.style.width = newTabWidth + "px";
        }
      }, 10);
      setTimeout(function() {
        newTab.classList.remove("adding");
        newTab.style.removeProperty("width");
      }, this.itemsDraggable.length > 0 ? (getTransDur(newTab) * 1000) : 0);
    }
    this.dispatchEvent(new CustomEvent("tabAdd", {
      detail: {
        tab: newTab,
        options: options
      }
    }));
    if (options.isActive) this.activateTab(newTab);
  }
  get __activeDraggingItem() {
    for (let item of this.items) {
      if (item.classList.contains("dragging")) {
        return item
      }
    }
  }
  getTabWidth(count = 1) {
    const fixedWidth = Array.from(this.items).filter(item => !item.dragability).reduce((a, b) => a.getBoundingClientRect().width + b.getBoundingClientRect().width);

    const totalWidth = this.getBoundingClientRect().width;

    return (totalWidth - fixedWidth) / count;
  }
  static __handleMouseDown() {

  }
}

module.exports = PhotonTabGroup;

},{"./../../helper":41}],35:[function(require,module,exports){
const { getTransDur, hasParentSelector } = require('./../../helper');
const __prototypeExtensions = require('./../PrototypeExtensions');

class PhotonTabItem extends HTMLElement {
  constructor() {
    super();
    const self = this;

    // Mouse down hanlder for this item
    this.addEventListener("mousedown", PhotonTabItem.__handleMouseDown);

    //this.addEventListener("mousemove", PhotonTabItem.__handleMouseMove);
    // Global mouseup handling for this element (Mouseup outside of window)
    window.addEventListener("mouseup", (event) => {
      // If this item is the current one that's be dragged
      if (this.dragging) {
        PhotonTabItem.__handleMouseUp.apply(this, [event]);
      }
    });
    // Global mousemove handling for this element (Mousemove outside of window)
    window.addEventListener("mousemove", (event) => {
      // If this item is the current one that's be dragged
      if (this.dragging) {
        PhotonTabItem.__handleMouseMove.apply(this, [event]);
      }
    });

    this.addEventListener("click", (event) => {
      // Get target path to a button
      var btnTarget = hasParentSelector(event.target, "button");
      // If button exist, the click was on a button
      if (btnTarget) {
        var btnClose = btnTarget.last;
        this.actions[btnClose.getAttribute("action")](this);
      }
      if (this.isButton) {
        this.actions[this.action](this);
      }
    });
    this.actions = {
      close(item) {
        const group = self.parentNode;
        group.closeTab(item, {
          animated: true
        });
      },
      add(item) {
        const group = self.parentNode;
        group.addTab({
          animated: true,
          position: "last",
          closeBtn: true,
          isActive: true,
          content: "New Tab"
        });
      }
    };
  }

  attributeChangedCallback(attr, oldValue, newValue) {

  }
  move(index) {
    const group = this.parentNode;
    return group.moveTab(this, index);
  }
  close(options = {}) {
    const group = this.parentNode;
    return group.closeTab(this, options);
  }
  activate() {
    const group = this.parentNode;
    group.activateTab(this);
  }
  static __handleMouseDown(event) {
    // Get target path to a button
    var btnTarget = hasParentSelector(event.target, "button");
    const group = this.parentNode;
    for (let item of group.items) {
      item.__staticBoundings = item.getBoundingClientRect();
    }

    this.__dragStart = {
      x: event.pageX,
      y: event.pageY
    };
    if (!btnTarget) {
      if (this.dragability) {
        // Add a 'dragging' class to the item
        this.classList.add("dragging");
        // Add a 'in-drag' class to the tab group to determine this state
        group.classList.add("in-drag");
        // Activate this item
      }
      // Activate this item
      group.activateTab(this);
    }
  }
  static __handleMouseUp(event) {
    const group = this.parentNode;
    if (this.dragging) {
      // Dragging is over, remove "dragging" class from item but keep "in-drag" class on group in general because the animation after a succesfull drag is not finished and therefore, the current active tab needs special CSS rules
      this.classList.remove("dragging");
      this.style.removeProperty("transform");
      const pos = {
        x: event.pageX,
        y: event.pageY
      };
      var newPos = (function(x) {
        for (let i = 0; i < group.items.length; i++) {
          let item = group.items[i];
          // If current drag position is within the boundings of the tab item we ware looking for and this position can be achived because the item there is draggable
          if (item.__staticBoundings.left <= x && item.__staticBoundings.right > x && item.dragability) {
            // Seems to be exactly this new position
            return i;
          }
        }
        // Mouse pointer is outside of tab group (E.g. out of window)
        // Therefore, use the most left or morst right item that draggable (Excludes fixed items)
        return Math.abs(x - group.itemsDraggable[0].__staticBoundings.left) >= Math.abs(x - group.itemsDraggable.last.__staticBoundings.right) ? group.itemsDraggable.last.__nodePos : group.itemsDraggable[0].__nodePos;
      })(pos.x);
      // Calculate difference between old and new position
      var diffX = group.items[newPos].__staticBoundings.left - this.__staticBoundings.left;
      diffX += diffX >= 0 ? -2 : 2;
      // If the new position is different from the old one, move the item to it
      if (this.__nodePos != newPos) {
        this.style.transform = "translate(" + diffX + "px, 0px)";
      }
      // Wait for transition to be finished (Animating the dragged item to its target position)
      setTimeout(function(group, currItem) {
        // Move item in DOM context
        currItem.move(newPos);
        // Remove all tab item's 'transform' style property
        for (let item of group.items) {
          item.style.removeProperty("transform");
        }
        // Remove classes 'in-drag' because dragging process is completly over
        group.classList.remove("in-drag");
      }, getTransDur(this) * 1000, group, this);
    }
  }
  static __handleMouseMove(event) {
    const group = this.parentNode;
    if (this.dragging) {
      const pos = {
        x: event.pageX,
        y: event.pageY
      };
      var dragDiff = pos.x - this.__dragStart.x;
      this.style.transform = "translate(" + (dragDiff) + "px, 0px)";
      for (let i = 0; i < group.items.length; i++) {
        let item = group.items[i];
        let leftX = item.__staticBoundings.left;
        let rightX = item.__staticBoundings.right;
        // If current item is before the dragged one
        if (i < this.__nodePos) {
          if (pos.x < rightX && item.dragability) {
            item.style.transform = "translate(" + (this.__staticBoundings.width) + "px, 0px)";
          }
          else item.style.removeProperty("transform");
        }
        // If current item is after the dragged one
        if (i > this.__nodePos) {
          if (pos.x > leftX && item.dragability) {
            item.style.transform = "translate(" + (-this.__staticBoundings.width) + "px, 0px)";
          }
          else item.style.removeProperty("transform");
        }
      }
    }
  }
  get active() {
    return this.classList.contains("active");
  }
  get dragging() {
    return this.classList.contains("dragging");
  }
  get isButton() {
    return !!this.action;
  }
  get __nodePos() {
    return __prototypeExtensions.nodePos(this);
  }
  get action() {
    return this.getAttribute("action");
  }
  set action(value) {
    this.setAttribute("action", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    this.setAttribute("type", value);
  }
  // Computed property that returns wether the item is draggable
  get dragability() {
    // Just check for a fixed type property
    return this.type != "fixed";
  }
}
PhotonTabItem.observedAttributes = ["action"];


module.exports = PhotonTabItem;

},{"./../../helper":41,"./../PrototypeExtensions":40}],36:[function(require,module,exports){

const Tab = {
  TabGroup: require('./TabGroup'),
  TabItem: require("./TabItem")
};


customElements.define("tab-group", Tab.TabGroup);
customElements.define("tab-item", Tab.TabItem);



module.exports = Tab;

},{"./TabGroup":34,"./TabItem":35}],37:[function(require,module,exports){
class Toolbar extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define("tool-bar", Toolbar);

},{}],38:[function(require,module,exports){
try {
  var electron = require('electron');

}
catch (err) {
  window.addEventListener("load", () => document.body.classList.add("no-electron"));
}


class PhotonWindow extends HTMLElement {
  constructor() {
    super();
    //console.log(this);
    this.addEventListener("blur", function(event) {
      //console.log("!!!");
    });


  }
  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr in this.__attributeHandlers) {
      this.__attributeHandlers[attr](oldValue, newValue);
    }
  }
  get toolbars() {
    return this.getElementsByTagName("tool-bar");
  }
  get tabGroup() {
    return this.getElementsByTagName("tab-group")[0];
  }
  get content() {
    return this.getElementsByTagName("window-content")[0];
  }
}
PhotonWindow.observedAttributes = ["data-vibrancy"];
PhotonWindow.prototype.__attributeHandlers = {
  ["data-vibrancy"](oldValue, newValue) {
    try {
      const browserWindow = require('electron').remote.getCurrentWindow();
      browserWindow.setVibrancy(newValue);
    }
    catch (e) {}
  }
};

customElements.define("ph-window", PhotonWindow);

},{"electron":undefined}],39:[function(require,module,exports){
class WindowContent extends HTMLElement {
  constructor() {
    super();
    //console.log(this);

  }
}

customElements.define("window-content", WindowContent);

},{}],40:[function(require,module,exports){
module.exports = {
  nodePos(e) {
    for (var i = 0; i < e.parentNode.children.length; i++) {
      if (e.parentNode.children[i] === e) {
        return i;
      }
    }
  }
};

},{}],41:[function(require,module,exports){
module.exports = {
  hasParentSelector(e, selector) {
    var children = [];
    while (e && "matches" in e && !e.matches(selector)) {
      children.push(e);
      e = e.parentNode;
    }
    children.push(e);
    return (e && "matches" in e && e.matches(selector)) ? children : false;
  },
  getTransDur(e) {
    return parseFloat(window.getComputedStyle(e, null).getPropertyValue("transition-duration").replace(/[a-z]/g, "").replace(/,/g, "."))
  },
  parseCSSProperty(value, type) {
    const typeParsers = {
      number(value) {
        return parseFloat(value.replace(/[^0-9\.,]/g, ""));
      }
    };
    return typeParsers[type](value);
  },
  objFillDefaults(obj, defaults) {
    for (let key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        if (!(key in obj)) {
          obj[key] = defaults[key];
        }
        else if (typeof defaults[key] === "object" && defaults[key] != null) {
          obj[key] = this.objFillDefaults(obj[key], defaults[key]);
        }
      }
    }
    return obj;
  },
  setSVGAttributes(e, attributes = {}) {
    for (let name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        e.setAttributeNS(null, name, attributes[name]);
      }
    }
  },
  arrayMerge(arrays) {
    return [].concat.apply([], arrays);
  },
  argumentsSort(argumentsList = [], order = {}) {
    const result = {};
    for (let arg of argumentsList) {
      let type = typeof arg;
      let key = order.keyFromValue(type);
      result[key] = arg;
      delete order[key];
    }
    return result;
  },
  getTemplate(templateScript) {
    return new Promise(function(resolve, reject) {
      if (templateScript.__templateChache) {
        resolve(templateScript.__templateChache);
      }
      else if (templateScript.src) {
        const templateRequest = new XMLHttpRequest();
        templateRequest.open("GET", templateScript.src, true);
        templateRequest.addEventListener("load", function(event) {
          templateScript.__templateChache = this.responseText;
          resolve(this.responseText);
        });
        templateRequest.addEventListener("error", function(event) {
          reject(event);
        });
        templateRequest.send();
      }
      else {
        resolve(templateScript.innerHTML);
      }
    });
  }
};

Array.merge = module.exports.arrayMerge;


Object.defineProperty(Array.prototype, "last", {
  get() {
    return this.lastFrom(0);
  }
});
Object.prototype.keyFromValue = function(value) {
  for (var key in this) {
    if (this.hasOwnProperty(key)) {
      if (this[key] === value) {
        return key;
      }
    }
  }
};
Array.prototype.indexOfKey = function(value, key, start = 0) {
  for (var i = start; i < this.length; i++) {
    if (this[i][key] === value) {
      return i;
    }
  }
  return -1;
}
Array.prototype.lastFrom = function(pos = 0) {
  return this[this.length - 1 - pos];
}

Math.roundDeep = function(number, deepness = 0) {
  const multi = Math.pow(10, deepness);
  return Math.round(number * multi) / multi;
};
Object.prototype.fillDefaults = function(defaults) {
  return module.exports.objFillDefaults(this, defaults);
};

},{}],42:[function(require,module,exports){
(function (process,__dirname){
(function() {
  const fs = require('fs');

  const componentsBasePath = "./components";

  const componentSymbol = Symbol("component");

  const Photon = {
    set style(styleName) {
      const styleHandlers = {
        auto() {
          // Fill style with platform related style name automatically
          const platformStyles = {
            MacIntel: "cocoa"
          };
          // If a platform specific style entry exists
          if (window.navigator.platform in platformStyles) {
            Photon.style = platformStyles[window.navigator.platform];
          }
          // No platform specific style entry
          else {
            // Get the alternativeStyle by the first entry of the platform entries
            const alternativeStyle = platformStyles[Object.keys(platformStyles)[0]];;
            console.warn("Your OS's default style is not supported. Using the default style '" + alternativeStyle  + "'");
            Photon.style = alternativeStyle;
          }
        },
        cocoa() {
          Photon.__setStyle("cocoa");
        },
        /*metro() {
          Photon.__setStyle("metro");
        }*/
      };
      if (styleName in styleHandlers) {
        styleHandlers[styleName]();
      }
      else {
        console.error("Style '" + styleName + "' is not supported.");
      }
    },
    __setStyle(styleName) {

      while (photonStyle.childNodes.length > 0) {
        photonStyle.removeChild(photonStyle.childNodes[0]);
      }

      for (let key in Photon) {
        const property = Photon[key];
        // If the property contains a valid component
        if (property && property[componentSymbol]) {
          // Get the compontents full path
          let componentBaseDir = (this.__baseDir || __dirname + "/") + components[key];
          // Get the stylesheet's full path
          let styleSheetPath = componentBaseDir + "/styles/" + styleName + ".css";
          // Make posix path working on non-unix systems
          styleSheetPath = styleSheetPath.replace(/\\/g, "/");

          // Append an @import statement to the styleheet of photon that refers to the components stylesheet
          photonStyle.append('@import "' + styleSheetPath.replace(/\\/g, "/") + '";');
        }
      }

    },
    set __baseDir(dir) {
      Photon.__baseDirectory = dir;
      Photon.style = "auto";
    },
    get __baseDir() {
      return Photon.__baseDirectory;
    }
  };



  const components = {
    "Original": "dist/PhotonOriginal",
    "Button" : "dist/PhotonButton",
    "Custom": "dist/PhotonCustom",
    "Window": "dist/PhotonWindow",
    "WindowContent": "dist/PhotonWindowContent",
    "Toolbar": "dist/PhotonToolbar",
    "ButtonGroup": "dist/PhotonBtnGroup",
    "Tab": "dist/PhotonTab",
    "List": "dist/PhotonSwipe",
    "Content": "dist/PhotonContent",
    "Input": "dist/PhotonInput",
    "ProgressCircle": "dist/PhotonProgressCircle",
    "CircularSlider": "dist/PhotonCircularSlider",
    "Slider": "dist/PhotonSlider",
    "Panes": "dist/PhotonPanes",
    "Messages": "dist/PhotonMessages",
    "NumberInput": "dist/PhotonNumberInput",
    "Dialog": "dist/PhotonDialog",
    "DropDown": "dist/PhotonMenu",
    "Navigation": "dist/PhotonNavigation"
  };

  const photonStyle = document.createElement("style");
  document.head.append(photonStyle);




  // Loop trough compontents
  /*for (let componentName in components) {
    // If the key name relates to a real property
    if (components.hasOwnProperty(componentName)) {
      // Get the compontents full path
      let componentBaseDir = __dirname + "/" + components[componentName];
      // Require te compontent with CommonJS
      let component = require(componentBaseDir);
      // Set a back reference to Photon class to the component
      component.__self = Photon;
      component[componentSymbol] = true;
      // Set component as property of Photon class
      Object.defineProperty(Photon, componentName, {
        value: component,
        configurable: false,
        enumerable: true,
        writeable: false
      });

    }
  }*/

  Photon.Original = require("./dist/PhotonOriginal");
  Photon.Button = require("./dist/PhotonButton");
  Photon.Custom = require("./dist/PhotonCustom");
  Photon.Window = require("./dist/PhotonWindow");
  Photon.WindowContent = require("./dist/PhotonWindowContent");
  Photon.Toolbar = require("./dist/PhotonToolbar");
  Photon.ButtonGroup = require("./dist/PhotonBtnGroup");
  Photon.Tab = require("./dist/PhotonTab");
  Photon.List = require("./dist/PhotonSwipe");
  Photon.Content = require("./dist/PhotonContent");
  Photon.Input = require("./dist/PhotonInput");
  Photon.ProgressCircle = require("./dist/PhotonProgressCircle");
  Photon.CircularSlider = require("./dist/PhotonCircularSlider");
  Photon.Slider = require("./dist/PhotonSlider");
  Photon.Panes = require("./dist/PhotonPanes");
  Photon.Messages = require("./dist/PhotonMessages");
  Photon.NumberInput = require("./dist/PhotonNumberInput");
  Photon.Dialog = require("./dist/PhotonDialog");
  Photon.DropDown = require("./dist/PhotonMenu");
  Photon.Navigation = require("./dist/PhotonNavigation");

  // Set components back refernece to Photon (__self) and a symbol that indicates it as a component
  for (let componentName in Photon) {
    // Check wether the key is listed a property officially
    if (componentName in components) {
      Photon[componentName][componentSymbol] = true;
      Photon[componentName].__self = Photon;
    }
  }

  // Set auto synchronously if whe are running in node (then we can get the '__dirname' but if not, we have to use '__baseDir' which has to be set manually)
  // This means, we can not do this action synchronously but asynchrounusly
  if (!process.browser && false) {
    Photon.style = "auto";
  }
  // Do it asynchrounusly and check wether a '__baseDir' was set
  else if (false) {
    setTimeout(function() {
      if (Photon.__baseDir) {
        Photon.style = "auto";
      }
    }, 0);
  }

  Photon.__baseDir = __dirname + "/";


  if (window) {
    window.Photon = Photon;
  }
  module.exports = Photon;

})();

}).call(this,require('_process'),"/Desktop/Projects/Web/Photon")
},{"./dist/PhotonBtnGroup":1,"./dist/PhotonButton":2,"./dist/PhotonCircularSlider":3,"./dist/PhotonContent":7,"./dist/PhotonCustom":8,"./dist/PhotonDialog":9,"./dist/PhotonInput":12,"./dist/PhotonMenu":13,"./dist/PhotonMessages":18,"./dist/PhotonNavigation":21,"./dist/PhotonNumberInput":22,"./dist/PhotonOriginal":23,"./dist/PhotonPanes":24,"./dist/PhotonProgressCircle":25,"./dist/PhotonSlider":27,"./dist/PhotonSwipe":33,"./dist/PhotonTab":36,"./dist/PhotonToolbar":37,"./dist/PhotonWindow":38,"./dist/PhotonWindowContent":39,"_process":45,"fs":43}],43:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],44:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":45}],45:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[42]);
