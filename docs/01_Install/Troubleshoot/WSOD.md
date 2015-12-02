Ah, the dreaded white screen of death, le sigh.

The WSOD is a common problem when first creating your app, or when first trying to run it in an emulator or compile it directly to your device. Where/when are you experiencing the WSOD?

## cordova.js

When we compile an app directly to our device for testing, we need to include the `cordova.js` file in the head of our index.html file. Take a look at the `cordova.index.html` file for an example of how to include the `cordova.js` file in your `index.html` file. If we don't include this file, and try to run an app directly on our device, we'll most likely get a WSOD.

The `cordova.js` file is not required when building a web application.

## Ripple

Make sure you are accessing the app via the correct URL, for example:

`http://www.example.com/mobile-application`

It's worth noting that when testing an app inside of Ripple, the `cordova.js` file is most likely not needed. In most cases, it appears Ripple dynamically loads the `cordova.js` file into your app. Results may vary, so try including/excluding the `cordova.js` file in your `index.html` file for a fix.

## Plugins

When compiling directly to a device, did you [install the Cordova plugins](../../Compiling_a_Mobile_Application/Preparing_PhoneGap/Installing_PhoneGap) (step # 4)?

## During Logging Out

Some devices have problems with the default logout mechanism and result in a WSOD. To get around this, try adding a page transition of 'none' to your logout link.

## Other WSOD Issues

- [https://drupal.org/node/1677872](https://drupal.org/node/1677872)
- [https://drupal.org/node/2246375](https://drupal.org/node/2246375)
- [https://github.com/signalpoint/DrupalGap/issues/200](https://github.com/signalpoint/DrupalGap/issues/200)
- [https://github.com/signalpoint/DrupalGap/issues/267](https://github.com/signalpoint/DrupalGap/issues/267)
- [https://github.com/signalpoint/DrupalGap/issues/370](https://github.com/signalpoint/DrupalGap/issues/370)
- [https://github.com/signalpoint/DrupalGap/issues/373](https://github.com/signalpoint/DrupalGap/issues/373)
- [https://github.com/signalpoint/DrupalGap/issues/415](https://github.com/signalpoint/DrupalGap/issues/415)
- [https://github.com/signalpoint/DrupalGap/issues/426](https://github.com/signalpoint/DrupalGap/issues/426)

## Accurately Debugging the WSOD

First, be sure to set `Drupal.settings.debug = true;` in your `settings.js` file, so you can watch debug information while it is printed to the console.

Next, stepping through the DrupalGap bootstrap process and printing messages to the `console.log()` each step of the way, is the absolute best way to debug the WSOD.

You can modify the `bin/drupalgap.js` directly, or use the makefile to build it from the `src/` directory. Refer to the Developer's Guide for more information on debugging DrupalGap core.

Once you're ready to place some `console.log()` statements in DrupalGap core, here are the first few functions that are called:

```
drupalgap_onload();
_drupalgap_deviceready();
drupalgap_bootstrap();
etc...
```

Try placing `console.log()` messages in these functions each step of the way. That should reveal to you what line(s) are crashing.

This is very important in debugging the WSOD, so please try this and report your findings in one of the issue queues.