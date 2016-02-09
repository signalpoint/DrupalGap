Here are a few techniques for debugging DrupalGap.

## Turn on Debug Mode

Open the app's `settings.js` file and set the following line to true:

`Drupal.settings.debug = true;`

This will then output useful debug information to the console.

## JavaScript Console

Depending on your development environment, `console.log()` debug messages can be printed to your environment's JavaScript.

### console.log()

The `console.log()` function works well for debugging.

### dpm()

DrupalGap comes with a `dpm()` function. Similar to the `dpm()` function provided by the Devel module, this can be used to output messages, objects and arrays to the JavaScript console. **Unfortunately** this function doesn't yet work very well when building a web app, so you'll probably want to use `console.log()` instead.

```
// Output a message to the console.
dpm("my debug message");

// Output an array to the console.
var stuff = ['one', 'two', 'three'];
dpm(stuff);

// Output an object to the console.
var other_stuff = {
  one: "Fun",
  two: "Blue",
  three: "Bee"
}
dpm(other_stuff);
```

### Debugging a compiled app's console.log

When compiling an app to your phone over USB using the PhoneGap (Cordova) Command Line Interface (CLI), it can be handy to view the JavaScript `console.log()`. Run this terminal command after your app is running in debug mode:

`adb shell logcat | grep 'Web Console'`

If that doesn't work, later versions of PhoneGap/Cordova use slightly different syntax:

`adb shell logcat | grep 'CONSOLE'`

### Inspecting a compiled app with Chrome

https://developer.chrome.com/devtools/docs/remote-debugging

1. Build the DG app apk with debugging enabled
2. Enable USB debugging on the device
3. Connect to the PC
4. Visit `chrome://inspect` (in your browser)
5. Click the Webview 'inspect' button
6. Accept the request to debug (on the device)

## drupalgap_set_message()

View the [Messages](../Widgets/Messages) page for information about displaying informative messages to users/developers.

## settings.js

### Drupal.settings.debug

In the "development" section of the `settings.js` file, you can set the debug option to true. This means informative `console.log()` messages will be output to your JavaScript console.

### window.localStorage.clear

By placing this line at the top of your `settings.js` file:

`window.localStorage.clear();`

This assures that each time the app is loaded, everything is cleared from local storage. This means anything fetched previously from your Drupal server will be removed from local storage (if it was saved there). Then when the app requests something from the server, it is guaranteed to grab a fresh copy.
