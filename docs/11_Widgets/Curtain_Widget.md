With a `curtain` widget, you can easily place a `+/-` button that toggles the visibility of some content. Similar to an expandable/collapsible widget, the `curtain` is a handy widget:

```
var html = dg.theme('curtain', {

  // Handle opening the curtain.
  _open: {
  
    // The button to open the curtain.
    button: {
      _text: '<i class="fa fa-plus"></i>',
      _type: 'link',
      _attributes: {
        title: dg.t('Add content')
      }
    },
    
    // Do something before opening the curtain.
    before: function() { /** do stuff **/ },
    
    // Do something after opening the curtain.
    after: function() { /** do stuff **/ }
  },
  
  // The content to fill into the curtain when it is opened.
  _fill: function() {
    var element = {};
    element.foo = {
      _theme: 'item_list',
      _items: [123, 456]
    };
    return element;
  },
  
  // Handle closing the curtain.
  _close: {
  
    // The button to close the curtain.
    button: {
      _text: '<i class="fa fa-chevron-down"></i>',
      _type: 'link',
      _attributes: {
        title: dg.t('Minimize')
      }
    },
    
    // Do something before closing the curtain.
    before: function() { /** do stuff **/ },
    
    // Do something after closing the curtain.
    after: function() { /** do stuff **/ }
  },
  
  // The wrapper around the button.
  _button_wrapper: {
    _format: 'div',
    _attributes: {
      class: ['foo', 'bar']
    }
  }
  
});
return html;
```

Like all widgets, a `curtain` can easily be ran through the DrupalGap render element system as well:

```
var element = {};
element.foo = {
  _theme: 'curtain',
  _open: /* ... */,
  _fill: /* ... */,
  _close: /* ... */,
  _button_wrapper: /* ... */
};
return element;
```
