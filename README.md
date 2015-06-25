DrupalGap is an open source mobile application development kit for
Drupal websites. This project utilizes Drupal, PhoneGap (Cordova), jQueryMobile
and jDrupal.

  http://www.drupalgap.org

With DrupalGap developers can create custom multi-platform mobile
applications that communicate with their Drupal websites.

|==============|
| Installation |
|==============|

For complete details, please visit the DrupalGap Hello World documentation.

    http://www.drupalgap.org/hello-world

====

1. Download the latest stable release of DrupalGap:

     https://github.com/signalpoint/DrupalGap/releases

2. Extract the downloaded DrupalGap archive into the www directory
   located within your PhoneGap project workspace. When you are done,
   the drupalgap.js file will be located here:

     www/bin/drupalgap.js

   Note, the DrupalGap index.html will overwrite the index.html provided
   by PhoneGap.

3. Open www/app/default.settings.js and save a copy of it as settings.js
   so the copy of it lives here: 
   
     www/app/settings.js
   
4. Specify your Drupal site path (with NO trailing slash) in settings.js,
   for example:

     Drupal.settings.site_path = 'http://www.example.com';

5. Run your new Mobile Application!

===================================

From here you'll have a great start to building a mobile application that
integrates with your Drupal website. Check out topics in the Getting
Started Guide to continue.

|=======================|
| Getting Started Guide |
|=======================|

http://www.drupalgap.org/get-started

|==================|
| More Information |
|==================|

http://www.drupalgap.org
http://api.drupalgap.org
