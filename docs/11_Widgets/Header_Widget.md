We can create Headers by utilizing the [jQuery Mobile Toolbar widget](http://api.jquerymobile.com/toolbar/).

![Header Widget](http://drupalgap.org/sites/default/files/header-widget.png)

```
var content = {};
content['my_header'] = {
  theme: 'header',
  text: 'Header Text'
};
return content;
```