# Module / Component System

A new component should always exist as a own module contained in `dist/PhotonYourComponentsName`. This directory `PhotonYourComponentsName` has to be a valid node module with a `package.json` file.

To embed the component, you have to change the `components` object in the `photon.js` file. This array has to contain a property containing an object literal that describes your component.

For example, let's have a look at the descripro object used for the `Button` component.

```javascript
const components = {
  ...
  "Button": {
     path: "dist/PhotonButton", // Relative path to your components module directory
     style: "button.css" // Relative path to a optional CSS file (relative from 'path')
   }
  ...
}
```

This will make your component work in the recommened way!

Your component will be a property object of your `Photon` instance.

## Call global instance from module

To call the global `Photon` instance your module is a part of, you can use the `__self` property that will be exist in your module exports.

## Component Design

Is is recommended to use **[Custom components](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)** as they are specified officially if you want to implement a new component.
