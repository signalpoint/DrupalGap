### How to Upgrade the DrupalGap Module

More information on upgrading Drupal modules is [available here](https://www.drupal.org/node/250790).

### How to Upgrade the DrupalGap Mobile Application Development Kit

First and foremost, **make a backup of all of your code before beginning** in case you need to roll backwards to older code.

All custom code should be in the `index.html` file, the `modules` and `themes` folders, and the `settings.js` file. This allows DrupalGap to be updated with the `DrupalGap CLI`:

```
cd app
./dg up
```

Or you can follow these steps to manually update to the latest version:

1. [Download](http://drupalgap.org/download) the latest version of the SDK
2. Extract it into your app's `www` directory, so `index.html` and `drupalgap.min.js` (and many others) are overwritten with the new copies
3. Replace your `settings.js` file with the new `default.settings.js` file
4. Read [UPGRADE.md](https://github.com/signalpoint/DrupalGap/blob/8.x-1.x/UPGRADE.md) to understand what is new (and for developer code changes)
5. Migrate any changes originally made to your `settings.js` file back into the new `settings.js` file
6. Migrate any changes originally made to your `index.html` file back into the new `index.html`

That should be it, run your app to have the latest DrupalGap in use!
