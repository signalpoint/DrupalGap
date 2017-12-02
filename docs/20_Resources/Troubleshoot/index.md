## Properly troubleshooting

When debugging and troubleshooting, it is advised to change your `index.html` file to use `drupalgap.js` and `jdrupal.js` instead of the `*.min.js` version of the two. This allows your browser's developer tool's console log output to show you the exact line number(s) causing problems.

## Common errors

> settings.js file

Double check the `sitePath` variable in the `settings.js` file is pointing to your Drupal 8 website.

Be careful not to leave any syntax errors in your `settings.js` file, as this will most likely cause a WSOD for the app.

> Testing connection...

If you get stuck with this message on `admin/config/services/drupalgap`, open your browser's development tool's `Console` tab and look for the error(s) being thrown. Chances are, you can find that error listed here or mentioned in one of the issue queues.

> Failed to load resource: the server responded with a status of 404 (Not Found)

If this happens on the `connect?_format=json` call, then you probably forgot to set your `sitePath` value for jDrupal in the `settings.js` file.

> Failed to load resource: the server responded with a status of 406 (Not Acceptable)

If it happens on `/user/1?_format=json`, then go to `admin/config/services/rest` in Drupal, and enable `User` under the `Resource name` section. Then enable the `GET`, `json` and `cookie` checkboxes under `Methods`, `Accepted request formats` and `Authentication providers`.

> Uncaught (in promise) TypeError: window[] is not a function

This probably means you forgot to include a theme's `.js` file in the `<head>` of your `index.html` file.

> Uncaught TypeError: a.replace is not a function at Object.dg.getCamelCase

This probably means you've created a `form.id` element on your form. The `id` element is reserved by DrupalGap, and overwriting it may lead to unintended consequences.

> GET https://www.example.com/node/123?_format=json 406 (Not Acceptable)

You need to enable the `Content` Resource at `admin/config/services/rest`, then enable `GET`, `JSON` and `cookie`.

> Uncaught (in promise) TypeError: Cannot read property 'js' of undefined
> Uncaught (in promise) TypeError: Cannot read property 'css' of undefined

On an `_attached` variable, you probably declared the library name as a string instead of an array.
