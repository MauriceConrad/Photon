# Photon

[Offical Website](https://mauriceconrad.github.io/Photon/)

Develop native looking UI's for **Electron** with HTML, CSS & JS.

![ShowReel](https://dev.maurice-conrad.eu/img/photon/demo.png)

## Install

```bash
npm install electron-photon
```

[NPM](https://www.npmjs.com/package/electron-photon)

## Usage

```javascript
// Require photon
const Photon = require("electron-photon");
```

### Use in Browser

If you want to use Photon in a Browser, you have to mention some things.
First of all, embed the browserified script file like anything else using a `<script>` Tag.
But now, you also have to set a relative path for loading the components.
```html
<script src="photon.browser.js"></script>
<script>
  Photon.__baseDir = "/myPhotonMaster";
</script>
```

#### Why?

This is because Photon needs an “endpoint” that contains a “/dist” folder to load each component.
The problem is, that we are embedding the `photon.browser.js` using a former script tag. And sadly, there exist no API to get the relative source of an embedded script from himself. Of course there exist a lot of hackt workarounds but currently this is the only “clean” solution.

**Just look at the magic! Everything works out of the box.**

Your `Photon` instance is just used to contain the component controllers and to perform special actions like `Dialog()` (More about [Dialogs](dist/PhotonDialog)). Or if you want to *hack* a components lifecycle, there you get the classes you need.

### Troubleshooting

**I get an error** `ERR_FILE_NOT_FOUND` when *requiring* the  **Photon**. Sometimes the components will not load and you may ask yourself why.
Generally, `Photon` loads each component on its own. Therefore, a general `/dist` folder is required that contains all component folders. By default, the module tries to use the `/dist` folder relative to the location of `photon.js` using node's `__dirname`. Because of the fact that browsers does not support a clear solution to get the relative path of embeded javascript file by itself, you have to set `Photon.__baseDir` manually when using the browserified version. And if you do not contain your `/dist` directory relative to the location of `photon.js` (which is the `main` file for the node module), you also have to set `Phoron.__baseDir` manually.

Therefore, if you get such an error, just try to set the `Photon.__baseDir` manually to the `/dist` folder you want to use to load your components

## Example

Just run the `demo/ShowReel` folder with `electron` and will see the whole beauty of Photon!

## Application Layout

The main layout of your application needs a `<ph-window>` element in which the `<tool-bar>`'s and your `<window-content>` will find their place.

```html
<ph-window>
  <!--Top header bar here-->
  <tool-bar type="header">
    Toolbar Header
  </tool-bar>
  <!--Window content here-->
  <window-content>
    Window Content
  </window-content>
  <!--Bottom footer bar here-->
  <tool-bar type="footer">
    Footer Header
  </tool-bar>
</ph-window>
```

## Components

* [Panes](#panes)
* [Navigation](#navigation-list)
* [Toolbar](#toolbar)
* [Table](#table-view)
* [Tabs](#tabs)
* [Lists/Swipes](#lists--swipes)
* [Button](#button)
* [Button Group](#button-group)
* [Circular Slider](#circular-slider)
* [ContentFrame/SelectList](#content-frame--select-list)
* [Input](#input)
* [NumberInput/Stepper](#number-input--stepper)
* [NumberInput](#number-input)
* [ProgressCircle](#progress-circle)
* [Slider](#slider)
* [Dialog](#dialog)

If you have a look at the project's structure, you will see that there exist a very well balanced component system you theoretically can contribute to with custom components.

### Styles

How do I set the **style** of the UI?
`Photon` supports multiple styles, inspired by native user interfaces from *macOS* or *Windows*.

By default, `Photon` tries to use the `style` that is connected to the running OS, stored in `process.platform`. But you can easily set the style to one of the supported ones. Note that the styles do not have the name of an operating system but their **real** name such as *cocoa*.

|Style Name|Related Operating System|     Support
|----------|------------------------|------------
|  `cocoa` |     macOS (Apple)      |        True
|  `metro` |  Windows (Microsoft)   |Cooming soon
|  `unity` |     Ubuntu (Linux)     |Cooming soon

#### Set Style

You can easily control the current style just with the `style` property of your `Photon` instance.

```javascript
// Set style
Photon.style = "cocoa";
// Works as expected
```

You can do this whenever you want while your application is running ;-)

Note, that when you set a style the first time in your session, it may takes time to load the resources because they are not cached.

#### Set An Invalid Style

```javascript
// Set style
Photon.style = "xxx";
// Occurs an error
```


### Panes

![Paned Layout](https://dev.maurice-conrad.eu/img/photon/paned1.png)

More about the panes in
[Panes](dist/PhotonPanes)

### Navigation List

![Navigation List](https://dev.maurice-conrad.eu/img/photon/navigation2.png)

More about the navigation list in
[Navigation List](dist/PhotonNavigation)

### Toolbar

![Toolbars](https://dev.maurice-conrad.eu/img/photon/toolbar1.png)

More about toolbars in [Toolbar](dist/PhotonToolbar)


### Table View

![Table View](https://dev.maurice-conrad.eu/img/photon/table1.png)

More about the table view in [Table View](dist/PhotonTable)

### Tabs

![Example](https://dev.maurice-conrad.eu/img/photon/tab1.gif)
![Example](https://dev.maurice-conrad.eu/img/photon/tab2.gif)

More about tabs in [Tabs](dist/PhotonTab)

### Lists & Swipes

#### Lists

![Lists](https://dev.maurice-conrad.eu/img/photon/lists.png)

#### Swipes

![Swipe](https://dev.maurice-conrad.eu/img/photon/swipe1.png)
![Swipe](https://dev.maurice-conrad.eu/img/photon/swipe2.png)

![Swipes Showreel](https://dev.maurice-conrad.eu/img/photon/swipes.gif)
(GIF is slower than in reality)

More about lists & swipe actions in [Lists & Swipes](dist/PhotonSwipe)

### Button

![Button Default](https://dev.maurice-conrad.eu/img/photon/button1.png)

![Button Default](https://dev.maurice-conrad.eu/img/photon/button2.png)

More about all buttons in [Button](dist/PhotonButton)

### Button Group

![Button Group Default](https://dev.maurice-conrad.eu/img/photon/buttongroupdefault.png)

![ButtonGroup Segmented](https://dev.maurice-conrad.eu/img/photon/buttongroupdesegmented.png)

More about the button group component in [Button Group](dist/PhotonBtnGroup)

### Circular Slider

![Circular Slider](https://dev.maurice-conrad.eu/img/photon/circularslider1.png)

More about the circular slider in [Circular Slider](dist/PhotonCircularSlider)

### Content Frame & Select List

![Input Field Focused](https://dev.maurice-conrad.eu/img/photon/contentframe2.png)

More about the content frames and selectable lists in [Content Frame & Select List](dist/PhotonContent)

### Input

#### Simple Text Field

![Input Field](https://dev.maurice-conrad.eu/img/photon/input1.png)
![Input Field Focused](https://dev.maurice-conrad.eu/img/photon/input2.png)

#### Number Input & Stepper

![Number Input with Stepper](https://dev.maurice-conrad.eu/img/photon/input3.png)

More about input fields in [Input](dist/PhotonInput)

### Messages

![Messages](https://dev.maurice-conrad.eu/img/photon/messages.png)

More about messages view in [Messages](dist/PhotonMessages)

### Number Input

![Number Input](https://dev.maurice-conrad.eu/img/photon/numberinput.png)

More about number input in [Number Input](dist/PhotonNumberInput)

### Progress Circle

![Progress Circle](https://camo.githubusercontent.com/3ed0dfb5ab01ce1ebd6ae06acf1b86214d038281/68747470733a2f2f7069636c6f61642e6f72672f696d6167652f72647063706c6f772f62696c6473636869726d666f746f323031362d31312d3132756d31352e332e706e67)

More about progress circle in [Progress Circle](dist/PhotonProgressCircle)

### Slider

![Slider](https://camo.githubusercontent.com/d4635dbfc74c802b7b6dac1edb65d68c1490850b/68747470733a2f2f7069636c6f61642e6f72672f696d6167652f726469706f7077612f62696c6473636869726d666f746f323031362d31312d3036756d32312e312e706e67)

More about sliders in [Slider](dist/PhotonSlider)

### Dialog

![Dialog](https://dev.maurice-conrad.eu/img/photon/dialog1.png)

More about dialog controller in [Dialog](dist/PhotonDialog)

### Drop Down Menu

![Dialog](https://dev.maurice-conrad.eu/img/photon/dropdown1.png)

More about drop down menu controller in [Drop Down Menu](dist/Drop Down Menu)

### Browserify

You can `browserify` the `photon.js` file completely using the `--ignore-missing` flag which ignores the missing `electron` requirements. Please note, that not all features are supported in browsers because they may need electron or node functions.

If you browserify `photon.js` and execute it in a non-node enviroment, the `Photon` instance will adopted globally to the *window* object.

This repository contains a valid browserified file named `photon-browser.js`, you normally should use.

### More

**You are missing something or do you have improvements?**

Please open a *pull-request* or an *Issue* and I will do my best ;-)

## Disclaimer

This framework is a **hard fork** of the original *PhotonKit* framework of *connors*. Because *connors* project is not developed anymore since more than **2** years, this is the release of Photon to version `1.0`.

Pieces of the code that is used here, is originally written by *connors*. The original code is contained within the CSS file `dist/PhotonOriginal/photon-original.css`.

But I made some important changes on the original components. E.g. I use modern technologies like **Custom Elements** to handle components much easier and cleaner and to provide a lighter API ;-)
