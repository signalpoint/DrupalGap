As of DrupalGap 7.x-1.0-rc4, it is now possible to build web apps with the DrupalGap SDK. That means we can now build a web based application that will run in any modern browser, including:

 - Firefox
 - Chrome
 - Safari
 - Opera
 - Internet Explorer

We are no longer limited only to the mobile app stores, our apps can now run everywhere on the Internet!

## Set the DrupalGap Mode

### Web App

`drupalgap.settings.mode = 'web-app';`

Use the **web-app** in the `settings.js` file to run the app as a web application. Then just navigate to your app's URL in any modern browser:

`http://www.example.com/mobile-application`

The URL above assumes you installed the DrupalGap SDK in a folder called **mobile-application** in the root of your Drupal site. If you place the SDK in any other folder then change **your** directory:

`drush "vset drupalgap_sdk_dir sites/default/files/mobile-application"`

Then set your installed SDK variable to true:

`drush "vset drupalgap_sdk_installed 1"`
