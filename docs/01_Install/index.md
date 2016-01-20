### 1. Set up a Drupal 8 Website

 - [Download Drupal](https://drupal.org/download)
 - [Install Drupal](http://drupal.org/documentation/install)

### 2. Enable the DrupalGap 8 Module

- [Install and Configure the DrupalGap Module](http://cgit.drupalcode.org/drupalgap/plain/README.md?h=8.x-1.x)

### 3. Install the DrupalGap SDK

```
cd drupal
wget https://github.com/signalpoint/DrupalGap/archive/8.x-1.x.zip
unzip 8.x-1.x.zip
mv DrupalGap-8.x-1.x/ web-application
rm 8.x-1.x-zip
cd web-application
wget https://raw.githubusercontent.com/easystreet3/jDrupal/8.x-1.x/jdrupal.min.js --no-check-certificate
cp app/default.settings.js app/settings.js
```

This sets up the app as a web application (*[types of apps](Introduction/Types_of_Applications)*). Don't worry, you can easily add other types of apps later, all with only `one set of code`.

### 4. Tell the SDK Where Drupal Lives

1. Open the `app/settings.js` file
2. Set the `sitePath` value to `http://example.com`
3. Save the file

### 5. Done!

> Try a demo in your browser by visiting:

```
http://example.com/web-application
```
