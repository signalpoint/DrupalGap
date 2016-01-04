> This tutorial was adapted from [this issue](https://www.drupal.org/node/2230031)

This tutorial shows you how to compile your DrupalGap files into a mobile application using the [Adobe PhoneGap Build Creative Cloud](https://build.phonegap.com/) service.

## Modify index.html and settings.js files

Update `index.html` file to include the following line:

`<script src="phonegap.js"></script>`

So it looks like this:

```
<!-- jQuery Mobile -->
<link rel="stylesheet" href="jquery.mobile-1.4.2.min.css" />
<script src="phonegap.js"></script>
<script src="jquery-1.9.1.min.js"></script>
<script src="jquery.mobile-1.4.2.min.js"></script>
```

Change the DrupalGap mode in your `settings.js` file:

`drupalgap.settings.mode = 'phonegap';`

### Create config.xml : Option 1

Create a filed called config.xml in your root mobile application directory (the same place as index.html).

Copy the [example config.xml code from github](https://github.com/phonegap/phonegap-app-developer/blob/master/config.xml) directly into your config.xml.

Modify the config.xml file to change the Hello World text with your own app name. Modify any settings in the config.xml file to meet your needs.

### Create config.xml : Option 2

Alternatively, you can use [ConfiGap](http://configap.com/) to create your config.xml. ConfiGap requires Adobe Air to be installed on your computer.

Place the `config.xml` file in the same directory as `index.html`.

### Create apps in Adobe PhoneGap Build

Create a zip file of your entire mobile application folder.

Upload the zip file into the Adobe PhoneGap Build web interface to build your iOS, Android, and Windows apps. To build the iOS app, you need a key.

This ***page needs updating*** to include:

- Creating an iOS key;
- Creating folders to add app images;
