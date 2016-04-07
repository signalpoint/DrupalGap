/**
 * Given a form id, this will return the form JSON object assembled by the
 * form's call back function. If the form fails to load, this returns false.
 * @param {String} form_id
 * @return {Object}
 */
function drupalgap_form_load(form_id) {
  try {
    var form = drupalgap_form_defaults(form_id);

    // The form's call back function will be equal to the form id.
    var function_name = form_id;
    if (drupalgap_function_exists(function_name)) {

      // Grab the form's function.
      var fn = window[function_name];

      // Determine the language code.
      var language = language_default();

      // Build the form arguments by iterating over each argument then adding
      // each to to the form arguments, afterwards remove the argument at index
      // zero because that is the form id.
      var form_arguments = [];
      for (var index in arguments) {
        if (!arguments.hasOwnProperty(index)) { continue; }
        var argument = arguments[index];
        form_arguments.push(argument);
      }
      form_arguments.splice(0, 1);

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
        for (var index in form_arguments) {
          if (!form_arguments.hasOwnProperty(index)) { continue; }
          var argument = form_arguments[index];
          consolidated_arguments.push(argument);
        }
        form = fn.apply(
            null,
            Array.prototype.slice.call(consolidated_arguments)
        );
      }

      // Set default values across elements in preparation for alteration.
      _drupalgap_form_load_set_element_defaults(form, language);

      // Give modules an opportunity to alter the form.
      module_invoke_all('form_alter', form, null, form_id);

      // Set default values across elements again in case any elements were added in preparation for alteration.
      _drupalgap_form_load_set_element_defaults(form, language);

      // Place the assembled form into local storage so _drupalgap_form_submit
      // will have access to the assembled form.
      drupalgap_form_local_storage_save(form);
      Drupal.cache_expiration.forms[form_id] = 1;
      window.localStorage.setItem('cache_expiration', JSON.stringify(Drupal.cache_expiration));
    }
    else {
      var error_msg = 'drupalgap_form_load - ' + t('no callback function') +
          ' (' + function_name + ') ' + t('available for form') +
          ' (' + form_id + ')';
      drupalgap_alert(error_msg);
    }
    return form;
  }
  catch (error) { console.log('drupalgap_form_load - ' + error); }
}

/**
 * An internal function used to set default values onto all form elements' properties, such as an id and name.
 * @param form
 * @param language
 * @private
 */
function _drupalgap_form_load_set_element_defaults(form, language) {
  try {

    // Set empty options and attributes properties on each form element if the
    // element does not yet have any. This allows others to more easily modify
    // options and attributes on an element without having to worry about
    // testing for nulls and creating empty properties first.
    for (var name in form.elements) {

      if (!form.elements.hasOwnProperty(name)) { continue; }
      var element = form.elements[name];
      //console.log(name);
      //console.log(element);

      // If we haven't already, check to see f this element is a field, load its field_info_field and
      // field_info_instance onto the element.
      if (typeof element.is_field === 'undefined') {
        var element_is_field = false;
        var field_info_field = drupalgap_field_info_field(name);
        if (field_info_field) {
          element_is_field = true;
          form.elements[name].field_info_field = field_info_field;
          form.elements[name].field_info_instance =
              drupalgap_field_info_instance(
                  form.entity_type,
                  name,
                  form.bundle
              );
        }
        form.elements[name].is_field = element_is_field;
      }

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
        if (!form.elements[name][language]) {
          form.elements[name][language] = {};
        }
        // Prepare the item(s) for this element.
        for (var delta = 0; delta < cardinality; delta++) {
          // Prepare some item defaults.
          var item = drupalgap_form_element_item_create(
              name,
              form,
              language,
              delta
          );
          // If the delta for this item hasn't been created on the element,
          // create it using the default item values. Otherwise, merge the
          // default values into the pre existing item on the element.
          if (!form.elements[name][language][delta]) {
            form.elements[name][language][delta] = item;
          }
          else {
            $.extend(true, form.elements[name][language][delta], item);
          }
        }
      }
      else {
        if (element.name == 'user_roles') { console.log('defaults', element); }
        // This element is not a field, setup default options if none
        // have been provided. Then set the element id.
        if (!element.options) {
          form.elements[name].options = {attributes: {}};
        }
        else if (!element.options.attributes) {
          form.elements[name].options.attributes = {};
        }
        id = drupalgap_form_get_element_id(name, form.id);
        form.elements[name].id = id;
        form.elements[name].options.attributes.id = id;
      }
    }
  }
  catch (error) { console.log('_drupalgap_form_elements_set_defaults - ' + error); }
}
