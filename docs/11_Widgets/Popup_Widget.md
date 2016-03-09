We can create [jQuery Mobile Popup](https://api.jquerymobile.com/popup/) widgets in our app. Essentially, we place down a button that when clicked, opens up a popup window.

Also, check out the [Popup Menu (Drop Down Menu)](../Menus/Popup_Menu_Drop_Down_Menu) page for more advanced usage.

![Popup Widget Button](http://drupalgap.org/sites/default/files/popup-widget-button.png)

Now if we were to click the button, a popup like this would appear:

![Popup Widget](http://drupalgap.org/sites/default/files/popup-widget.png)

```
var content = {};
content['my_popup'] = {
  theme: 'popup',
  button_text: 'Open Popup',
  content: '<p>What do you think about soda pop? Deliciously vicious.</p>',
  attributes: {
    id: drupalgap_get_page_id() + '_my_popup'
  }
};
return content;
```

Notice how we prepend the page id onto the popup id? This guarantees our popup's id won't collide with any other pages. Here's the equivalent code if you'd like to call the `theme()` function instead:

```
var html = theme('popup', {
    button_text: 'Open Popup',
    content: '<p>...</p>',
    attributes: {
      id: drupalgap_get_page_id() + '_my_popup'
    }
});
```

## Popup Button Attributes

We can attach custom attributes to the popup button:

![Popup Widget Button Icon](http://drupalgap.org/sites/default/files/popup-widget-button-attributes.png)

```
var content = {};
content['my_popup'] = {
  theme: 'popup',
  button_text: 'Open Popup',
  button_attributes: {
    'data-icon': 'gear',
    'data-mini': 'true'
  },
  content: '<p>What do you think about soda pop? Deliciously vicious.</p>',
  attributes: {
    id: drupalgap_get_page_id() + '_my_popup'
  }
};
return content;
```

## Close Button

Try placing this at the beginning of your popup's content to add a close button:

```
bl('Close', null, {
    attributes: {
      'class': 'ui-btn-right',
      'data-icon': 'delete',
      'data-iconpos': 'notext',
      'data-rel': 'back',
      'data-inset': 'true'
    }
})
```