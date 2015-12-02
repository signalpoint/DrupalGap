Until this page is completed, please refer to the [DrupalGap Presentation from DrupalCamp Michigan 2013](http://tylerfrankenstein.com/sites/default/files/DrupalGap.pdf) for a complete introduction.

## What is DrupalGap?

An open source application development kit for Drupal websites.

## What is DrupalGap used for?

To build custom mobile applications (and web apps) for Android and iOS devices to communicate with Drupal websites.

![DrupalGap Usage](http://drupalgap.org/sites/default/files/what-is-drupalgap_0.png)

## DrupalGap has two parts...

 - [Drupal Module](https://drupal.org/project/drupalgap)
 - [Application Development Kit](https://github.com/signalpoint/DrupalGap)

The Drupal Module opens up communication possibilities between an app and the website. The application development kit is used by developers to create custom mobile applications, and web applications.

## How does the module work?

The DrupalGap module uses the [Services](https://drupal.org/project/services) and [Views Datasource](https://drupal.org/project/views_datasource) modules to help mobile apps communicate with a Drupal website using [JSON](http://www.json.org/).

## How does the app development kit work?

The DrupalGap application development kit uses [jQuery Mobile](http://jquerymobile.com/) to build the user interface, and uses [PhoneGap](http://phonegap.com) to compile the app for installation as a mobile application on devices.

![DrupalGap Tools](http://drupalgap.org/sites/default/files/drupalgap-tools_0.png)

## How does PhoneGap work?

PhoneGap takes [HTML](http://www.w3schools.com/html/), [CSS](http://www.w3schools.com/css/) and [JavaScript](http://www.w3schools.com/js/) and compiles it into a mobile application for [Android](http://www.android.com/) and [iOS](https://www.apple.com/ios/) mobile devices (and [many others](http://phonegap.com/about/feature/)).

![How PhoneGap Works](http://drupalgap.org/sites/default/files/phonegap-chart_0.png)

PhoneGap provides access, via JavaScript, to mobile device features such as the Camera, GPS, File System, Contacts, Compass, Accelerometer, etc.

This means, if we know the basics of web development (html, css, javascript), then we can build mobile applications. This also means, our single set of code (HTML+CSS+JavaScript) can be used across multiple mobile platforms.

## A Simple Mobile Application Built with PhoneGap

Take this simple HTML page, for example (~/phonegap/www/index.html):

```
<html>
  <body>
      <h1>My Custom App</h1>
      <ul>
        <li><a href="#">Button #1</a></li>
        <li><a href="#">Button #2</a></li>
      </ul>
      <p>Hello World</p>
      <h2>www.example.com</h2>
  </body>
</html>
```

PhoneGap can take this and make it into a mobile application for us, it will look something like this:

![A simple PhoneGap app](http://drupalgap.org/sites/default/files/simple-phonegap-app_0.png)

It doesn't look amazing, but if we stop and think about that, it is pretty amazing. Kudos to the PhoneGap team.

Let's use another amazing tool to spice things up a bit, jQueryMobile.

## Applying jQueryMobile to the Mobile App

By using jQueryMobile, a few div containers, and the "data-role" attribute, our simple page is transformed into a slick mobile app interface:

![A simple jQuery Mobile app](http://drupalgap.org/sites/default/files/jquerymobile-transformation.png)

## The Same App with jQueryMobile Markup

```
<html>

  <head><!-- jQueryMobile includes go here --></head>

  <body>

    <div data-role="page">

      <div data-role="header"><h1>My Custom App</h1></div>

      <div data-role="navbar"><ul>
        <li><a href=”#”>Button #1</a></li>
        <li><a href=”#”>Button #2</a></li>
      </ul></div>

      <div data-role="content"><p>Hello World</p></div>

      <div data-role="footer"><h2>www.example.com</h2></div>

    </div><!-- page -->

  </body>
</html>
```

That's great, but...

What if we wanted to create another page in our app with the same header, navigatoin bar and footer, but with a different content area?

![Multi page app](http://drupalgap.org/sites/default/files/many-pages.png)

Would we copy and paste the page HTML, then modify only small chunks of HTML on the new page? We could do that, but if our app has many pages, this will become a nightmare to maintain.

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
