> To get this to work in a compiled mobile application (i.e. on your Android or iOS device), you must install the [InAppBrowser plugin](https://github.com/apache/cordova-plugin-inappbrowser) for your app.

Sometimes we want our Mobile Application to link to an external web page. PhoneGap has an InAppBrowser feature for this, so we can make external links in DrupalGap with these techniques:

## Using the l() and bl() Functions

The `l()` function is shorthand for **link**. The `bl()` function is shorthand for **button link**.

## Text Link

var html = dg.l('DrupalGap', 'http://drupalgap.org');

## Button Link

var html = dg.bl('DrupalGap', 'http://drupalgap.org');

### Using a Render Element

```
var element = {};
element['my_link'] = {
  _theme: 'link',
  _text: 'DrupalGap',
  _path: 'http://www.drupalgap.org'
};
return element;
```

You can use either `link` or `button_link` for the theme.

### Plain HTML Link

`<a onclick="javascript:window.open('http://drupalgap.org', '_blank', 'location=yes');">DrupalGap</a>`

## System Browser

It's possible to open links in the user's default browser using the `_system` target:

```
var html = dg.bl('example.com', null, {
    attributes: {
      onclick: "window.open('http://drupalgap.org', '_system', 'location=yes')"
    }
});
```
