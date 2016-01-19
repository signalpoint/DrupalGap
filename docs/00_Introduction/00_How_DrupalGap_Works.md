> DrupalGap has two parts...

1. [Drupal Module](https://drupal.org/project/drupalgap)
2. [Application Development Kit](https://github.com/signalpoint/DrupalGap)

The module opens up communication between an application and a Drupal 8 website.

The application development kit is used by developers to create custom mobile applications, and web applications.

> How does the module work?

The module utilizes [Drupal 8 REST](https://www.drupal.org/documentation/modules/rest) and [JSON](http://www.json.org/) for applications communicate with a Drupal website.

> How does the application development kit work?

- uses an optional [CSS Framework](Introduction/CSS_Frameworks) (*of your choice*) to style the app's user interface
- optionally uses [PhoneGap (Cordova)](/Introduction/PhoneGap_and_Cordova) to compile the app for release on Android and iOS devices (*plus many others*)

> What tools are in the kit?

DrupalGap utilizes familiar Drupal 8 concepts like:

- Themes
- Regions
- Blocks
- Routes
- Pages

And techniques for customization such as:

- Modules
- Hooks
- Templates
