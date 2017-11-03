This doc describes how to build buttons with DrupalGap.

## Button Link

The `dg.bl()` function is a quick way to create button links.

Here's an example button that when clicked, will go to the app's user login page:

```
var linkText = dg.t('My Button Link');
var linkPath = 'user/login';
var linkHtml = dg.bl(linkText, linkPath);
```

Once you have the button's html, you can do whatever you want with it. A simple example is placing the html into the `_markup` within a render element.

```
var element = {};

element.my_button_link = {
  _markup: buttonLinkHtml
};

return element;
```

## Button

Here's an example that creates a simple button. When the button is clicked, it will display a message.

```
var element = {};

element.my_button = {
  _theme: 'button',
  _value: dg.t('My Button'),
  _attributes: {
    onclick: "dg.alert(dg.t('You clicked me!'));"
  }
};

return element;
```

Since creating buttons is such a common task, there's a shortcut to create a button's html by using `dg.b()`:

```
var buttonHtml = dg.b(dg.t('My button'), {
  _attributes: {
      onclick: "dg.alert(dg.t('You clicked me!'));"
    }
});
```

Once you have the html, you can do whatever you want with it. A simple example is placing the html into the `_markup` within a render element.

```
element.my_button = {
  _markup: buttonHtml
};
```
