### 1. Set up a Drupal 8 Website

 - [Download Drupal](https://drupal.org/download)
 - [Install Drupal](http://drupal.org/documentation/install)

### 2. Enable the DrupalGap 8 Module

- [Install and Configure the DrupalGap Module](http://cgit.drupalcode.org/drupalgap/plain/README.md?h=8.x-1.x)

### 3. Install the DrupalGap SDK

Go to your Drupal root folder and run the DrupalGap `install` script, or you can [manually install the SDK](Resources/Manual_Installation).

```
cd drupal
./modules/contrib/drupalgap/scripts/install app
```

### 4. Tell the SDK Where Drupal Lives

1. Make a copy of the app's `default.settings.js` file and save it as `settings.js`
2. Open the `settings.js` file and set the `sitePath` value to `http://example.com`
3. Save the file

```
cd app
cp default.settings.js settings.js
vim settings.js
```

### 5. Done!

This sets up an empty web app. You can easily add [other types of apps](Introduction/Types_of_Applications) later, all with only `one set of code`.

> Demo it in a browser by visiting:

```
http://example.com/app
```
