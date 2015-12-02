Also check out the [Buttons on Forms](../Forms/Buttons_on_Forms) page.

## Button

![Button Widget](http://drupalgap.org/sites/default/files/button-widget.png)

Here's an example that creates a simple button. When the button is clicked, it will display a message.

```
var content = {};
content['my_button'] = {
  theme: 'button',
  text: 'My Button',
  attributes: {
    onclick: "drupalgap_alert('You clicked me!');"
  }
};
return content;
```

## Button Link

![Button Link Widgets](http://drupalgap.org/sites/default/files/button-link-widget.png)

Here's an example button link. When the button is clicked, the app will display node 123.

```
var content = {};
content['my_button_link'] = {
  theme: 'button_link',
  text: 'My Button Link',
  path: 'node/123'
};
return content;
```

## Button Icons

With [jQuery Mobile Icons](api.jquerymobile.com/icons/), we can use the `data-icon` attribute to set the icon on buttons.

### Button Link with Icon

![Button Widget with Icon](http://drupalgap.org/sites/default/files/button-widget-with-icon.png)

```
var content = {};
content['my_button_link'] = {
  theme: 'button_link',
  text: 'My Button Link',
  path: 'node/123',
  attributes: {
    'data-icon': 'cloud'
  }
};
return content;
```

### Button Link with Only an Icon, no Text

![Button Widget with no Text](http://drupalgap.org/sites/default/files/button-widget-no-text.png)

```
var content = {};
content['my_button_link'] = {
  theme: 'button_link',
  text: 'My Button Link',
  path: 'node/123',
  attributes: {
    'data-icon': 'cloud',
    'data-iconpos': 'notext'
  }
};
return content;
```