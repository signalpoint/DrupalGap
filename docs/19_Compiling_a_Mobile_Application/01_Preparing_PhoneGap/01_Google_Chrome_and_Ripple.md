With the [Ripple plugin for the Google Chrome Web Browser](http://emulate.phonegap.com/), we can test our DrupalGap mobile application inside a browser! This is a much better development experience because the Javascript console and HTML inspector are available to us.

## 1. Download and Install Google Chrome

[http://www.google.com/chrome](http://www.google.com/chrome)

## 2. Add the Ripple Plugin to Chrome

[http://emulate.phonegap.com/](http://emulate.phonegap.com)

Note, do not use the URL text field provided on this website.

## 3. Create a Folder to Run the Mobile Application

Say for example, we had a Drupal 7 website available at `http://www.example.com`. We then recommend creating a folder called `mobile-application` for the app to run in, for example:

`http://www.example.com/mobile-application`

Do **NOT** use *drupalgap* or *app* as the folder name. Also, do **NOT** set up a subdomain like `http://mobile-application.example.com` to run the app in. This will most likely cause **cross site** request forgery issues.

## 4. Download DrupalGap

[Download](http://drupalgap.org/download) and extract the latest release of the DrupalGap Mobile Application Development Kit.

## 5. Upload DrupalGap to Subdomain

Upload the entire contents of DrupalGap to the new folder we created earlier within your domain. After uploading the content of DrupalGap, these files will be present in the `mobile-application` directory:

```
app/*
bin/drupalgap.js
images/*
src/*
themes/*
index.html
jdrupal-*.js
jquery-*.js
jquery.mobile-*.css
jquery.mobile-*.js
...
```

## 6. Replace index.html with cordova.index.html (optional)

Copy the contents of the `cordova.index.html` file and save it into the `index.html` file:

`http://www.example.com/mobile-application/index.html <--- cordova.index.html`

This step *may or may not* be required, depending on your set up. The only difference between these two files is the inclusion of the `cordova.js` file in the body.

## 7. Copy default.settings.js to settings.js

Make a copy of the `default.settings.js` file and save it as `settings.js` in the `app` folder within DrupalGap:

`app/default.settings.js => app/settings.js`

The full path to your `settings.js` file will be something like this:

`http://www.example.com/mobile-application/app/settings.js`

## 8. Set the Site Path for the Drupal Website in settings.js

Open up the `settings.js` file, locate the `site_path` variable and set it to the URL of our Drupal 7 website. For example:

```
// Site Path
Drupal.settings.site_path = 'http://www.example.com';
```

## 9. Navigate to Subdomain in Google Chrome

Open up the Google Chrome browser and navigate to the mobile application, for example:

`http://www.example.com/mobile-application`

If a blank white page loads, click the Ripple icon in Google Chrome to enable Ripple on the page.

Once Ripple loads, it may ask us which platform we would like to use, select:

`Apache Cordova (1.0.0)`

Please Note: If you are having trouble getting the app to load you might need to change the **Cross Domain Proxy** under settings on the right hand side of Ripple to **Disable**.

If you're still having troubles loading the app in Ripple, try a URL like this in Chrome:

`http://www.example.com/mobile-application/index.html?enableripple=cordova-3.5.0`

## 10. Done!

Finally, we're done. If everything went smoothly, we should now see our DrupalGap mobile application loaded into our web browser's window. It seems like a lot to go through, but the end result is fantastic!

Now continue onward with the [Hello World](../Hello_World) guide or head back to the [Getting Started Guide](../) for information on building your app!
