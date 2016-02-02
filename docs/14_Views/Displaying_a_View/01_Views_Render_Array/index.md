By using a render array, we can take advantage of DrupalGap's built in features for Views.

## Formats

We can easily render our view using a few different formats:

- **ul**
- **ol**
- **table**
- **unformatted_list** (*default*)

### Unordered List

Here's an example rendering a view as an unordered list (ul):

```
my_module.routing = function() {
  var routes = {};

  // My example page route.
  routes["my_module.articles"] = {
    "path": "/articles",
    "defaults": {
      "_title": "Articles",
      "_controller": function() {
        return new Promise(function(ok, err) {
        
          var element = {};
          element['article_list'] = {
            _theme: 'view',
            _path: 'my-articles', // Path to the View in Drupal
            _format: 'ul',
            _row_callback: function(row) {
              var node = dg.Node(row);
              return dg.l(node.getTitle(), 'node/' + node.id());
            }
          };
          ok(element);

        });
      }
    }
  };

  // Returns the routes.
  return routes;
};
```

Now if we were to navigate to the **articles** page in our app, we would see our view rendered as an unordered list, with a pager (if there are enough articles for multiple pages).

### Ordered List

To render an ordered list, change the format to ol, for example:

`_format: 'ol',`

### Table

To render a table, change the format to table, and add some `format_attributes` (optional), for example:

```
_format: 'table',
_format_attributes: {
  border: 1,
  'cellpadding': 10,
  'cellspacing': 10,
},
```

Note, when using the table format, in your `_row_callback` function, be sure to wrap each column of your row in table data elements, for example:

```
var html =
  '<td>' + node.id() + '</td>' +
  '<td>' + dg.l(node.getTitle(), 'node/' + node.id()) + '</td>';
return html;
```

## No Results

...

## Row Position

...