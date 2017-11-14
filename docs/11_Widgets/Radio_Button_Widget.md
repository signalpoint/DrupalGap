View the [Radio Button Form Element](../Forms/Form_Elements/Radio_Buttons) page to place radio buttons within a form.

![Radio Button Widget](http://drupalgap.org/sites/default/files/radio-button-widget.png)

## Render Element

```
var element = {};
element.my_radio_buttons = {
  _theme: 'radios',
  _options: {
    0: dg.t('Rock and Roll'),
    1: dg.t('Metal')
  },
  value: 1
};
return element;
```

## dg.theme('radios', ...)

```
var html = dg.theme('radios', {
  _options: {
    0: dg.t('Rock and Roll'),
    1: dg.t('Metal')
  },
  value: 1
});
return html;
```
