[Region menu links](../Region_Menu_Links) and slider menu buttons do not play well together. You can only use one or the other.

Here is the issue: [https://github.com/signalpoint/DrupalGap/issues/457](https://github.com/signalpoint/DrupalGap/issues/457)

To get around this, you need to remove the region menu link from the `settings.js` file, and place the equivalent button link into the block (the block that shows the button, which when clicked opens the slide menu) next to the slide menu link, and wrap them both in a control group:

```
var wrapper_attrs = {
  'data-role': 'controlgroup',
  'class': 'ui-btn-left'
};
var container_attrs = {
  'data-role': 'ui-controlgroup ui-controlgroup-controls'
};
content =
  '<div ' + drupalgap_attributes(wrapper_attrs) + '>' +
    '<div ' + drupalgap_attributes(container_attrs) + '>' +
      bl('Open panel', '#' + drupalgap_panel_id('thesafarico_menu_left'), {
          attributes: {
            'data-icon': 'bars',
            'data-iconpos': 'notext'
          }
      });
if (!drupalgap_is_front_page()) {
  content += bl('Back', null, {
      attributes: {
        'data-icon': 'back',
        'data-iconpos': 'notext',
        'onclick': 'javascript:drupalgap_back();'
      }
  });
}
content +=
  '</div>' +
'</div>';
```