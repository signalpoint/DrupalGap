### 1. Set up a Drupal 8 Website

 - [Download Drupal](https://drupal.org/download)
 - [Install Drupal](http://drupal.org/documentation/install)

### 2. Enable the DrupalGap 8 Module

- [Install and Configure the DrupalGap Module](http://cgit.drupalcode.org/drupalgap/plain/README.md?h=8.x-1.x)

### 3. Install the DrupalGap SDK

Go to your Drupal root folder and run the DrupalGap `install` script, or you can [manually install the SDK](Resources/Manual_Installation).

```
cd drupal
./modules/contrib/drupalgap/scripts/install app https://www.example.com
```

This will create a folder called `app`, place the DrupalGap SDK inside of it, create a `settings.js` file for the app and then set the `sitePath` variable to `https://www.example.com`.

## Done

This sets up an empty web app. You can easily add [other types of apps](Introduction/Types_of_Applications) later, all with only `one set of code`.

> Demo it in a browser by visiting:

```
https://www.example.com/app
```
