This page describes how to use [jQuery Mobile's Theme Roller](http://jquerymobile.com/themeroller/index.php) to design a custom theme for DrupalGap. If you haven't already done so, ***you must*** [create a custom theme](Themes/Create_a_Custom_Theme) first.

To see a full example of a custom DrupalGap theme, check out the [drupalgap_demo](https://github.com/signalpoint/drupalgap_demo) application.

## Design the Theme

Use [jQuery Mobile's Theme Roller](http://jquerymobile.com/themeroller/index.php) to design a custom theme.

## Download the Theme

After designing the theme, click the "Download theme zip file" button, enter the machine name of your theme:

![jQuery Mobile Theme Roller Theme Name Input](http://www.drupalgap.org/sites/default/files/Screenshot%20from%202014-01-24%2015%3A03%3A34.png)

Then click the "Download Zip" button.

## Extract the Theme's Files

After downloading the zip file from jQM, extract the images directory and these three files so they all live within the app here:

```
app/themes/my_theme/images/*
app/themes/my_theme/jquery.mobile.icons.min.css
app/themes/my_theme/my_theme.css
app/themes/my_theme/my_theme.min.css
```

These files will exist alongside the my_theme.js and page.tpl.html file for the custom theme.

## Add the CSS Files to index.html

Now we need to tell DrupalGap about the new assets for our custom theme. This is done by making some small modifications to our app's index.html file.

Remove this line from index.html:

`<link rel="stylesheet" href="jquery.mobile-1.4.5.min.css" />`

Then replace it with these three lines, for example:

```
<link rel="stylesheet" href="app/themes/my_theme/my_theme.css" />
<link rel="stylesheet" href="app/themes/my_theme/jquery.mobile.icons.min.css" />
<link rel="stylesheet" href="jquery.mobile.structure-1.4.5.min.css" />
```

## Specify the Theme in settings.js

If you haven't already done, specify the theme's machine name in the settings.js file:

```
// Theme
drupalgap.settings.theme = 'my_theme';
```

## How to use Different Theme Swatches

By default DrupalGap uses the "A" swatch of the jQM theme rolled design. In order to use the other swatches, just add for example, a data-theme="b" attribute to html elements within the app.
