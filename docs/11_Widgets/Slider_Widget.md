We can create a range slider by utilizing the [jQuery Mobile Slider](http://api.jquerymobile.com/slider/) widget.

![Slider Widget](http://drupalgap.org/sites/default/files/slider.png)

```
var content = {};
content['my_slider'] = {
  theme: 'range',
  attributes: {
    min: '-100',
    max: '100',
    value: '0',
    'data-theme': 'b'
  }
};
return content;
```