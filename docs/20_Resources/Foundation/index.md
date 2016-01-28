## DrupalGap Foundation Themes
 - frank

To use DrupalGap Foundation Themes, be sure to install the [foundation module for DrupalGap](http://drupalgap.org/project/foundation).

### Templates

- http://foundation.zurb.com/templates.html

### Menus

When creating a custom menu, add the `menu` Foundation classes to the menu:

```
content['my_main_menu'] = {
  _theme: 'item_list',
  _attributes: {
    'class': ['menu']
  },
  _items: [
    dg.l('hello', 'hello-world'),
    dg.l('goodbye', 'goodbye-world')
  ]
};
```
