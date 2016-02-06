## Properly troubleshooting

When debugging and troubleshooting, it is advised to change your `index.html` file to use `drupalgap.js` and `jdrupal.js` instead of the `*.min.js` version of the two. This allows your browser's developer tool's console log output to show you the exact line number(s) causing problems.

## Common errors

> Set the sitePath in the settings.js file

You either forgot to set the `sitePath` variable in the `settings.js` file, or there is a syntax error in your `settings.js` file.

> Failed to load resource: the server responded with a status of 404 (Not Found)

If this happens on the `connect?_format=json` call, then you probably forgot to set your `sitePath` value for jDrupal in the `settings.js` file.

> Uncaught (in promise) TypeError: window[] is not a function

This probably means you forgot to include a theme's `.js` file in the `<head>` of your `index.html` file.
