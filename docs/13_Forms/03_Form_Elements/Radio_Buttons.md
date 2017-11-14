Also, check out the [Radio Button Widget](../../Widgets/Radio_Button_Widget) page for other techniques.

![Radio Button Widget](http://www.drupalgap.com/sites/default/files/radio-button-widget.png)

```
form.elements.my_radio_buttons = {
  _title: dg.t('Radio Station'),
  _type: 'radios',
  _options: {
    0: dg.t('Rock and Roll'),
    1: dg.t('Metal')
  },
  _default_value: 1
};
```
