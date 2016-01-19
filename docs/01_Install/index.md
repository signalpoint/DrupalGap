## 1. Set up a Drupal 8 Website

To build an application, we first need a Drupal 7 website. For simplicity, we'll want our Drupal 7 website to be available online. This means, we should be able to access the website using the web browser on our mobile device.

Chances are if you are reading this, you already have a Drupal website online (or several). If that is the case, go ahead and jump to step #2. If you are new to Drupal, don't worry, there are plenty of great resources on getting a Drupal 7 website up and running.

 - [Download Drupal](https://drupal.org/download)
 - [Install Drupal](http://drupal.org/documentation/install)

## 2. Enable the DrupalGap Module

For our app to communicate with Drupal, the [DrupalGap module](http://www.drupal.org/project/drupalgap) needs to be enabled.

- [Install and Configure the DrupalGap Module](http://cgit.drupalcode.org/drupalgap/plain/README.md?h=8.x-1.x).

## 3. Install the DrupalGap SDK

For starters, we'll build a web application which is by far the easiest way to get our feet wet:

```
# On your Drupal 8 site...
cd www
wget https://github.com/signalpoint/DrupalGap/archive/8.x-1.x.zip
unzip 8.x-1.x.zip
mv DrupalGap-8.x-1.x/ web-application
rm 8.x-1.x-zip
cd web-application
wget https://raw.githubusercontent.com/easystreet3/jDrupal/8.x-1.x/jdrupal.min.js --no-check-certificate
cp app/default.settings.js app/settings.js
```

Then open the `app/settings.js` file, set the `sitePath` value to `http://example.com`, and save the file.

## 4. Done!

> We're now ready to build an application!

Try a demo of your app by visiting `http://example.com/web-application` in your browser.

If you haven't already, we'd recommend completing the [Hello World](Hello_World) for DrupalGap next.
