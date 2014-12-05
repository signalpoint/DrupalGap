/**
 * When a form submission for an entity is assembling the entity json object to
 * send to the server, some form element fields need to be assembled in unique
 * ways to match the entity's structure in Drupal. Modules that implement fields
 * can use this hook to properly assemble the item value (by delta) and return
 * it.
 * @param {Object} entity_type
 * @param {String} bundle
 * @param {String} form_state_value
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Number} delta
 * @param {Object} field_key Set the 'value' string property on this object to
 *                           use a custom property name on the field value.
 *                           Defaults to 'value'.
 *                           Set the 'use_key' boolean property on this object
 *                           to false to not use a key when assembling the
 *                           result into the field. Defaults to true.
 *                           Set the 'use_wrapper' boolean property on this
 *                           object to false to not use the default wrapper
 *                           placed around the result object. Defaults to true.
 *                           Set the 'use_delta' boolean property to false when
 *                           a delta value is not needed. Defaults to true.
 *
 * @return {*}
 */
function hook_assemble_form_state_into_field(entity_type, bundle,
  form_state_value, field, instance, langcode, delta, field_key) {
  try {
    // Listed below are example use cases. Each show how to assemble the result,
    // and what the resulting field object will look like when assembled by the
    // DrupalGap Forms API. We'll use a field machine name of 'field_my_field'
    // in all of the examples.
    
    // Example 1 - Here's a simple example using all the defaults.
    var result = {
      foo: 'bar'
    };
    return result;
    // This in turn gets assembled by the DG FAPI.
    // {
    //   /* ... other entity values and fields ... */
    //   field_my_field: {
    //     und: [
    //       { value: { foo: "bar" } }
    //     ]
    //   }
    // }
    
    // Example 2 - Setting the 'value' property.
    field_key.value = "foo";
    var result = "bar";
    return result;
    // {
    //   /* ... other entity values and fields ... */
    //   field_my_field: {
    //     und: [
    //       { foo: "bar" }
    //     ]
    //   }
    // }
    
    // Example 3 - Setting the 'use_key' to false.
    field_key.use_key = false;
    var result = "bar";
    return result;
    // {
    //   /* ... other entity values and fields ... */
    //   field_my_field: {
    //     und: ["bar"]
    //   }
    // }
    
    // Example 4 - Setting the 'use_delta' to false.
    field_key.use_delta = false;
    var result = "bar";
    return result;
    // {
    //   /* ... other entity values and fields ... */
    //   field_my_field: {
    //     und: ["bar"]
    //   }
    // }
    
    // Example 5 - Setting the 'use_delta' and 'use_wrapper' to false.
    field_key.use_delta = false;
    field_key.use_wrapper = false;
    var result = "bar";
    return result;
    // {
    //   /* ... other entity values and fields ... */
    //   field_my_field: {
    //     und: "bar"
    //   }
    // }
  }
  catch (error) {
    console.log('hook_assemble_form_state_into_field - ' + error);
  }
}

/**
 * When the app is first loading up, DrupalGap checks to see if the device has
 * a connection, if it does then this hook is called. Implementations of this
 * hook need to return true if they'd like DrupalGap to continue, or return
 * false if you'd like DrupalGap to NOT continue. If DrupalGap continues, it
 * will perform a System Connect resource call then go to the App's front page.
 * This is called during DrupalGap's "deviceready" implementation for PhoneGap.
 * Note, the Drupal.user object is not initialized at this point, and always
 * appears to be an anonymous user.
 */
function hook_deviceready() {}

/**
 * Each time a page is navigated to within the app, drupalgap_goto() is called.
 * Use this hook to do some preprocessing before drupalgap_goto() gets started.
 * @param {String} path The current page path.
 */
function hook_drupalgap_goto_preprocess(path) {
  try {
  }
  catch (error) {
    console.log('hook_drupalgap_goto_preprocess - ' + error);
  }
  // Pre process the front page.
  if (path == drupalgap.settings.front) {
    drupalgap_alert('Preprocessing the front page!');
  }
}

/**
 * Each time a page is navigated to within the app, drupalgap_goto() is called.
 * Use this hook to do some post processing after drupalgap_goto() has finished.
 * @param {String} path The current page path.
 */
function hook_drupalgap_goto_post_process(path) {
  try {
    // Post process the front page.
    if (path == drupalgap.settings.front) {
      drupalgap_alert('Post processing the front page!');
    }
  }
  catch (error) {
    console.log('hook_drupalgap_goto_post_process - ' + error);
  }
}

/**
 * Called after a successful services API call to a Drupal site. Do not call
 * any services from within your implementation, you may run into an infinite
 * loop in your code. See http://drupalgap.org/project/force_authentication for
 * example usage.
 * @deprecated - use hook_services_postprocess() instead.
 */
function hook_services_success(url, data) { }

/**
 * A hook used to declare custom block information.
 */
function hook_block_info() {}

/**
 * A hook used to render custom blocks.
 */
function hook_block_view(delta, region) {
}

/**
 * A hook used to handle a 404 in the app.
 */
function hook_404(router_path) {}

/**
 * Called after drupalgap_entity_render_content() assembles the entity.content
 * string. Use this to make modifications to the HTML output of the entity's
 * content before it is displayed.
 */
function hook_entity_post_render_content(entity, entity_type, bundle) {
  try {
    if (entity.type == 'article') {
      entity.content += '<p>Example text on every article!</p>';
    }
  }
  catch (error) {
    console.log('hook_entity_post_render_content - ' + error);
  }
}

/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Object} display
 */
function hook_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    
    // Use this hook to render a field's content on an entity. Use dpm() to
    // inspect the incoming arguments. The arguments contain field display
    // settings from Drupal.
    
    /*dpm(entity_type);
    dpm(entity);
    dpm(field);
    dpm(instance);
    dpm(langcode);
    dpm(items);
    dpm(display);*/
    
    // Iterate over each item, and place a widget onto the render array.
    var content = {};
    $.each(items, function(delta, item) {
        content[delta] = {
          markup: '<p>Hello!</p>'
        };
    });
    return content;
  }
  catch (error) { console.log('hook_field_formatter_view - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function hook_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    // Use this hook to provide field widgets for form element items. This hook
    // is called for each delta value on the field. Make modifications to the
    // items collection using the provided delta value. The object contained
    // within is a standard DrupalGap Forms API object, so you may assemble the
    // field (and any children widgets) as needed.
    
    // Very simple example, make the widget for the field a text field.
    items[delta].type = 'textfield';
  }
  catch (error) { console.log('hook_field_widget_form - ' + error); }
}

/**
 * Called after a form element is assembled. Use it to alter a form element.
 */
//function hook_form_element_alter(form, element, variables) { }

/**
 * Called after drupalgap_entity_render_field() assembles the field content
 * string. Use this to make modifications to the HTML output of the entity's
 * field before it is displayed. The field content will be inside of
 * reference.content, so to make modifications, change reference.content. For
 * more info: http://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language
 */
function hook_entity_post_render_field(entity, field_name, field, reference) {
  if (field_name == 'field_my_image') {
    reference.content += '<h2>' + entity.title + '</h2>';
  }
}

/**
 * This hook is used to make alterations to existing forms.
 */
function hook_form_alter(form, form_state, form_id) {}

/**
 * Called after drupalgap_image_path() assembles the image path. Use this hook
 * to make modifications to the image path. Return the modified path, or false
 * to allow the default path to be generated.
 */
function hook_image_path_alter(src) { }

/**
 * This hook is used by modules that need to execute custom code when the module
 * is loaded. Note, the Drupal.user object is not initialized at this point, and
 * always appears to be an anonymous user.
 */
function hook_install() {}

/**
 * This hook is used to declare menu paths for custom pages.
 */
function hook_menu() {}

function hook_mvc_model() {
  var models = {};
  return models;
}
function hook_mvc_view() {}
function hook_mvc_controller() {}

/**
 * Implements hook_views_exposed_filter().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} element
 * @param {Object} filter
 * @param {Object} field
 */
function hook_views_exposed_filter(form, form_state, element, filter, field) {
  try {
    
    // This hook is used to assemble the form element for an exposed filter.
    // Make modifications to the element JSON object to control how it is used
    // on the form. The element comes prepopulated with some basic values. The
    // majority of the data you need to assemble the field should be contained
    // within the filter and field JSON objects, so use dpm() to insepct them
    // and assemble your filter's element.
    
    //dpm(filter);
    //dpm(field);
    
  }
  catch (error) { console.log('hook_views_exposed_filter - ' + error); }
}

