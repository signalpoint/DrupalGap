The autocomplete feature is handled with [jQuery Mobile Autocomplete](http://demos.jquerymobile.com/1.4.2/listview-autocomplete/). Also check out the [Search filter](../../Views/Displaying_a_View/Views_Render_Array/Search_Filter) page for a related topic.

![Autocomplete in action](http://drupalgap.org/sites/default/files/autocomplete.png)

In this example we have a list of fruit that we would like an auto complete on. If we begin typing "Ap" it will show any fruits that match with that text. If we were to click on "Apples", it would automatically be placed in the text field, and the results would be hidden.

![Autocomplete after selection](http://drupalgap.org/sites/default/files/autcomplete-value.png)

Here is how we can accomplish this using a local data set.

## Local Data

See the Remote Data Example for external data sources and Autocomplete.

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  var items = {};
  items['my_autocomplete'] = {
    title: 'Autocomplete',
    page_callback: 'my_module_autocomplete_page'
  };
  return items;
}

/**
 *
 */
function my_module_autocomplete_page() {
  try {
    var content = {};
    var fruits = ['Apples', 'Apricots', 'Avacados', 'Bananas', 'Blueberries'];
    content['my_autocomplete'] = {
      theme: 'autocomplete',
      items: fruits,
      attributes: {
        id: 'my_autocomplete_input'
      }
    };
    return content;
  }
  catch (error) { console.log('my_module_autocomplete_page - ' + error); }
}
```

### Setting the Value and Label

To use the same value and label, use an array of strings:

```
var fruits = ['Apples', 'Apricots', 'Avacados', 'Bananas', 'Blueberries'];
```

To use a different value than the label, use an array of objects with the following properties:

```
var fruits = [
  {
    value: 'apples',
    label: 'Apples'
  },
  {
    value: 'apricots',
    label: 'Apricots'
  },
  {
    value: 'avacados',
    label: 'Avacados'
  },
  {
    value: 'bananas',
    label: 'Bananas'
  },
  {
    value: 'blueberries',
    label: 'Blueberries'
  }
];
```

## Accessing the Input Values

The Autocomplete uses a hidden input to hold onto the value, that way the label can be shown in the text field.

From our example above, to access the value of the hidden input, you can use this JS snippet:

`$('#my_autocomplete_input').val();`

To access the value (label) that is in the text field, use this JS global variable and jQuery snippet:

`$(_theme_autocomplete_input_selector).val();`

## Handling Clicks on Items

When an item is clicked in the autocomplete result list, you may want to act on that click. Just provide a function name when declaring your autocomplete object, for example:

```
function my_module_autocomplete_page() {
  var content = {};
  content['my_autocomplete'] = {
    theme: 'autocomplete',
    item_onclick: 'my_autocomplete_item_onclick',
    /** other properties **/
  };
  return content;
}

function my_autocomplete_item_onclick(id, item) {
  console.log('List id: ' + id);
  drupalgap_alert("Clicked on item with value: " + $(item).attr('value'));
}
```

## Handling Finished Results

Sometimes we will want to react to the moment after the results (zero or more) are displayed to the user, and can do so with the finish_callback handler:

```
content['my_autocomplete'] = {
  /* ... other properties ... */
  finish_callback: 'my_module_autocomplete_finish_callback'
};
```

Then declare the matching function in our module:

```
function my_module_autocomplete_finish_callback(value) {
  alert('We are done displaying results, if any, for: ' + value);
}
```

## Handling Empty Results

Sometimes the user will enter text that doesn't find any matches. We may want to handle this situation, and can do so with the empty_callback handler:

```
content['my_autocomplete'] = {
  /* ... other properties ... */
  empty_callback: 'my_module_autocomplete_empty_callback'
};
```

Then declare the matching function in our module:

```
function my_module_autocomplete_empty_callback(value) {
  alert('Sorry, ' + value + ' was not found!');
}
```