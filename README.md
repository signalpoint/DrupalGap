An application development kit for Drupal websites, built with Angular JS.

# WARNING - 7.x-2.x

This branch is not production ready as we are completely rebuilding the
DrupalGap engine to work with Angular JS. For a production ready DrupalGap,
check out the default `7.x-1.x` branch and releases built on top of jQuery
Mobile:

 - https://github.com/signalpoint/DrupalGap

# DOCS

 - http://drupalgap.org/angular

# INSTALLATION

## 0. Set up a Drupal 7 Website

## 1. Enable DrupalGap 7.x-2.x Module

On your Drupal site, enable the DrupalGap 7.x-2.x module:

 - http://drupal.org/project/drupalgap

## 2. Install the DrupalGap 2 SDK

 a. Download the SDK: https://github.com/signalpoint/DrupalGap/archive/7.x-2.x.zip
 b. Extract the zip file's contents to the folder you wish to run the app in

The app runs using the DrupalGap SDK's `index.html` file, so where you extract
the SDK typically depends on what type of application you're building. For
beginners, we recommend the *Web App* approach as it is the easiest to set up,
and easily translates to a mobile app (or Headless/Decoupled Drupal) later on.

Here are some typical SDK installation directories and Drupal site locations,
depending on the flavor of your app:

**Web Apps**

If you're building a web app (or want a place to quickly develop and test a
mobile app), then the SDK would typically live within the same domain as the
Drupal website:

```
// The Drupal site lives here.
http://example.com

// The DrupalGap SDK lives here
http://example.com/application

```

**Mobile Apps**

If you're building a mobile application (with PhoneGap/Cordova) the SDK would live
inside the `www` directory of the project on your computer, and the Drupal site
would live up on the Internet:

```
// The DrupalGap SDK lives here.
~/Desktop/my_phonegap_project/www

// The Drupal site lives here.
http://example.com
```

**Headless/Decoupled Drupal**

If you're building a Headless/Decoupled Drupal site/app, then the app would
typically live at the root of your site's www directory, and Drupal would live
somewhere within that same domain:

```
// The DrupalGap SDK lives here
http://example.com

// The Drupal site lives here.
http://example.com/application

```

## 3. Run the install command

### Node JS Package Manager - npm (recommended)

### Install Script (for developers without npm)

From the DrupalGap SDK directory, run these terminal commands:
```
chmod +x drupalgap
./drupalgap install
```

## 4. app.js

Open the `app/js/app.js` file and enter the `sitePath` to your Drupal website:

```
sitePath: 'http://example.com',
```

This value is for the `drupalSettings` of the `angular-drupal` config function.

## 5. Run the app

This is an exciting step, so don't forget about step # 6 afterwards. Here are
the various ways to launch your app:

**Web App**

To run a the web app, simply visit the `application` directory in any modern
browser:

```
http://example.com/application
```

**Mobile App**

To compile a mobile application, see here for more information:

```
http://drupalgap.org/node/126

**Headless/Decoupled Drupal**

To run a the Headless/Decoupled Drupal app, simply visit the apps domain in any
modern browser:

```
http://example.com
```

## 6. drupalgap.json

Open your application in a browser, then login to the app as an admin. Click the
"Administer" link, then click the "Connect" link. Copy all the text in the text
area and save it to this file:

```
app/js/drupalgap.json
```

This allows DrupalGap to better understand many things about your Drupal
website. Alternatively, this value can be retrieve on your Drupal site, just
navigate to `http://example.com/drupalgap/connect` as an admin. Then in your
browser, click File -> Save, and then save this JSON output to the file
mentioned above.

