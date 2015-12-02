### How to Upgrade the DrupalGap Module

More information on upgrading Drupal modules is [available here](http://tylerfrankenstein.com/code/how-update-drupal-module).

### How to Upgrade the DrupalGap Mobile Application Development Kit

First and foremost, **make a backup of all of your code before beginning** in case you need to roll backwards to older code.

All custom code should be in the app folder:

`app`

This allows DrupalGap to be updated easily. Then we can follow these steps to update to the latest version:

1. [Download](http://drupalgap.org/download) the latest release of DrupalGap
2. Extract DrupalGap into PhoneGap's www directory, so `index.html` and `bin/drupalgap.min.js` are overwritten with the new copies
3. Replace your `app/settings.js` file with the new `app/default.settings.js` file
4. Read [UPGRADE.md](https://github.com/signalpoint/DrupalGap/blob/7.x-1.x/UPGRADE.md) to understand what is new (and for developer code changes)
5. Migrate any changes originally made to your `settings.js` file back into the new `app/settings.js` file
6. Migrate any changes originally made to your `index.html` file back into the new `index.html`

That should be it, run your app to have the latest DrupalGap in use!