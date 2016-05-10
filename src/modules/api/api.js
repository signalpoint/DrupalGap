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
 * @param {Object} form
 *
 * @return {*}
 */
function hook_assemble_form_state_into_field(entity_type, bundle,
  form_state_value, field, instance, langcode, delta, field_key, form) {
  try {
    // Listed below are example use cases. Each show how to assemble the result,
    // and what the resulting field object will look like when assembled by the
    // DrupalGap Forms API. We'll use a field machine name of 'field_my_field'
    // in all of the examples.
    
    // Optional helpful values.
    // Grab the form element's name, the form id, and the element's id.
    // var element_name = field_key.name;
    // var form_id = field_key.form_id;
    // var element_id = field_key.element_id;

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
 * When the app is first loading up, DrupalGap checks to see if the device has a connection, if it does then this hook
 * is called. If DrupalGap doesn't have a connection, then hook_device_offline() is called. Implementations of
 * hook_deviceready() need to return true if they'd like DrupalGap to continue, or return false if you'd like DrupalGap
 * to NOT continue. If DrupalGap continues, it will perform a System Connect resource call then go to the App's front
 * page. This is called during DrupalGap's "deviceready" implementation for PhoneGap. Note, the Drupal.user object is
 * not initialized at this point, and will always be an anonymous user.
 */
function hook_deviceready() {}

/**
 * When someone calls drupalgap_has_connection(), this hook has an opportunity to set drupalgap.online to true or false.
 * The value of drupalgap.online is returned to anyone who calls drupalgap_has_connection(), including DrupalGap core.
 */
function hook_device_connection() {

  // If it is Saturday, take the app offline and force the user to go outside and play.
  var d = new Date();
  if (d.getDay() == 6) { drupalgap.online = false; }

}

/**
 * Called during app startup if the device does not have a connection. Note, the Drupal.user object is ot initialized at
 * this point, and will always be an anonymous user.
 */
function hook_device_offline() {

  // Even though we're offline, let's just go to the front page.
  drupalgap_goto('');

}

/**
 * Take action when the user presses the "back" button. This includes the soft,
 * hardware and browser back buttons. The browser back button is only available
 * in web app mode, the hardware back button is typically only on compiled
 * Android devices, whereas the soft back button actually appears within the UX
 * of the app.
 * @param {String} from
 * @param {String} to
 * @see http://docs.drupalgap.org/7/Widgets/Buttons/Back_Button
 */
function hook_drupalgap_back(from, to) {

  // When the user navigates from the front page to the login page, show them
  // a message (a toast).
  if (from == drupalgap.settings.front && to == 'user/login') {
    drupalgap_toast('Please login to continue');
  }

}

/**
 * Each time a page is navigated to within the app, drupalgap_goto() is called.
 * Use this hook to do some preprocessing before drupalgap_goto() gets started.
 * @param {String} path The current page path.
 */
function hook_drupalgap_goto_preprocess(path) {
  try {
    // Pre process the front page.
    if (path == drupalgap.settings.front) {
      drupalgap_alert(t('Preprocessing the front page!'));
    }
  }
  catch (error) {
    console.log('hook_drupalgap_goto_preprocess - ' + error);
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
      drupalgap_alert(t('Post processing the front page!'));
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
 * Implements hook_entity_pre_build_content().
 */
function hook_entity_pre_build_content(entity, entity_type, bundle) {

  // Change some weights on nodes with a date field.
  if (entity_type == 'node' && typeof entity.field_date !== 'undefined') {
    entity.body.weight = 0;
    entity.field_date.weight = 1;
  }
}

/**
 * Implements hook_entity_post_build_content().
 */
function hook_entity_post_build_content(entity, entity_type, bundle) {

}

/**
 * Implements hook_entity_pre_render_content().
 * Called before drupalgap_entity_render_content() assembles the entity.content
 * string. Use this to make modifications to an entity before its' content is rendered.
 */
function hook_entity_pre_render_content(entity, entity_type, bundle) {
  try {

    // Remove access to the date field on all nodes.
    if (entity_type == 'node' && typeof entity.field_date !== 'undefined') {
      entity.field_date.access = false;
    }

  }
  catch (error) {
    console.log('hook_entity_pre_render_content - ' + error);
  }
}

/**
 * Called after drupalgap_entity_render_content() assembles the entity.content
 * string. Use this to make modifications to the HTML output of the entity's
 * content before it is displayed.
 */
function hook_entity_post_render_content(entity, entity_type, bundle) {
  try {
    if (entity.type == 'article') {
      entity.content += '<p>' + t('Example text on every article!') + '</p>';
    }
  }
  catch (error) {
    console.log('hook_entity_post_render_content - ' + error);
  }
}

/**
 * Implements hook_entity_view_alter().
 * Called immediately before a page is rendered and injected into its waiting
 * container. Use this hook to modifications to the build object by adding or
 * editing render arrays (widgets) on the build object.
 */
function hook_entity_view_alter(entity_type, entity_id, mode, build) {
  try {
    if (entity_type == 'user' && mode == 'view') {
      if (entity_id == Drupal.user.uid) {
        build['foo'] = { markup: '<p>Extra stuff when viewing own user profile...</p>' };
        build['volume'] = {
          theme: 'range',
          attributes: {
            min: '0',
            max: '11',
            value: '11',
            'data-theme': 'b'
          }
        };
      }
      else {
        build['bar'] = { markup: '<p>Viewing some other profile...</p>' };
      }
    }
  }
  catch (error) { console.log('hook_entity_view_alter - ' + error); }
}

/**
 * Implements hook_field_info_instance_add_to_form().
 * Used by modules that provide custom fields to operate on a form or its
 * elements before the form gets saved to local storage. This allows extra
 * data be attached to the form that way things like hook_field_widget_form(),
 * which takes place at render time, can have access to any extra data it may
 * need.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} form
 * @param {Object} entity
 * @param {Object} element
 */
function hook_field_info_instance_add_to_form(entity_type, bundle, form, entity, element) {
  try {
    // Attach a value_callback to the element so we can manually build its form
    // state value.
    element.value_callback = 'example_field_value_callback';
  }
  catch (error) { console.log('hook_field_info_instance_add_to_form - ' + error); }
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
    
    //console.log(entity_type);
    //console.log(entity);
    //console.log(field);
    //console.log(instance);
    //console.log(langcode);
    //console.log(items);
    //console.log(display);
    
    // Iterate over each item, and place a widget onto the render array.
    var content = {};
    for (var delta in items) {
        if (!items.hasOwnProperty(delta)) { continue; }
        var item = items[delta];
        content[delta] = {
          markup: '<p>' + t('Hello!') + '</p>'
        };
    }
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
 * Implements hook_entity_post_render_field().
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
 * Implements hook_form_alter().
 * This hook is used to make alterations to existing forms.
 */
function hook_form_alter(form, form_state, form_id) {
  // Change the description of the name element on the user login form
  if (form_id == 'user_login_form') {
    form.elements['name'].description = t('Enter your login name');
  }
}

/**
 * Implements hook_image_path_alter().
 * Called after drupalgap_image_path() assembles the image path. Use this hook
 * to make modifications to the image path. Return the modified path, or false
 * to allow the default path to be generated.
 */
function hook_image_path_alter(src) { }

/**
 * Implements hook_install().
 * This hook is used by modules that need to execute custom code when the module
 * is loaded. Note, the Drupal.user object is not initialized at this point, and
 * always appears to be an anonymous user.
 */
function hook_install() { }

/**
 * Implements hook_locale().
 * Used to declare language code .json files that should be loaded by DrupalGap.
 * @see http://drupalgap.org/translate
 */
function hook_locale() {
  // Tell DrupalGap to load our custom Spanish and Italian language files
  // located here:
  //   app/modules/custom/my_module/locale/es.json
  //   app/modules/custom/my_module/locale/it.json
  return ['es', 'it'];
}

/**
 * Implements hook_menu()
 * This hook is used to declare menu paths for custom pages.
 */
function hook_menu() {
  try {
    var items = {};
    items['hello_world'] = {
      title: t('Hello World'),
      page_callback: 'my_module_hello_world_page'
    };
    return items;
  }
  catch (error) { console.log('hook_menu - ' + error); }
}

function hook_mvc_model() {
  var models = {};
  return models;
}
function hook_mvc_view() {}
function hook_mvc_controller() {}

/**
 * Implements hook_node_page_view_alter_TYPE().
 * @param {Object} node The fully loaded node object.
 * @param {Object} options The options object, containing the success callback.
 */
function hook_node_page_view_alter_TYPE(node, options) {
  try {

    // Use this hook to completely take over the content that is shown when a
    // user views a certain content type's page within the app. Pass your
    // content (render array or html string) to the sucess callback provided in
    // options to have it automatically injected in the page.

    var content = {};
    content['my_markup'] = {
      markup: '<p>'+t('Click below to see the node!')+'</p>'
    };
    content['my_collapsible'] = {
      theme: 'collapsible',
      header: node.title,
      content: node.content
    };
    options.success(content);

  }
  catch (error) { console.log('hook_node_page_view_alter_TYPE() - ' + error); }
}

/**
 * Implements hook_page_build().
 * @param {Object} output The page build output object.
 */
function hook_page_build(output) {
  try {
    // Remove all titles from article node pages.
    if (output.node && output.node.type == 'article') {
      delete output.title;
    }
  }
  catch (error) { console.log('hook_page_build - ' + error); }
}

/**
 * Implements hook_preprocess_page().
 * Take action before the page is processed and shown to the user.
 * @param {Object} variables The page variables.
 */
function hook_preprocess_page(variables) {
  try {

  }
  catch (error) {
    console.log('hook_preprocess_page - ' + error);
  }
}

/**
 * Implements hook_post_process_page().
 * Take action after the page is processed and shown to the user.
 * @param {Object} variables The page variables.
 */
function hook_post_process_page(variables) {
  try {

  }
  catch (error) {
    console.log('hook_post_process_page - ' + error);
  }
}

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
