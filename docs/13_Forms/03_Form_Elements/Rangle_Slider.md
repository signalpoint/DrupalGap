Also, check out the [Slider Widget](../../Widgets/Slider_Widget) page for other techniques.

![Range Slider Widget](http://drupalgap.org/sites/default/files/slider-volume.png)

```
form.elements['volume'] = {
  type: 'range',
  title: 'Volume',
  attributes: {
    'min': '0',
    'max': '11',
    'value': '11',
    'data-theme': 'b'
  }
};
```