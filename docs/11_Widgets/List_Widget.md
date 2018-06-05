We can create lists within our app. These examples show how to display a static list of items in your app.

Refer to the [Image Lists](../Views/Displaying_a_View/Views_Render_Array/Image_Lists) page for an example of a dynamic list that use remote data set.

## Unordered Lists

![Unordered List](http://drupalgap.org/sites/default/files/unordered-list.png)

```
var content = {};
content['my_item_list'] = {
  _theme: 'item_list',
  _title: 'Colors',
  _items: ['Red', 'Green', 'Blue']
};
return content;
```

### Dynamic list items

Instead of just a plain string, an item in the `_items` array can be `list_item` widget ready:
```
  _items: [
    {
      _text: dg.t('Red'),
      _attributes: {
        class: ['list-group-item']
      }
    },
    /* another item... */
  ]
```
You can use a *render element* instead of just a plain *string* on the `_text` property for even more control.

Or an item in the `_items` array can be any widget for that matter:
```
_items: [
    {
      _theme: 'view',
      _path: 'my-articles', // Path to the View in Drupal
      _format: 'ul',
      _row_callback: function(row) {
        return row.fooBar;
      }
    },
    /* another item... */
  ]
```

## Ordered Lists

Creating an ordered list is very similar to the unordered list example above, except we specify the `type` of list as `ol`, for example:

![Ordered List](http://drupalgap.org/sites/default/files/ordered-list.png)

```
var content = {};
content['my_item_list'] = {
  _theme: 'item_list',
  _type: 'ol',
  _title: 'Instructions',
  _items: ['Stop', 'Drop', 'Roll']
};
return content;
```

## List Title

With the `_h` option we can set the size of the header tag, which defaults to an `<h3></h3>` element:

```
_title: 'Instructions',
_h: 1
```

In the above example, the title will be wrapped in an `<h1></h1`.
