Ah, the dreaded white screen of death, le sigh. This page should help in resolving the WSOD, and so should the [Troubleshoot Page](Resources/Troubleshoot).

## Debugging the WSOD

1. Set `jDrupal.settings.debug = true;` in your `settings.js` file
2. Open the `Console` tab in your browser's development tools


This allows you to see debug information and errors printed to the console log. It should reveal to you the error(s) causing the WSOD. Listed below are common WSOD conole log error messages and how to fix them.

## Common WSOD Issues

> Uncaught ReferenceError: jDrupal is not defined

DrupalGap can't find jDrupal. First, make sure the `jdrupal.min.js` exists in your app's folder. If it doesn't, download jDrupal:

```
cd app
wget https://raw.githubusercontent.com/signalpoint/jDrupal/8.x-1.x/jdrupal.min.js --no-check-certificate
```

Second, make sure `jdrupal.min.js` is included in your `index.html` file before the `drupalgap.min.js` file:

```
<script type="text/javascript" charset="utf-8" src="jdrupal.min.js"></script>
```

> GET https://example.com/jdrupal/connect?_format=json 403 (Forbidden)
> GET https://example.com/jdrupal/connect?_format=json 404 (Not Found)
> deviceready connect failed


The jDrupal module for your Drupal 8 site is either not enabled, or not configured correctly. Refer to the [jDrupal README](http://cgit.drupalcode.org/jdrupal/tree/README.md) for more information.

> Failed to load resource: net::ERR_NETWORK_CHANGED

If this mentions a `xhr network status problem for csrf token`, check that your Drupal site is online and that you have an Internet connection. If your app is behind a VPN, make sure you are connected to that as well.

## WSOD while compiling to device

The WSOD is a common problem when first compiling your app to an Android or iOS device. Again, the best way to debug this is to utilize your browser's `Console` tab in its development tools. In both cases, we're assuming your device is already connected to your computer via USB and you've successfully compiled the app, but are experiencing the WSOD.

For Android devices, open Chrome, go to `Tools -> Inspect devices`, then click the `Console` tab to spot any errors.

For iOS devices, open Safari, and use its developer tools to inspect your device, then click the `Console` tab to spot any errors.

### cordova.js

When we compile an app directly to our device for testing, we need to include the `cordova.js` file in the head of our index.html file. Take a look at the `cordova.index.html` file for an example of how to include the `cordova.js` file in your `index.html` file. If we don't include this file, and try to run an app directly on our device, we'll most likely get a WSOD.

### Plugins

Did you install all the needed cordova plugins?

## Digging deeper into the WSOD

Next, stepping through the DrupalGap bootstrap process and printing messages to the `console.log()` each step of the way, is the absolute best way to debug the WSOD.

You use can modify the `drupalgap.js` directly, or use `Grunt` to build the `drupalgap.js` and `drupalgap.min.js` from the `src/` directory.

Once you're ready to place some `console.log()` statements in DrupalGap core, here are the first few functions that are called:

```
dg.start();
dg.deviceready();
dg.bootstrap();
etc...
```

Try placing `console.log()` messages in these functions each step of the way. That should reveal to you what line(s) are crashing.

This is very important in debugging the WSOD, so please try this and report your findings in one of the issue queues.
