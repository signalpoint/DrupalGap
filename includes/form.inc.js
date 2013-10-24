/**
 *
 */
function _drupalgap_form_add_another_item(form_id, name, delta) {
  try {
    // Locate the last item, load the form, extract the element from
    // the form, generate default variables for the new item, determine the next
    // delta value.
    var selector = '.' + drupalgap_form_get_element_container_class(name) + ' .drupalgap_form_add_another_item';
    var add_another_item_button = $(selector); 
    var form = drupalgap_form_local_storage_load(form_id);
    var language = drupalgap.settings.language;
    var item = drupalgap_form_element_item_create(name, form, language, delta+1);
    form.elements[name][language][delta+1] = item;
    var element = form.elements[name];
    var variables = {
      attributes:{},
      field_info_field:element.field_info_field,
      field_info_instance:element.field_info_instance
    };
    var field_widget_form_function = element.field_info_instance.widget.module + '_field_widget_form'; 
    window[field_widget_form_function].apply(null, _drupalgap_form_element_items_widget_arguments(form, null, element, language, delta+1));
    drupalgap_form_local_storage_save(form);
    $(add_another_item_button).before(_drupalgap_form_render_element_item(form, element, variables, item));
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Returns a 'Cancel' button object that can be used on most forms.
 */
function drupalgap_form_cancel_button() {
  try {
    return {
      'title':'Cancel',
      attributes:{
        onclick:"javascript:drupalgap_back();"
      }
    };
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form id, this will assemble and return the default form JSON object.
 */
function drupalgap_form_defaults(form_id) {
  var form = {};
  // Set the form id, elements and buttons.
  form.id = form_id;
  form.elements = {};
  form.buttons = {};
  // Create empty arrays for the form's validation and submission handlers, then
  // add the default call back functions to their respective array, if they
  // exist.
  form.validate = [];
  form.submit = [];
  var validate_function_name = form.id + '_validate';
  if (drupalgap_function_exists(validate_function_name)) {
    form.validate.push(validate_function_name);
  }
  var submit_function_name = form.id + '_submit';
  if (drupalgap_function_exists(submit_function_name)) {
    form.submit.push(submit_function_name);
  }
  // Finally, return the form.
  return form;
}

/**
 * Given a form element, this will return true if access to the element is
 * permitted, false otherwise.
 */
function drupalgap_form_element_access(element) {
  try {
    var access = true;
    if (element.access == false) { access = false; }
    return access;
  }
  catch (error) { drupalgap_error(); }
}

/**
 * Given a form element type, this will return the name of the module that
 * implements the hook_field_widget_form() for the element. Keep in mind for now
 * some of the module names don't exist, and are actually implemented inside
 * the field module. If no module is found, it returns false.
 */
function drupalgap_form_element_get_module_name(type) {
  try {
    var module = false;
    switch (type) {
      case 'checkbox':
      case 'radios':
      case 'select':
        module = 'options';
        break;
      case 'image':
        module = 'image';
        break;
    }
    return module;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form element name and the form_id, this generates an html id
 * attribute value to be used in the DOM. An optional third argument is a
 * string language code to use. An optional fourth argument is an integer delta
 * value to use on field elements.
 */
function drupalgap_form_get_element_id(name, form_id) {
  try {
    if (name == null || name == '') { return ''; }
    var id =
      'edit-' +
      form_id.toLowerCase().replace(/_/g, '-') + '-' +
      name.toLowerCase().replace(/_/g,'-');
    // Any language code to append to the id?
    if (arguments[2]) { id += '-' + arguments[2]; }
    // Any delta value to append to the id?
    if (typeof arguments[3] !== 'undefined') { id += '-' + arguments[3] + '-value'; }
    return id;
  }
  catch (error) {
    alert('drupalgap_form_get_element_id - ' + error);
  }
}

/**
 *
 */
function drupalgap_form_get_element_container_class(name) {
  try {
    return 'field-name-' + name.replace(/_/g, '-');
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a drupalgap form, this renders the form html and returns it.
 */
// TODO - we may possibly colliding html element ids!!! For example, I think the
// node edit page gets an id of "node_edit" and possibly so does the node
// edit form, which also may get an id of "node_edit". We may want to prefix
// both the template page and form ids with prefixes, e.g. drupalgap_page_*
// and drupalgap_form_*, but adding these prefixes could get annoying for
// css selectors used in jQuery and CSS. What to do?
function drupalgap_form_render(form) {
  try {
    // If no form id is provided, warn the user.
    if (!form.id) {
      return '<p>drupalgap_form_render() - missing form id!</p>' + JSON.stringify(form);
    }
    // If the form already exists in the DOM, remove it.
    if ($('form#' + form.id).length) { $('form#' + form.id).remove(); }
    // Render the form's input elements.
    var form_elements = _drupalgap_form_render_elements(form);
    // Return the form html.
    var form_html =
    '<form id="' + form.id + '"><div><div id="drupalgap_form_errors"></div>' +
      form_elements +
    '</div></form>';
    return form_html;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form element name and an error message, this attaches the error
 * message to the drupalgap.form_errors array, keyed by the form element name.
 */
function drupalgap_form_set_error(name, message) {
  try {
    drupalgap.form_errors[name] = message;
  }
  catch (error) {
    alert('drupalgap_form_set_error - ' + error);
  }
}

/**
 * Given a form, this function iterates over the form's elements and assembles
 * each element and value and places them into the form state's values. This
 * is similar to $form_state['values'] in Drupal.
 */
function drupalgap_form_state_values_assemble(form) {
  try {
    var form_state = {'values':{}};
    $.each(form.elements, function(name, element) {
      if (name == 'submit') { return; } // Always skip the form 'submit'.
      var id = null;
      if (element.is_field) {
        form_state.values[name] = {};
        form_state.values[name][drupalgap.settings.language] = {};
        var allowed_values = element.field_info_field.cardinality;
        if (allowed_values == -1) {
          allowed_values = 1; // Convert unlimited value field to one for now...
        }
        for (var delta = 0; delta < allowed_values; delta++) {
          id = drupalgap_form_get_element_id(name, form.id, drupalgap.settings.language, delta);
          form_state.values[name][drupalgap.settings.language][delta] = _drupalgap_form_state_values_assemble_get_element_value(id, element);
        }
      }
      else {
        id = drupalgap_form_get_element_id(name, form.id);
        form_state.values[name] = _drupalgap_form_state_values_assemble_get_element_value(id, element);
      }
    });
    // Attach the form state to drupalgap.form_states keyed by the form id.
    drupalgap.form_states[form.id] = form_state;
    return form_state;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * 
 */
function _drupalgap_form_state_values_assemble_get_element_value(id, element) {
  try {
    var value = null;
    var selector = '';
    if (element.type == 'radios') {
      selector = 'input:radio[name="' + id  + '"]:checked';
    }
    else { selector = '#' + id; }
    if (element.type == 'checkbox') {
      if ($(selector).is(':checked')) { value = 1; }
      else { value = 0; }
    }
    if (value == null) { value = $(selector).val(); }
    if (typeof value === 'undefined') { value = null; }
    return value;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form id, this will render the form and return the html for the form.
 * Any additional arguments will be sent along to the form.
 */
function drupalgap_get_form(form_id) {
  try {
    var html = '';
    var form = drupalgap_form_load.apply(null, Array.prototype.slice.call(arguments));
    if (form) {
      // Render the form.
      html = drupalgap_form_render(form);
    }
    else { alert('drupalgap_get_form - failed to get form (' + form_id + ')'); }
    return html;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form id, this will return the form JSON object assembled by the
 * form's call back function. If the form fails to load, this returns false.
 */
function drupalgap_form_load(form_id) {
  try {
    
    var form = drupalgap_form_defaults(form_id);
    
    // The form's call back function will be equal to the form id.
    var function_name = form_id;
    if (eval('typeof ' + function_name) == 'function') {
      
      // Grab the form's function.
      var fn = window[function_name];
      
      // Determine the language code.
      var language = drupalgap.settings.language;
      
      // Build the form arguments by iterating over each argument then adding
      // each to to the form arguments, afterwards remove the argument at index
      // zero because that is the form id.
      var form_arguments = [];
      $.each(arguments, function(index, argument){
            form_arguments.push(argument);
      });
      form_arguments.splice(0,1);
      
      // Attach the form arguments to the form object.
      form.arguments = form_arguments;
      
      // If there were no arguments to pass along, call the function directly to
      // retrieve the form, otherwise call the function and pass along any
      // arguments to retrieve the form.
      if (form_arguments.length == 0) { form = fn(form, null); }
      else {
        // We must consolidate the form, form_state and arguments into one array
        // and then pass it along to the form builder.
        var consolidated_arguments = [];
        var form_state = null;
        consolidated_arguments.push(form);
        consolidated_arguments.push(form_state);
        $.each(form_arguments, function(index, argument){
          consolidated_arguments.push(argument);
        });
        form = fn.apply(null, Array.prototype.slice.call(consolidated_arguments));
      }
      
      // Set empty options and attributes properties on each form element if the
      // element does not yet have any. This allows others to more easily modify
      // options and attributes on an element without having to worry about
      // testing for nulls and creating empty properties first.
      $.each(form.elements, function(name, element){
          // If this element is a field, load its field_info_field and
          // field_info_instance onto the element.
          var element_is_field = false;
          var field_info_field = drupalgap_field_info_field(name);
          // TODO - since only nodes have a 'type' element on the form, no other
          // entity types have their field info attached to the variables object.
          if (field_info_field && form.elements.type) {
            element_is_field = true;
            form.elements[name].field_info_field = field_info_field;
            form.elements[name].field_info_instance = drupalgap_field_info_instance(form.entity_type, name, form.elements.type.default_value);
          }
          form.elements[name].is_field = element_is_field;
          // Set the name property on the element if it isn't already set.
          if (!form.elements[name].name) { form.elements[name].name = name; }
          // If the element is a field, we'll append a language code and delta
          // value to the element id, along with the field items appended
          // onto the element using the language code and delta values.
          var id = null;
          if (element_is_field) {
            // What's the number of allowed values (cardinality) on this field?
            // A cardinality of -1 means the field has unlimited values.
            var cardinality = parseInt(element.field_info_field.cardinality);
            if (cardinality == -1) {
              cardinality = 1; // we'll just add one element for now, until we
                               // figure out how to handle the 'add another
                               // item' feature.
            }
            // Initialize the item collections language code if it hasn't been.
            if (!form.elements[name][language]) { form.elements[name][language] = {}; }
            // Prepare the item(s) for this element.
            for (var delta = 0; delta < cardinality; delta++) {
              // Prepare some item defaults.
              var item = drupalgap_form_element_item_create(name, form, language, delta);
              // If the delta for this item hasn't been created on the element,
              // create it using the default item values. Otherwise, merge the
              // default values into the pre existing item on the element.
              if (!form.elements[name][language][delta]) {
                form.elements[name][language][delta] = item;
              }
              else {
                $.extend(form.elements[name][language][delta], item);
              }
            }
          }
          else {
            // This element is not a field, setup default options if none
            // have been provided. Then set the element id.
            if (!element.options) {
              form.elements[name].options = {attributes:{}};
            }
            else if (!element.options.attributes) {
              form.elements[name].options.attributes = {};
            }
            id = drupalgap_form_get_element_id(name, form.id);
            form.elements[name].id = id;
            form.elements[name].options.attributes.id = id;
          }
      });
      
      // Give modules an opportunity to alter the form.
      module_invoke_all('form_alter', form, null, form_id);
      
      // Place the assembled form into local storage so _drupalgap_form_submit
      // will have access to the assembled form.
      drupalgap_form_local_storage_save(form);
    }
    else {
      var error_msg = 'drupalgap_form_load - no callback function (' +
                       function_name + ') available for form (' + form_id + ')'; 
      alert(error_msg);
    }
    return form;
  }
  catch (error) {
    alert('drupalgap_form_load - ' + error);
  }
}

/**
 * Given a form id, this will load the form from local storage and return it.
 * If the form isn't in local storage, this returns false.
 */
function drupalgap_form_local_storage_load(form_id) {
  try {
    var form = false;
    form = window.localStorage.getItem(drupalgap_form_id_local_storage_key(form_id));
    if (!form) { form = false; }
    else { form = JSON.parse(form); }
    return form;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form, this will save the form to local storage, overwriting any
 * previously saved forms.
 */
function drupalgap_form_local_storage_save(form) {
  try {
    window.localStorage.setItem(
      drupalgap_form_id_local_storage_key(form.id),
      JSON.stringify(form)
    );
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form id, this will return the local storage key used by DrupalGap
 * to save the assembled form to the device's local storage.
 */
function drupalgap_form_id_local_storage_key(form_id) {
  try {
    return 'drupalgap_form_' + form_id;
  }
  catch (error) {
    alert('drupalgap_form_id_local_storage_key - ' + error);
  }
}

/**
 * Renders all the input elements in a form.
 */
function _drupalgap_form_render_elements(form) {
  try {
    var content = '';
    // For each form element, if the element objects name property isn't set,
    // set it, then render the element if access is permitted.
    $.each(form.elements, function(name, element){
        if (!element.name) { element.name = name; }
        if (drupalgap_form_element_access(element)) {
          content += _drupalgap_form_render_element(form, element);
        }
    });
    // Add any form buttons to the form elements html, if access to the button
    // is permitted.
    if (form.buttons && form.buttons.length != 0) {
      $.each(form.buttons, function(name, button){
          if (drupalgap_form_element_access(button)) {
            var attributes = {
              type:'button',
              id:drupalgap_form_get_element_id(name, form.id)
            };
            if (button.attributes) { $.extend(attributes, button.attributes); }
            content += '<button ' + drupalgap_attributes(attributes) + '">' +  button.title + '</button>';
          }
      });
    }
    return content;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Renders an input element for a form.
 */
function _drupalgap_form_render_element(form, element) {
  try {
    var html = '';
    
    if (!element) { return html; }
    
    // Extract the element name.
    var name = element.name;
    
    // Grab the language.
    var language = drupalgap.settings.language;
    
    var items = false;
    
    // If this element is a field, extract the items from the language code and
    // determine what module and hook will handle the items. If the element is
    // not a field, just flatten it into a single item collection and determine
    // which module handles this element type. Keep in mind not all the modules
    // actually exist, and we've placed implementations into the field module.
    var module = false;
    var field_widget_form_function_name = false;
    var field_widget_form_function = false;
    if (element.is_field) {
      items = element[language];
      module = element.field_info_instance.widget.module;
    }
    else {
      items = {0:element};
      module = drupalgap_form_element_get_module_name(element.type);
    }
    if (module) {
      field_widget_form_function_name = module + '_field_widget_form';
      if (drupalgap_function_exists(field_widget_form_function_name)) {
        field_widget_form_function = window[field_widget_form_function_name];
      }
      else {
        console.log('WARNING: _drupalgap_form_render_element() - ' + field_widget_form_function_name + '() does not exist for the "' + element.type + '" form element!');
      }
    }
    
    // If there were no items, just return.
    if (!items || items.length == 0) { return html; }
    
    // Generate default variables.
    var variables = {
      attributes:{}
    };
    
    // Grab the info instance and info field for the field, then attach them
    // both to the variables object so all theme functions will have access
    // to that data.
    variables.field_info_field = element.field_info_field;
    variables.field_info_instance = element.field_info_instance;
    
    // Open the element container.
    var container_attributes = {
      'class':drupalgap_form_get_element_container_class(name)
    };
    if (element.type != 'hidden') { html += '<div ' + drupalgap_attributes(container_attributes) + '>'; }
    
    // Render the element item(s). Remember the final delta value for later.
    var delta = 0;
    $.each(items, function(delta, item){
        // Overwrite the variable's attributes id with the item's id.
        variables.attributes.id = item.id;
        
        // Attach the item as the element onto variables.
        variables.element = item;
        
        // Add a label to the element, except submit and hidden elements.
        if (delta == 0 && element.type != 'submit' && element.type != 'hidden') {
          var theme_variables = null;
          if (element.is_field) {
            item.title = element.title;
            theme_variables = {'element':item};
          }
          else { theme_variables = {'element':element}; }
          html += theme('form_element_label', theme_variables);
        }
        
        // If there wasn't a default value provided, set one. Then set the default
        // value into the variables' attributes.
        if (!item.default_value) { item.default_value = ''; }
        variables.attributes.value = item.default_value;
        
        // Merge element attributes into the variables object.
        variables.attributes = $.extend({}, variables.attributes, item.options.attributes);
        
        // Call the hook_field_widget_form() if necessary. Merge any changes
        // to the item back into this item.
        if (field_widget_form_function) {
          field_widget_form_function.apply(null, [form, null, element.field_info_field, element.field_info_instance, language, items, delta, element]);
          $.extend(item, items[delta]);
        }
        
        // Render the element item.
        html += _drupalgap_form_render_element_item(form, element, variables, item);
    });
    
    // Show the 'Add another item' button on unlimited value fields.
    if (element.field_info_field && element.field_info_field.cardinality == -1) {
      var add_another_item_variables = {
        text:"Add another item",
        attributes:{
          'class':'drupalgap_form_add_another_item',
          onclick:"javascript:_drupalgap_form_add_another_item('" + form.id + "', '" + element.name + "', " + delta + ")"
        }
      }; 
      html += theme('button', add_another_item_variables);
    }
    
    // Add element description.
    if (element.description && element.type != 'hidden') {
      html += '<div>' + element.description + '</div>';
    }
    
    // Close the element container and add a spacer div.
    if (element.type != 'hidden') {
      html += '</div><div>&nbsp;</div>';
    }
    
    // Return the element html.
    return html;
    
    // Give modules a chance to alter the variables.
    //module_invoke_all('form_element_alter', form, element, variables);
    
    
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form, an element, the variables for a theme function, and the element
 * item, this will return the html rendering of the element item.
 */
function _drupalgap_form_render_element_item(form, element, variables, item) {
  try {
    var html = '';
    
    // Depending on the element type, if necessary, adjust the variables and/or
    // theme function to be used, then render the element by calling its theme
    // function.
    var theme_function = item.type;
    
    // Make any preprocess modifications to the elements so they will map
    // cleanly to their theme function. A hook_field_widget_form() should be
    // used instead here.
    if (item.type == 'submit') {
      // TODO - convert this to a field widget form hook?
      variables.attributes.onclick = '_drupalgap_form_submit(\'' + form.id + '\');';
      if (!variables.attributes['data-theme']) {
        variables.attributes['data-theme'] = 'b';
      }
    }
    
    // Merge the item into variables.
    $.extend(variables, item);
    
    // If a value isn't set on variables, try to set it with the default value
    // on the item.
    if (typeof variables.value === 'undefined' || variables.value == null) {
      if (typeof item.default_value !== 'undefined') {
        variables.value = item.default_value;
      }
    }
    
    // If the item isn't an outlier, run it through the theme system.
    if (drupalgap_function_exists('theme_' + theme_function)) {
      html += theme(theme_function, variables);
    }
    else {
      if (item.markup || item.markup == '') { html += item.markup; }
      else {
        var msg = 'Field ' + item.type + ' not supported.';
        html += '<div><em>' + msg + '</em></div>';
        console.log('WARNING: _drupalgap_form_render_element_item() - ' + msg);
      }
    }
    
    return html;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a form, the form state, an element in the form, and a language code,
 * this will generate the Forms API Element Item(s) for the given element. Field
 * elements will be keyed by a language code and delta value(s), while flat
 * elements will be keyed be delta zero.
 */
/*function _drupalgap_form_element_items_load(form, form_state, element, language) {
  try {
    var items = false;
    if (element.is_field) {
      // What's the cardinatlity (number of allowed values) on this field?
      var cardinality = parseInt(element.field_info_field.cardinality);
      if (cardinality == -1) {
        //cardinality = 1; // we'll just add one element for now, until we
                         // figure out how to handle the 'add another
                         // item' feature.
        //cardinality = form.elements[element.name][language].length;
        cardinality = Object.keys(form.elements[element.name][language]).length;
        if (!cardinality) { cardinality = 1; }
      }
      items = _drupalgap_form_element_items_widget_load(form, form_state, element, language, cardinality);
    }
    else {
      items = {0:element};
      //variables.attributes.id = element.id;
    }
    return items;
  }
  catch (error) { drupalgap_error(error); }
}*/

/**
 * Given an element name, the form, a language code and a delta value, this
 * will return default values that can be used to place an item element into a
 * Forms API object.
 */
function drupalgap_form_element_item_create(name, form, language, delta) {
  try {
    // Generate the id for this element field item and set it and
    // some default options onto the element item.
    var id = drupalgap_form_get_element_id(name, form.id, language, delta);
    return {
      'id':id,
      options:{attributes:{'id':id}}
    };
  }
  catch (error) { drupalgap_error(error); }
}

/**
 *
 */
/*function _drupalgap_form_element_item_load(form, form_state, element, language, delta) {
  try {
    var items = _drupalgap_form_element_items_load(form, form_state, element, language);
    if (items && items[delta]) { return items[delta]; }
    return false;
  }
  catch (error) { drupalgap_error(error); }
}*/

/**
 *
 */
/*function _drupalgap_form_element_items_widget_load(form, form_state, element, language, cardinality) {
  try {
    var items = false;
    // What module handles this element?
    var module = element.field_info_instance.widget.module;
    // Determine the hook_field_widget_form() function for this field. 
    var field_widget_form_function = module + '_field_widget_form';
    if (drupalgap_function_exists(field_widget_form_function)) {
      var fn = window[field_widget_form_function];
      // Build the widget arguments into an array so we can apply them to the
      // widget function.
      // Iterate over each delta and call the field widget hook.
      for (var delta = 0; delta < cardinality; delta++) {
        var widget_arguments = _drupalgap_form_element_items_widget_arguments(form, form_state, element, language, delta);
        fn.apply(null, widget_arguments);
      }
      // Extract the field items that were placed onto the form by the field
      // widget hook.
      items = form.elements[element.name][language];
      // Update the form in local storage in case any field widgets changed
      // the form.
      //drupalgap_form_local_storage_save(form);
    }
    else {
      console.log('WARNING: _drupalgap_form_element_items_widget_load() - ' + field_widget_form_function + '() does not exist!');
    }
    return items;
  }
  catch (error) { drupalgap_error(error); }
}*/

/**
 *
 */
function _drupalgap_form_element_items_widget_arguments(form, form_state, element, language, delta) {
  try {
    var widget_arguments = [];
    widget_arguments.push(form); // form
    widget_arguments.push(form_state); // form state
    widget_arguments.push(element.field_info_field); // field
    widget_arguments.push(element.field_info_instance); // instance
    widget_arguments.push(language); // language
    widget_arguments.push(form.elements[element.name][language]); // items
    widget_arguments.push(delta); // delta
    widget_arguments.push(element); // element
    return widget_arguments;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Handles a drupalgap form's submit button click.
 */
function _drupalgap_form_submit(form_id) {
  try {
    // Load the form from local storage.
    var form = drupalgap_form_local_storage_load(form_id);
    if (!form) {
      alert('_drupalgap_form_submit - failed to load form: ' + form_id);
      return false;
    }
    
    // Assemble the form state values.
    var form_state = drupalgap_form_state_values_assemble(form);
    
    // Clear our previous form errors.
    drupalgap.form_errors = {};
    
    // Call drupalgap form's api validate.
    _drupalgap_form_validate(form, form_state);
    
    // Call the form's validate function(s), if any.
    $.each(form.validate, function(index, function_name){
        if (drupalgap.settings.debug) { console.log(function_name + '()'); }
        var fn = window[function_name];
        fn.apply(null, Array.prototype.slice.call([form, form_state]));  
    });
    
    // If there were validation errors, show the form errors and stop the
    // form submission.
    if (!jQuery.isEmptyObject(drupalgap.form_errors)) {
      var html = '';
      $.each(drupalgap.form_errors, function(name, message){
          html += message + '\n\n';
      });
      navigator.notification.alert(
        html,
        function(){},
        'Warning',
        'OK'
      );
      return false;
    }
    
    // Call the form's submit function(s), if any.
    $.each(form.submit, function(index, function_name){
        if (drupalgap.settings.debug) { console.log(function_name + '()'); }
        var fn = window[function_name];
        fn.apply(null, Array.prototype.slice.call([form, form_state]));
    });
      
    // TODO - the call to the form's submit function should be async and we
    // should have a success callback here that checks the form.action and
    // then does a drupalgap_goto there once the form is submitted. Right now,
    // for example, drupalgap_entity_form_submit() takes care of the
    // drupalgap_goto call, should that be handled here?
    // TODO - remove the form from local storage? probably.
  }
  catch (error) {
    alert('_drupalgap_form_submit - ' + error);
  }
}

/**
 * An internal function used by the DrupalGap forms api to validate all the
 * elements on a form. 
 */
function _drupalgap_form_validate(form, form_state) {
  try {
    $.each(form.elements, function(name, element) {
        if (name == 'submit') { return; }
        if (element.required) {
          var valid = true;
          // Check for null value.
          if (form_state.values[name] == null) {
            valid = false;
          }
          // Check for empty string value.
          else if (form_state.values[name] == '') {
            valid = false;
          }
          // Check for a -1 value on a select list. 
          else if (element.type == 'select' && form_state.values[name] == -1) {
            // TODO - this approach to select list validation will not allow
            // a developer to have a select list option with a -1 value.
            valid = false;
          }
          if (!valid) {
            var field_title = name;
            if (element.title) { field_title = element.title; }
            drupalgap_form_set_error(name, 'The ' + field_title + ' field is required.');
          }
        }
    });
  }
  catch (error) {
    alert('_drupalgap_form_validate - ' + error);
  }
}

/**
 * Themes a checkbox input.
 */
function theme_checkbox(variables) {
  try {
    variables.attributes.type = 'checkbox';
    // Check the box?
    if (variables.checked) {
      variables.attributes.checked = 'checked';
    }
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Themes a email input.
 */
function theme_email(variables) {
  try {
    variables.attributes.type = 'email';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Themes a form element label.
 */
function theme_form_element_label(variables) {
  try {
    var element = variables.element;
    // By default, use the element id as the label for, unless the element is
    // a radio, then use the name.
    var label_for = '';
    if (element.id) { label_for = element.id; }
    else if (element.attributes && element.attributes['for']) {
      label_for = element.attributes['for'];
    }
    if (element.type == 'radios') { label_for = element.name; }
    // Render the label.
    var html = '<label for="' + label_for + '"><strong>' + element.title + '</strong>';
    if (element.required) { html += '*'; }
    html += '</label>';
    return html;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Themes a hidden input.
 */
function theme_hidden(variables) {
  try {
    variables.attributes.type = 'hidden';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Themes a password input.
 */
function theme_password(variables) {
  try {
    variables.attributes.type = 'password';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Themes radio buttons.
 */
function theme_radios(variables) {
  try {
    var radios = '';
    if (variables.options) {
      variables.attributes.type = 'radio';
      // Determine an id prefix to use.
      var id = 'radio';
      if (variables.attributes.id) {
        id = variables.attributes.id;
        delete variables.attributes.id;  
      }
      // Set the radio name equal to the id if one doesn't exist.
      if (!variables.attributes.name) {
        variables.attributes.name = id;
      }
      // Init a delta value so each radio button can have a unique id.
      var delta = 0;
      $.each(variables.options, function(value, label){
          if (value == 'attributes') { return; } // Skip the attributes.
          var checked = '';
          if (variables.value && variables.value == value) {
            checked = ' checked="checked" ';
          }
          var input_id = id + '_' + delta.toString();
          var input_label = '<label for="' + input_id + '">' + label + '</label>'
          radios += '<input id="' + input_id + '" value="' + value + '" ' +
                                 drupalgap_attributes(variables.attributes) +
                                 checked + ' />' + input_label;
          delta++;
      });
    }
    return radios;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Themes a select list input.
 */
function theme_select(variables) {
  try {
    var options = '';
    if (variables.options) {
      $.each(variables.options, function(value, label){
          if (value == 'attributes') { return; } // Skip the attributes.
          var selected = '';
          if (variables.value && variables.value == value) {
            selected = ' selected ';
          }
          options += '<option value="' + value + '" ' + selected + '>' + label + '</option>'
      });
    }
    return '<select ' + drupalgap_attributes(variables.attributes) + '>' +
      options +
    '</select>';
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Themes a text input.
 */
function theme_textfield(variables) {
  try {
    variables.attributes.type = 'text';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Themes a textarea input.
 */
function theme_textarea(variables) {
  try {
    var output = '<div><textarea ' + drupalgap_attributes(variables.attributes) + '>' +
                   variables.value +
                 '</textarea></div>';
    return output;
  }
  catch (error) { drupalgap_error(error); }
}

