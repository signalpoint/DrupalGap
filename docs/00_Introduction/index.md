## What is DrupalGap?

> An open source application development kit for Drupal websites.

## What is DrupalGap used for?

> Build custom apps, `with one set of code`, and then deploy them to a wide range of **app stores**, **devices** and **browsers**.

![DrupalGap Flow](http://drupalgap.org/sites/default/files/drupalgap-flow.jpg)

## What is under DrupalGap's hood?

> Since Drupal covers our needs on the backend, let's learn more about our needs on the front end. This is where PhoneGap and jQuery Mobile come into play.

## Introducing the DrupalGap Mobile App Development Kit

Let's add DrupalGap to the mobile app. Place the DrupalGap mobile app development kit files into PhoneGap's www directory to utilize its features:

 - ~/phonegap/www/index.html
 - ~/phonegap/www/bin/drupalgap.js
 - ... etc ...

DrupalGap core comes packaged as a single Javascript file:

`~/phonegap/www/bin/drupalgap.min.js`

It also comes with a theme:

`~/phonegap/www/themes/*`

some default settings:

`~/phonegap/www/app/default.settings.js`

and a place to house all of the custom code for our app:

`~/phonegap/www/app/*`

The "app" directory is similar to the "sites/all" directory in Drupal.

DrupalGap also comes with all of its own source code:

`~/phonegap/www/src/*`

## Getting Started

Refer to the [Getting Started Guide](../) for complete details.

First, enable the DrupalGap module on your Drupal site. Then make a copy of the default.settings.js file, and save it as settings.js in the "app" folder:

`~/phonegap/www/app/default.settings.js => ~/phonegap/www/app/settings.js`

Then set the *site_path* variable in the *settings.js* file:

```
Drupal.settings.site_path = 'http://www.example.com';
```

## Now What?

DrupalGap utilizes familiar Drupal concepts like:

 - Themes
 - Regions
 - Blocks
 - Menus
 - Pages

And techniques for customization such as:

 - Modules
 - Hooks
 - Themes
 - Templates
