# PhotonKit-Components

Some components for the PhtonKit Framework to build native UI's in CSS/JS.

Please make sure, that maybe the JSFiddle doesn't looks like expected if you use another engine as blink.
For some components there is no JSFiddle because they need some native features.

**The best idea is to test everything directly in electron**

Within the _Photon-Components_ folder, every component directory is a valid electron app. You can directly run it with electron.

The most components have a integrated documentation.

Or, if you want to test everything run _electron_ for the _ShowReal_ folder

## Documentation

- [Native Button](#native-button)
- [Input](#input)
- [Dialog](#dialog)
- [Segmented Control](#segmented-control--btn-group-controller)
- [Slider](#slider)
- [Swipe](#swipe)
- [Tab Group](#tab-group)
- [Progress Bar](#progress-bar)
- [Progress Circle](#circle-progress)
- [Frame List & Main Border](#frame-list--border)
- [Messages](#messages)
- [Circular Slider](#circular-slider)

## Native Button

PhotonKit doesn't offers a real native looking button solution for the default button in macOS. Of course there is a button named "btn-primary", that has a blue background and another one called "btn-default" thats background-color is grey, but they are not perfect. This component contains a better, more native looking button component with the class "btn btn-system".

Fiddle: https://jsfiddle.net/1jmro304/

![Native Button on normal displays](http://s18.postimg.org/y43j4x61l/Bildschirmfoto_2016_09_26_um_19_23_22.png)
![Native Button on retina displays (pixel-ratio=2)](http://s22.postimg.org/457yfv2bl/Bildschirmfoto_2016_09_26_um_19_23_06.png)

### Head
```html
...
  <link rel="stylesheet" href="path/to/photon.css" />
  <link rel="stylesheet" href="path/to/btn.css" />
...
```

### Body
```html
...
  <button class="btn btn-system">Cancel</button>
  <button class="btn btn-system btn-active">Continue</button>
...
```

## Input

This component is just CSS for native looking input fields and so on.
The file `input.js` is required if you want to use features like the stepper and the suffix text.

Fiddle:

### Simple Text Field

```html
<!--As you can see, it's just simple as it is-->
<input type="text">
```

### Search

```html
<!--Also the search input can be used instead-->
<input type="search" placeholder="Search">
```

### Input with stepper

Please keep in mind, that here a complex javascript

```html
<!--'id' is here just required to select it in the 'data-input' attribute of the stepper. You can use every valid querySelector instead of the id-->
<input type="number"step=".5" min="-14" max="26" value="2" id="myInput">

<!--This is the stepper-->
<div class="stepper" data-input="#myInput">
  <button></button>
  <button></button>
</div>
```

### Suffix for Number Input

As you maybe know from macOS, an input can have a suffix like '*%*', '*px*', '*pt*' or so on.
This feature allows you to don't care about parsing the suffix. You can set your value normally with javascript and get it and the suffix will be added every time.

```html
<!--The id is just used to select in the following javascript snippet-->
<input type="number" value="10" data-suffix=" px" id="#myInput">
```

As you can see it just works out of the box!

Use `value` normally.

```javascript
var myInput = document.querySelector("#myInput");

console.log(myInput.value); // Returns the real value without suffix

myInput.value = 400; // Sets the value to '400'. But suffix works
```


## Dialog
Dialog component for simple native looking dialogs.

### Head
```html
...
  <link rel="stylesheet" href="path/to/photon.css" />
  <link rel="stylesheet" href="path/to/dialog.css" />
...
```

### Body

#### Main Structure

```html
...
<div class="window">
  <header class="toolbar toolbar-header">
    <!--Toolbar Content-->
  </header>
  <div class="window-dialogs">
    <!--Window Dialogs!-->
  </div>
  <div class="window-content">
    <!--Window Content-->
  </div>
</div>
...
```

#### Dialogs

```html
...
<div class="window-dialogs">
  ...
  <div class="dialog" id="test-dialog">
    <h1 class="title left">This a Dialog</h1>
    <button class="btn btn-default">A Button</button>
    <br /><br />
    <button class="btn btn-primary btn-close-dialog">Hide Dialog</button>
    <!--class "btn-close-dialog" defines that this button closes the dialog-->
  </div>
  ...
</div>
...
```


### JavaScript Controlling

```javascript
var myDialog = document.getElementById("test-dialog");

dialogAction(myDialog, {
  action: "auto", // "open" || "close" || "auto". Default is "auto"
  speed: 0.3 // Animation speed in s. Default is 0.3. (! To disable animation set speed = 0)
});
```


## Segmented Control & Btn-Group Controller

The segmented control is based on the layout for a "btn-group". In addition there is a controller for the "btn-group" that can also used for a traditional "btn-group".

The attribute "data-group-relationship" set the relationship between the buttons within the btn-group. If this attribute is "relative" every button can be activated or deactivated. If the attribute is "absolute" there is always one active element. If you activate some, the current active one will be disactived. By default data-group-relationship is "relative".

Fiddle: https://jsfiddle.net/95hj625x/

![Segmented Control](http://s17.postimg.org/niwj0s50f/Bildschirmfoto_2016_09_26_um_21_18_15.png)



### Head
```html
...
  <link rel="stylesheet" href="path/to/photon.css" />
  <link rel="stylesheet" href="path/to/segment.css" />
  <script src="path/to/segment.js" type="text/javascript"></script>
...
```

### Body

```html
...
<!--data-group-relationship = "relative"-->
<div class="btn-group" data-group-relationship="relative">
  <button class="btn btn-segment active">Segment 1</button>
  <button class="btn btn-segment">Segment 2</button>
  <button class="btn btn-segment">Segment 3</button>
</div>

<br /><br />

<!--data-group-relationship = "absolute"-->
<div class="btn-group" data-group-relationship="absolute">
  <button class="btn btn-segment active">Segment 1</button>
  <button class="btn btn-segment">Segment 2</button>
  <button class="btn btn-segment">Segment 3</button>
</div>
...
```

### JavaScript Events

#### Activate
Every btn-group has the prototype function updateBtnGroup() for manually updating
```javascript
var myBtnGroup = document.getElementsByClassName("btn-group")[0]; //Example for an "btn-group"
var myBtn = myBtnGroup.childNodes[0]; //Example for an "btn" within our "btn-group"

//Update the btn-group. First argument is the button element that needs to be activated. Use it for manual activating a button.
myBtnGroup.updateBtnGroup(myBtn);

//Event Listening for changes
myBtnGroup.addEventListener("activate", function() {
  event.detail;                   //Event details
  event.detail.targetBtn;         //The clicked "btn" element
  event.detail.groupRelationship; //Relationship between the "btn" elements
  console.log(event.detail);
}, false);
```

## Slider

Fiddle: https://jsfiddle.net/yxacffxu/


![Sliders](https://picload.org/image/rdipoppp/bildschirmfoto2016-11-06um21.1.png)
![Sliders Retina](https://picload.org/image/rdipopwa/bildschirmfoto2016-11-06um21.1.png)

### Head
```html
...
  <link rel="stylesheet" href="path/to/photon.css" />
  <link rel="stylesheet" href="path/to/range.css" />
  <script src="path/to/range.js" type="text/javascript"></script>
...
```

### Body

#### Default

```html
<input type="range" class="slider slider-round" />
```
![Slider Default](https://picload.org/image/rdiplrdo/bildschirmfoto2016-11-06um21.2.png)

#### Slider-Round with colors
```html
<!--Blue (Default)-->
<input type="range" class="slider slider-round blue" />
<!--Gray-->
<input type="range" class="slider slider-round gray" />
```
![Sliders with Colors](https://picload.org/image/rdiplrdw/bildschirmfoto2016-11-06um21.2.png)

#### Slider-Squared

```html
<!--Normal Square-->
<input type="range" class="slider slider-square" />
<!--Square Inverted-->
<input type="range" class="slider slider-square-inverted" />
```
![Sliders Squared](https://picload.org/image/rdiplrap/bildschirmfoto2016-11-06um21.2.png)

#### Sliders Sizes

```html
<!--Small Slider-->
<input type="range" class="slider slider-round slider-small" />
<!--Bold Slider-->
<input type="range" class="slider slider-round slider-bold" />
```
![Slider Sizes](https://picload.org/image/rdiplrla/bildschirmfoto2016-11-06um21.2.png)

#### Slider Vertical

```html
<input type="range" class="slider slider-round slider-vertical" />
```
![Slider Vertical](https://picload.org/image/rdiplrlw/bildschirmfoto2016-11-06um21.2.png)

## Swipe

The swipe elements are smart action buttons, that appear if you swipe on the trackpad or magic mouse over an list-group-item.

![Swipe Items](https://picload.org/image/rdiplpgl/bildschirmfoto2016-11-06um22.0.png)

Fiddle is **not** available because some _native_ features are required.

### HEAD

```html
...
  <link rel="stylesheet" href="path/to/photon.css" />
  <link rel="stylesheet" href="path/to/swipe.css" />
  <script type="text/javascript" src="path/to/swipe.js"></script>
...
```

### BODY

The Swipe Items are contained in the PhotonKit "list-group-item"s of "list-group". But the structure of the items is a little bit more complicated.

#### list-group-item classes

```html
<li class="list-group-item list-item-swipe">
  ...
</li>
```

#### list-group-item structure
```html
...
  <li class="list-group-item list-item-swipe">
    <div class="swipe-actions swipe-actions-left">
      <!--The actions are here contained-->
    </div>
    <div class="item-inner">
      <!--The inner content of the item-->
    </div>
    <div class="swipe-actions swipe-actions-right">
      <!--The actions are here contained-->
    </div>
  </li>
...
```

**Note**

The DIV tags with the class "swipe-actions" are **optional**.
If you use them, the swipe-actions tag before the item-inner tag needs the class "swipe-actions-left".
The one after the item-inner needs the class "swipe-actions-left".

#### swipe-actions structure

```html
...
  <div class="swipe-actions swipe-actions-left">
    ...
    <div class="action" style="background-color: #ff2e00;">
      <div class="action-inner">
        Action
      </div>
    </div>
    ...
    <div class="action" style="background-color: #1c90da;">
      <div class="action-inner">
        Another Action
      </div>
    </div>
    ...
  </div>
...
```
This example uses the "swipe-actions-left" class for the swipe-actions DIV. Of course, the "swipe-actions-right" DIV has the same structure with "action" tags.


#### Complete Structure

```html
<ul class="list-group">
  <li class="list-group-item list-item-swipe">
    <div class="swipe-actions swipe-actions-left">
      <div class="action" style="background-color: #ff2e00;">
        <div class="action-inner">
          Action 2
        </div>
      </div>
      <div class="action" style="background-color: #1c90da;">
        <div class="action-inner">
          Action 1
        </div>
      </div>
    </div>
    <div class="item-inner">
      <img class="img-circle media-object pull-left" src="imgs/avatar1.png" width="32" height="32" alt="" />
      <div class="media-body">
        <strong>Maurice Conrad</strong>
        <p>Lorem ipsum dolor sit amet</p>
      </div>
    </div>
    <div class="swipe-actions swipe-actions-right">
      <div class="action" style="background-color: #875ce6;">
        <div class="action-inner">
          Action<br />Right
        </div>
      </div>
    </div>
  </li>
  <li class="list-group-item list-item-swipe">
    <div class="swipe-actions swipe-actions-left">
      <div class="action" style="background-color: #ff2e00;">
        <div class="action-inner">
          Action 2
        </div>
      </div>
    </div>
    <div class="item-inner">
      <img class="img-circle media-object pull-left" src="imgs/avatar2.png" width="32" height="32" alt="" />
      <div class="media-body">
        <strong>Max Mustermann</strong>
        <p>Lorem ipsum dolor sit amet</p>
      </div>
    </div>
    <div class="swipe-actions swipe-actions-right">

    </div>
  </li>
  <li class="list-group-item">
    <div class="item-inner">
      <img class="img-circle media-object pull-left" src="imgs/avatar2.png" width="32" height="32" alt="" />
      <div class="media-body">
        <strong>Max Mustermann</strong>
        <p>Lorem ipsum dolor sit amet</p>
      </div>
    </div>
  </li>
</ul>
```

### JavaScript

#### Events

##### open

```javascript
  var mySwipeItem = document.getElementsByClassName("list-item-swipe")[0];

  swipeItems[0].addEventListener("open", function(event) {
    console.log("Swipe open event", event.detail);
  }, false);
```

##### close

```javascript
  var mySwipeItem = document.getElementsByClassName("list-item-swipe")[0];

  swipeItems[0].addEventListener("close", function(event) {
    console.log("Swipe close event", event.detail);
  }, false);
```

##### action

```javascript
  var mySwipeItem = document.getElementsByClassName("list-item-swipe")[0];

  swipeItems[0].addEventListener("action", function(event) {
    console.log("Swipe Action performed", event.detail);
  }, false);
```

## Tab Group

PhotonKit offers a tab-group CSS component but there is no JavaScript controller, that give methods and events for the tab items.

In this component the items aren't really different. The syntax is same, there is just the difference that there are a few more classes. For example in addition for "tab-item-fixed", there is also "btn" that is used for the case, that a tab-item-fixed is a button and can't be activated.

The new CSS file "tabs-custom" manages the new classes and give us also a more native looking close button for the tab items because the original from PhotonKit was ugly.

Fiddle: https://jsfiddle.net/Loo3pyuo/

![Tab Group](https://picload.org/image/rdiplwla/bildschirmfoto2016-11-06um22.1.png)

### HEAD

```html
...
  <link rel="stylesheet" href="path/to/photon.css" />
  <link rel="stylesheet" href="path/to/tabs-custom.css" />
  <script type="text/javascript" src="path/to/tabs.js"></script>
...
```

### BODY

Look at the syntax of an example:

```html
<div class="tab-group" id="tab-group">
  <div class="tab-item tab-item-fixed">
    Fixed 1
  </div>
  <div class="tab-item active">
    <span class="icon-close-tab"></span>
    Tab 1
  </div>
  <div class="tab-item">
    <span class="icon-close-tab"></span>
    Tab 2
  </div>
  <div class="tab-item">
    <span class="icon-close-tab"></span>
    Tab 3
  </div>
  <div class="tab-item tab-item-fixed btn btn-add-tab"></div>
</div>
```

### JavaScript

#### Methods

##### addTab

```javascript
var myTabGroup = document.getElementsByClassName("tab-group")[0];

//[tabGroup].addTab(options);

var newTabItem = tabGroup1.addTab({
  position: "last", // "last" || "first" - Position of new element in DOM context. Default is "last"
  closeBtn: true, // If the new tab-item has a close btn. Default is true
  isActive: true, // If the new tab-item is the active one. Default is true
  animated: true, // If the adding process has a smooth animation. Default is true
  content: document.createTextNode("UI") // Can be a string or a element node. Default is "New Tab"
});

return newTabItem; // Returns the new tab-item element
```

##### closeTab

```javascript
var myTabGroup = document.getElementsByClassName("tab-group")[0];

//[tabGroup].closeTab([tabItem], [options]);

myTabGroup.closeTab(myTabGroup.children[0], {
  animated: false
});
// Closes the first tab item
```


##### activateItem

```javascript
var myTabGroup = document.getElementsByClassName("tab-group")[0];

//[tabGroup].activateItem([tabItem]);

myTabGroup.activateItem(myTabGroup.children[0]); // Activates the first tab item
```

##### moveItem

```javascript
var myTabGroup = document.getElementsByClassName("tab-group")[0];

//[tabGroup].moveItem(tabItemElement, newDOMPosition);

myTabGroup.moveItem(myTabGroup.children[2], 4); // Moves the 3rd tab-item ([2]) to position 4 in DOM context
```

#### Events

##### tabActivate

```javascript
var myTabGroup = document.getElementsByClassName("tab-group")[0];

myTabGroup.addEventListener("tabActivate", function(event) {
  event.detail;     // Event informations
  event.detail.tab; // The activated tab-item
  event.detail.tabPosition; // The activated tab-item position
  console.log("Tab activate Event", event.detail);
}, false);
```
##### positionChange

```javascript
var myTabGroup = document.getElementsByClassName("tab-group")[0];

myTabGroup.addEventListener("positionChange", function(event) {
  event.detail; // Event informations
  event.detail.tab; // The tab-item who's position has changed
  event.detail.tabPositionBefore; // The original position of the moved tab-item
  event.detail.tabPositionNew; // The new position of the moved tab-item
  console.log("Tab postion change Event", event.detail);
}, false);
```

##### tabDrag

```javascript
var myTabGroup = document.getElementsByClassName("tab-group")[0];

myTabGroup.addEventListener("tabDrag", function(event) {
  event.detail; // Event informations
  event.detail.tab; // The dragged tab-item
  event.detail.tabPosition; // The position of the dragged tab-item
  event.detail.drag; // The drag on the x-axis in pixels
  console.log("Tab drag Event", event.detail);
}, false);
```

## Progress bar

Blink (therefore electron) offers a progress bar but there are two problems:
1. On retina displays, the progress bar is blurry
2. The indeterminate progress bar (no "value" attribute) isn't animated like a real native one.

This problems will be fixed with the following component:

Fiddle: https://jsfiddle.net/yy5jfyd0/

![Determinate Progress Bar](https://picload.org/image/rdpiggwl/bildschirmfoto2016-11-12um18.1.png)
![Indeterminate Progress Bar](http://dev.amina-koyim.de/data/1e1ijx.gif)

### HEAD
```html
...
  <link rel="stylesheet" href="path/to/photon.css" />
  <link rel="stylesheet" href="path/to/progress.css" />
...
```

### BODY

#### Determinate Progress Bar
```html
<progress value="50" max="100"></progress>
```
![Determinate Progress Bar](https://picload.org/image/rdpiggwl/bildschirmfoto2016-11-12um18.1.png)

#### Indeterminate Progress Bar
In difference to the default version of blink, this one is animated.
```html
<progress></progress>
```
![Indeterminate Progress Bar](http://dev.amina-koyim.de/data/1e1ijx.gif)

## Circle Progress

![Circle Progress](https://picload.org/image/rdpcplow/bildschirmfoto2016-11-12um15.3.png)

Fiddle: https://jsfiddle.net/Lq7g79fq/

### HEAD
```html
...
  <link rel="stylesheet" href="path/to/photon.css" />
  <link rel="stylesheet" href="path/to/progress-circle.css" />
  <script type="text/javascript" src="path/to/progress-circle.js"></script>
...
```

### BODY
#### Default
```html
<div class="progress-circle"></div>
```
#### Custom Size
Just change the width and height properties.
```html
<div class="progress-circle" style="width: 50px; height: 50px;"></div>
```

### JavaScript

#### Get Progress

```javascript
var myElement = document.getElementsByClassName("progress-circle")[0];

return myElement.progress; // Returns the progress (0 - 100);
```

#### Set Progress

```javascript
var myElement = document.getElementsByClassName("progress-circle")[0];

myElement.updateCircleProgress(50); // 50%
```

## Frame List & Border

![Frame List](https://picload.org/image/roigwaoi/bildschirmfoto2017-02-07um19.2.png)

Fiddle: https://jsfiddle.net/8t2s6v3f/

### HEAD
```html
...
  <link rel="stylesheet" href="path/to/photon.css" />
  <link rel="stylesheet" href="path/to/frame-list.css" />
  <script type="text/javascript" src="path/to/frame-list.js"></script>
...
```

### BODY

#### Layout

```html
<div class="content-frame" style="height: 300px;">
  <div class="frame-inner">
    ...
  </div>
  <div class="toolbar">
    <!--Toolbar is optional-->
    <button class="btn btn-add"></button>
    <button class="btn btn-remove" disabled></button>
  </div>
</div>
```

##### Frame Inner

```html
<div class="content-frame" style="height: 300px;">
  <div class="frame-inner">
    <ul class="list-select list-editable">
      <li class="active" draggable="true">
        <details>
          <summary>Apple</summary>
          <ul>
            <li>
              Test
            </li>
            <li>Einfarbig</li>
          </ul>
        </details>
      </li>
      <li draggable="true">
        <span>Fotos</span>
      </li>
      <li draggable="true">
        <span>Ordner</span>
      </li>
    </ul>
  </div>
  <div class="toolbar">
    ...<!--Toolbar is optional-->
  </div>
</div>
```

#### Main Border

```html
<div class="window-content theme-gray">
  <!--window-content div should have the class 'theme-gray'. Otherwise it looks not good-->
  <div class="main-border">
    Main Border Content
  </div>
</div>
```

## Messages

![Messages](https://picload.org/image/roigwlgr/bildschirmfoto2017-02-07um19.4.png)

Fiddle: https://jsfiddle.net/q62Lg11z/


## Circular Slider

Circular Slider for setting angles.

![Circular Slider](https://picload.org/image/rlgipllr/screenshot2017-02-20at20.19.16.png)

Fiddle: https://jsfiddle.net/qs03th34/

### Required

```html
<head>
  ...
    <link rel="stylesheet" href="circular-slider.css">
    <script type="text/javascript" src="circular-slider.js"></script>
  ...
</head>
```

### Body

```html
<div class="circular-slider">
  <div class="dot"></div>
</div>
```

### JavaScript API

#### Get Value

```javascript
var circSlider = document.getElementsByClassName("circular-slider")[0];

return circSlider.value; // Returns an angle from 0 - 400
```

#### Set Value

```javascript
var circSlider = document.getElementsByClassName("circular-slider")[0];

circSlider.setValue(200); // Angle from 0 - 400
```

#### Event 'change'

```javascript
var circSlider = document.getElementsByClassName("circular-slider")[0];

circSlider.addEventListener("change", function(event) {
  return event; // Change Event
});
```
