We can create Headers by utilizing the [jQuery Mobile Toolbar widget](http://api.jquerymobile.com/toolbar/).

![Header Widget](http://drupalgap.org/sites/default/files/header-widget.png)

### Widget
```
var content = {};
content['my_header'] = {
  theme: 'header',
  text: 'Header Text',
  attributes: {
    id: 'foo'
  },
  type: 'h3',
  type_attributes: {
    class: 'my-css-class'
  }
};
return content;
```

### theme('header')
```
var html = theme('header', {
  text: 'Header Text',
  attributes: {
    id: 'foo'
  },
  type: 'h3',
  type_attributes: {
    class: 'my-css-class'
  }
});
```
