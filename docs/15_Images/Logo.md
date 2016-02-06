

DrupalGap comes with a Block that allows you to easily display a logo within your app.

## Logo Image

First, specify a render element for your logo in the `settings.js` file:

```
dg.settings.logo = {
  _theme: 'image',
  _path: 'modules/custom/my_module/images/logo.jpg'
};
```

You can also use an externally hosted image by setting the `_path` to something like:

`http://example.com/logo.jpg`

Since the logo is a render element, you can get very creative with how and what your logo displays.

[Add the logo block to a region](../Blocks/Adding_Block_Region.md) to have it displayed within the app.
