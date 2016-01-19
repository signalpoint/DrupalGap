> Uncaught TypeError: Cannot read property 'routing' of undefined
This usually means you have a jDrupal module declared in your `settings.js` file, but have not included the module's `.js` file in the `<head>` of the `index.html` file.

> Failed to load resource: the server responded with a status of 404 (Not Found)
If this happens on the `connect?_format=json` call, then you probably forgot to set your `sitePath` value for jDrupal in the `settings.js` file.
