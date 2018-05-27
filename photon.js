(function() {
  const fs = require('fs');
  const path = require('path');

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
        if (Photon.hasOwnProperty(key)) {
          const property = Photon[key];
          // If the property contains a valid component
          if (property && property[componentSymbol]) {
            // Get the compontents full path
            let componentBaseDir = path.join(this.__baseDir, components[key]);
            // Get the stylesheet's full path
            let styleSheetPath = componentBaseDir + "/styles/" + styleName + ".css";
            // Make posix path working on non-unix systems
            styleSheetPath = styleSheetPath.replace(/\\/g, "/");

            // Append an @import statement to the styleheet of photon that refers to the components stylesheet
            photonStyle.append('@import "' + styleSheetPath.replace(/\\/g, "/") + '";');
          }
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

  Photon.__baseDir = __dirname;


  if (window) {
    window.Photon = Photon;
  }
  module.exports = Photon;

})();
