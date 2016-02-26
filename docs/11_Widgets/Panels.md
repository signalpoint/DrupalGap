Not to be confused with the Drupal [Panels module](https://drupal.org/project/panels), instead a [jQuery Mobile Panel](http://demos.jquerymobile.com/1.4.5/panel/) allows us to add some great UX features to our apps.

![jQuery Mobile External Panel](http://drupalgap.org/sites/default/files/external-panel.png)

## Panels across pages

- [DrupalGap Slide menus](../Menus/Slide_Menus)

## Re-use single panel

If you want to use the same panel on multiple pages you can place the markup outside the page. This can be accomplished using [jQuery Mobile External Panels](http://demos.jquerymobile.com/1.4.5/panel-external/).

The following example shows how to have a single form rendered in the DOM, and have it be available as a panel on every page (this is a great feature for keeping the DOM slim).

Here's the game plan:

1. Create a [pageshow handler](../Pages/Page_Events) to init the panel (typically done on our app's front page)
2. Use a [setTimeout](http://www.w3schools.com/jsref/met_win_settimeout.asp) to let the page finish displaying
3. Render our [custom form](../Forms/Creating_a_Custom_Form) into an html string for the panel content
4. Prepend (or append) the html onto the DOM body
5. Init the panel
6. Apply jQM styles to the form
7. Add a button to open the panel

And here's the code:

```
/**
 *
 */
function my_module_pageshow() {
  try {

    // We wrap in a timeout so the page has some time to render before we
    // add our panel, otherwise the user may not enjoy the UX.
    setTimeout(function() {

      // Add a panel outside of the page template, only once.
      var id = 'my_module_left_panel';
      var panel = $('#' + id);
      if ($(panel).length != 0) { return; }

      // Build the panel attributes and render it into an html string.
      var attrs = {
        id: id,
        'data-role': 'panel',
        'data-position': 'left', // left or right
        'data-display': 'overlay', // overlay, reveal or push,
        'data-theme': 'b'
      };
      var html = '<div ' + drupalgap_attributes(attrs) + '>' +
        drupalgap_get_form('my_module_custom_form') +
        '</div>';

      // Prepend the html on the body, re-select and initialize the new panel
      // and then trigger the creation of jQM styles on the form.
      $('body').prepend(html);
      $('#' + id).panel();
      $('#my_module_custom_form').trigger('create');

    }, 500);
  }
  catch (error) { console.log('my_module_pageshow - ' + error); }
}

/**
 * Form builder.
 */
function my_module_custom_form(form, form_state) {
  try {

    // Radio stations.
    form.elements['radio_station'] = {
      title: 'Radio station',
      type: 'radios',
      options: {
        rock: t('Rock'),
        metal: t('Metal')
      },
      default_value: 'rock'
    };

    // Submit button.
    form.elements['submit'] = {
      type: 'submit',
      value: t('Listen')
    };

    // Cancel button (closes the panel).
    form.buttons['cancel'] = {
      title: t('Cancel'),
      attributes: {
        'data-rel': 'close'
      }
    };

    // Return the assembled form.
    return form;
  }
  catch (error) { console.log('my_module_custom_form - ' + error); }
}

/**
 * Define the form's submit function.
 */
function my_module_custom_form_submit(form, form_state) {
  try {
    $('#my_module_left_panel').panel('close'); // Close the panel.

    // Do some work...
  }
  catch (error) { console.log('my_module_custom_form_submit - ' + error); }
}
```

Now this single form can be used across the entire app, and only appear in the DOM once! Great for performance, and easy to maintain.

### Opening the panel with a button

All we need to open the panel is a simple button:

```
var html = bl('Open panel', '#my_module_left_panel', {
  attributes: {
    'data-icon': 'bars',
    'data-iconpos': 'notext',
    'class': 'ui-btn-left'
  }
});
```

This button can go anywhere we like: on a page, in a menu, in a block, etc. We recommend using the **block button** approach mentioned in the [Slide menus tutorial](../Menus/Slide_Menus).

#### Open Panel Button with Control Group

![Panel Button in Control Group](http://drupalgap.org/sites/default/files/panel-button-control-group.png)

It's common to want a home button next to the slide menu button when you're not on the app's front page. We can make a simple control group for our block content (`hook_block_view()`) to handle this:

```
var button_text = 'Open panel';
var button_link = '#my_moduleleft_panel';
var button_options = {
  attributes: {
    'data-icon': 'bars',
    'data-iconpos': 'notext',
    'class': 'ui-btn-left'
  }
};

// If we're not on the home page, wrap the button in a control group
// and add the home button in the control group.
if (!drupalgap_is_front_page()) {
  delete button_options.attributes.class;
  var attrs = {
    'data-type': 'horizontal',
    'data-role': 'controlgroup',
    'class': 'ui-btn-left'
  };
  content = '<div ' + drupalgap_attributes(attrs) + '>' +
        bl(button_text, button_link, button_options) +
        bl('Home', '', { attributes: { 'data-icon': 'home', 'data-iconpos': 'notext'} }) +
  '</div>';
}
else { content = bl(button_text, button_link, button_options); }
```