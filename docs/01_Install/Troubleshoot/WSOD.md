Ah, the dreaded white screen of death, le sigh.

The WSOD is a common problem when first creating your app, or when first trying to run it in an emulator or compile it directly to your device. Where/when are you experiencing the WSOD?

## cordova.js

When we compile an app directly to our device for testing, we need to include the `cordova.js` file in the head of our index.html file. Take a look at the `cordova.index.html` file for an example of how to include the `cordova.js` file in your `index.html` file. If we don't include this file, and try to run an app directly on our device, we'll most likely get a WSOD.

The `cordova.js` file is not required when building a web application.

## Ripple

Make sure you are accessing the app via the correct URL, for example:

`http://www.example.com/app`

It's worth noting that when testing an app inside of Ripple, the `cordova.js` file is most likely not needed. In most cases, it appears Ripple dynamically loads the `cordova.js` file into your app. Results may vary, so try including/excluding the `cordova.js` file in your `index.html` file for a fix.

## Plugins

When compiling directly to a device, did you [install the Cordova plugins](../../Compiling_a_Mobile_Application/Preparing_PhoneGap/Installing_PhoneGap) (step # 4)?

## Accurately Debugging the WSOD

First, be sure to set `jDrupal.settings.debug = true;` in your `settings.js` file, so you can watch debug information while it is printed to the console.

Next, stepping through the DrupalGap bootstrap process and printing messages to the `console.log()` each step of the way, is the absolute best way to debug the WSOD.

You use can modify the `drupalgap.js` directly, or use `Grunt` or the makefile to `drupalgap.js` and `drupalgap.min.js` from the `src/` directory.

Once you're ready to place some `console.log()` statements in DrupalGap core, here are the first few functions that are called:

```
dg.start();
dg.deviceready();
dg.bootstrap();
etc...
```

Try placing `console.log()` messages in these functions each step of the way. That should reveal to you what line(s) are crashing.

This is very important in debugging the WSOD, so please try this and report your findings in one of the issue queues.
