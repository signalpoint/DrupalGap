

DrupalGap comes with a Block that allows you to easily display a logo within your app.

## Logo Image

First, specify the path to your logo in the `settings.js` file:

`drupalgap.settings.logo = 'themes/easystreet3/images/drupalgap.jpg';`

The default logo is provided above, so typically you'll want to include a custom logo within your custom theme, for example:

`drupalgap.settings.logo = 'app/themes/my_theme/logo.jpg';`

Or you can place the logo in a custom module:

`drupalgap.settings.logo = 'app/themes/my_theme/logo.jpg';`

## Logo Block

Once you have specified the file path to your logo's image, you'll specify which region the logo block will show up in. For example, we could add the logo block to the header region of our theme in the `settings.js` file:

```
drupalgap.settings.blocks.my_theme = {

  /* .. other regions ... */

  header: {

    /* ... other blocks ... */

    logo: {},

    /* ... other blocks ... */

  },

  /* .. other regions ... */

};
```