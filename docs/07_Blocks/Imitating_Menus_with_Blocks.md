

Although not technically a [menu](../Menus), *blocks* can be used to create what appear to be menus for your users. As it stands, blocks are much more flexible than menus and can be used to create some very interesting UX widgets.

![A Menu built with a Block](http://drupalgap.org/sites/default/files/block-menu-widget.png)

Here's an example that places two links at the top right of the header, both with dynamic paths.

This snippet contains the *block content only*:

```
var attrs = {
  'data-role': 'controlgroup',
  'data-type': 'horizontal',
  'class': 'ui-btn-right'
};
var uid = Drupal.user.uid;
var content = '<div ' + drupalgap_attributes(attrs) + '>' +
  bl('Button 1', 'my_page/' + uid, {
      attributes: {
        'data-icon': 'action',
        'data-iconpos': 'notext'
      },
      transition: 'slide'
  }) +
  bl('Button 2', 'my_other_page/' + uid, {
      attributes: {
        'data-icon': 'gear',
        'data-iconpos': 'notext'
      },
      transition: 'slide'
  }) +
'</div>';
```

See also [menus with dynamic links](../Menus/Menus_with_Dynamic_Links).
