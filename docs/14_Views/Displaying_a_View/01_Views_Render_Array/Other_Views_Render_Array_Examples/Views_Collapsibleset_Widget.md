Visit the [Collapsibleset Widget](../../../Widgets/Collapsibleset_Widget) page for more information.

For example, say we had a View returning JSON like this to us:

![Collapsibleset Widget Expanded](http://drupalgap.org/sites/default/files/collapsible-set-one-expanded.png)

```
{
    "nodes": [
        {
            "node": {
                "photo": "http://localhost/drupal-7/sites/default/files/styles/thumbnail/public/bells-oberon-12.jpg",
                "title": "Bells Oberon",
                "nid": "1"
            }
        },
        {
            "node": {
                "photo": "http://localhost/drupal-7/sites/default/files/styles/thumbnail/public/soft-parade-1.jpg",
                "title": "Shorts Brew Soft Parade",
                "nid": "2"
            }
        },
        {
            "node": {
                "photo": "http://localhost/drupal-7/sites/default/files/styles/thumbnail/public/sierranevada_torpedoextraipa12oz.jpg",
                "title": "Sierra Nevada Torpedo Extra IPA",
                "nid": "3"
            }
        }
    ],
    "view": {
        "name": "beers",
        "display": "page_1",
        "path": "beers.json",
        "root": "nodes",
        "child": "node",
        "pages": 1,
        "page": 0,
        "count": 3,
        "limit": 10
    }
}
```

We could then create a page in our app, to display the list of beer as a collapsible set:

Here's the code that makes it possible:

![Collapsibleset_Widget_Collapsed](http://drupalgap.org/sites/default/files/beer-list-collapsed.png)

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {};
    items['beer-list'] = {
      title: 'Beer List',
      page_callback: 'my_module_beer_list_page'
    };
    return items;
  }
  catch (error) {
    console.log('my_module_menu - ' + error);
  }
}

function my_module_beer_list_page() {
  try {
    var content = {};
    content['my_beer_list'] = {
      theme: 'view',
      path: 'beers.json',
      row_callback: 'my_module_beer_list_page_row',
      empty_callback: 'my_module_beer_list_page_empty',
      attributes: {
        'data-role': 'collapsible-set'
      }
    };
    return content;
  }
  catch (error) { console.log('my_module_beer_list_page - ' + error); }
}

function my_module_beer_list_page_row(view, row) {
  try {
    var attributes = {
      'data-role': 'collapsible'
    };
    var html = '<div ' + drupalgap_attributes(attributes) + '>' +
      '<h2>' + row.title + '</h2>' +
      '<p>' + theme('image', { path: row.photo }) + '</p>' +
    '</div>';
    return html;
  }
  catch (error) { console.log('my_module_beer_list_page_row - ' + error); }
}

function my_module_beer_list_page_empty(view) {
  try {
    return "Sorry, we are out of beer.";
  }
  catch (error) { console.log('my_module_beer_list_page_empty - ' + error); }
}
```

Now if we were to click on a beer, it would be expanded:

![Collapsibleset Widget Expanded](http://drupalgap.org/sites/default/files/collapsible-set-one-expanded.png)

## Expanded Rows

By default, the collapsible set row items will be collapsed. Use the following attribute when rendering an individual row to have that row be expanded:

`'data-collapsed': 'false'`