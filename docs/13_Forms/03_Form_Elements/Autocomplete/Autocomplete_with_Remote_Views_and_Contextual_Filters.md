This article covers both the general concept of using Autocomplete to access Views that have contextual filters, as well as the more advanced strategy of specifically targeting views that ALSO use SearchAPI's entity indexing capabilities.

If all you are trying to do is use the contextual filters, you can substitute a standard contextual filter for the more advanced Fulltext filter.

Using Views Search with SearchAPI's indexing is a powerful way to access entities via autocomplete quickly and with a high level of customization.

Here is an example of an autocomplete module that utilizes this feature. In this case, we're targeting the User entity.

To do this, you'll need to have a ![viable SearchAPI index set up for the target entity](https://www.drupal.org/node/1251376).

The view that we use for this example was set up much in the same way, except that we used a SearchAPI user index configured as follows:

 - path is 'drupalgap/views_datasource/drupalgap_users/%'
 - Format: JSON data document (settings are default provided)
 - contextual filter settings:
   - Search: Fulltext search filter
   - Provide default argument; raw value from URL (1)
   - Specify validation criteria (basic validation, hide/404 if not found)
   - Searched fields: Extension, Firstname, Lastname, Name (the first 3 are custom fields we added, the last one is the default Drupal username)
   - Operator: contains all these words
 - Fields (all indexed user fields):
   - Firstname
   - Lastname
   - name
   - extention

Next, you'll need to ![set up a view that specifically utilizes the entity index](https://www.drupal.org/node/1597930).

Here's our custom autocomplete module example:

```
/**
 * Implements hook_menu().
 */
function my_autocomplete_menu() {
  var items = {};
  items['my_autocomplete'] = {
    title: 'Autocomplete',
    page_callback: 'my_autocomplete_page'
  };
  return items;
}

/**
 * Page callback for autocomplete input.
 */
function my_autocomplete_page() {
  try {
    var content = {};
    content.my_autocomplete = {
      theme: 'autocomplete',
      item_onclick: 'my_autocomplete_item_onclick',
      remote: true,
      // basic path - while your view might be 'drupalgap/views_datasource/drupalgap_users/%', don't put the % here.
      path: 'drupalgap/views_datasource/drupalgap_users',
      // you need to specify the value, label and filter as zero-length strings, or things will break.
      value: '',
      label: '',
      filter: '',
      // you don't need these two settings here commented out, just don't use them at all.
      // custom: 'false',
      // handler: 'views'
      
      /* what we added to make contextual filters work */
      custom_theme: true,
      // if none are specified or "custom_theme" is not set to true, default is array( 'value', 'label' ). must be in order.
      theme_fields: [
        'name',
        'field_firstname',
        'field_lastname',
        'field_direct_office_phone',
        'uid'
      ],
      // this is your themable output string. this is what will show up in the result list. Note that you need to wrap your fieldnames in double curly braces.
      theme_map: l('{{field_firstname}} {{field_lastname}} ({{name}}): #{{field_direct_office_phone}}', 'user/{{uid}}'),
			// default behavior for filter_type is 'exposed', but the code won't look for 'exposed' necessarily
      filter_type: 'contextual',
      // if for some reason your view requires a specific URL structure (like, ~/search/users/%), you can describe this specifically in contextual_arg_structure.
      // for example: ['search','users','%'];
      contextual_arg_structure: ['%']
    };
   return content;
  }
  catch (error) { console.log('my_autocomplete_page - ' + error); }
}

function my_autocomplete_item_onclick(id, item) {
  console.log('List id: ' + id);
  drupalgap_alert("This will send to user path with ID of: " + $(item).attr('value'));
}
```

Note that even if your Drupal view contains more fields to display on result, the fields won't display in the Drupalgap result page unless you include them specifically in theme_fields and theme_map (though you can see them).

Likewise, here's some more complicated behavior you might not expect. Let's say you have another field specified, say "field_building". Let's say the building name is "Metropolis".

If you don't have "field_building" called out in theme_fields and theme_map and you type "metr" into the autocomplete field:

 - you will be able to see objects that return as expected via console.log()
 - you will not see those same objects listed in the result set UNLESS they happen to have "metr" in their other fields that are called out in theme_fields and theme_map
 - you're not crazy if this happens, you just need to add them to theme_fields and theme_map
 - if you don't want to actually SEE the Building field displayed but you still want the corresponding results to display, you can just use CSS and HTML to hide it, for example:
 
```
	theme_map: l('{{field_firstname}} {{field_lastname}} ({{name}}): #{{field_direct_office_phone}} <span class="hidden">field_building</span>', 'user/{{uid}}'),
``` 

Authored by ![mausolos](https://www.drupal.org/u/mausolos)
