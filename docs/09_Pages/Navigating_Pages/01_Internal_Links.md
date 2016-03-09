Typically, we want links in our mobile app to go to another page within our mobile application. Here are ways of creating internal links to display a node:

## Using the l() and bl() Functions

The l() function is shorthand for "link". The bl() function is shorthand for "button link".

### Text Link

![Text Link](http://drupalgap.org/sites/default/files/link.png)

`var link = l('My Node Link', 'node/123');`

### Button Link

![](http://drupalgap.org/sites/default/files/button-link.png)

`var button_link = bl('My Button Link', 'node/456');`

The new way and old way produce equivalent HTML output, the new way is easier to write.

## Using a Render Array

```
var content = {};
content['my_link'] = {
  theme: 'link',
  text: 'My Node Link',
  path: 'node/123'
};
return content;
```

You can use either `link` or `button_link` for the theme.

### Plain HTML Link

`<a onclick="javascript:drupalgap_goto('node/123');">My Node Link</a>`

## Theme A Button Link Manually

- [Button Widget Docs](../../Widgets/Buttons) (*easy to create button links*)

Buttons can be themed manually by adding a class attribute to a link:

```
content['my_link'] = {
  theme: 'link',
  text: 'My Node Link',
  path: 'node/123',
  attributes: {
    'class': 'fancycolor'
  }
};
```

```
content = bl('My Node Link', 'node/123', {
  attributes: {
    'class': 'fancycolor'
  }
});
```

Add the following CSS to drupalgap.css file.

```
a:link.fancycolor.ui-link.ui-btn.ui-shadow.ui-corner-all {
  background-color: #d5b448;
  text-shadow: none;
  color: #fff;
  border-color: #fff;
}

a:hover.fancycolor.ui-link.ui-btn.ui-shadow.ui-corner-all {
  background-color: #eece62;
  text-shadow: none;
  color: #fff;
  border-color: #fff;
}
```
