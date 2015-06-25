/**
 *
 */
function drupalgap_form_render_elements(form) {
  try {
    var html = '';
    if (!form.elements) { return html; }
    for (var name in form.elements) {
      if (!form.elements.hasOwnProperty(name)) { continue; }
      html += drupalgap_form_render_element(form, form.elements[name]);
    }
    return html;
  }
  catch (error) { console.log('drupalgap_form_render - ' + error); }
}

/**
 *
 */
function drupalgap_form_render_element(form, element) {
  try {
    // Preprocess element if necessary...
    // @TODO great spot for a hook.
    
    // Submit button.
    if (element.type == 'submit') {
      element.attributes['class'] += ' dg_form_submit_button ';
      if (typeof element.attributes['data-ng-click'] === 'undefined') {
        element.attributes['data-ng-click'] = 'drupalgap_form_submit(\'' + form.id + '\', form_state);';
      }
      if (typeof element.attributes['value'] === 'undefined' && element.value) {
        element.attributes['value'] = element.value;
      }
    }
    else {
      // All other elements should have an ng-model attached, which allows the
      // form state values to be properly assembled and ready for validation and
      // submission handlers.
      if (typeof element.attributes['ng-model'] === 'undefined') {
        element.attributes['ng-model'] = "form_state['values']['" + element.name + "']";
      }
    }
    return theme('form_element', { element: element });
  }
  catch (error) { console.log('drupalgap_form_render_element - ' + error); }
}

/**
 *
 */
function theme_form_element(variables) {
  try {
    return '<div>' +
      theme('form_element_label', { element: variables.element } ) +
      theme(variables.element.type, {
          attributes: variables.element.attributes,
          element: variables.element
      }) +
    '</div>';
  }
  catch (error) { console.log('theme_form_element - ' + error); }
}

/**
 *
 */
function theme_form_element_label(variables) {
  try {
    return typeof variables.element.title !== 'undefined' ?
      variables.element.title : '';
  }
  catch (error) { console.log('theme_form_element_label - ' + error); }
}

/**
 *
 */
function dg_form_element_set_empty_options_and_attributes(form, language) {
  try {
    // Set empty options and attributes properties on each form element if the
    // element does not yet have any. This allows others to more easily modify
    // options and attributes on an element without having to worry about
    // testing for nulls and creating empty properties first.
    for (var name in form.elements) {
      if (!form.elements.hasOwnProperty(name)) { continue; }
      var element = form.elements[name];
      // If this element is a field, load its field_info_field and
      // field_info_instance onto the element.
      var element_is_field = false;
      var field_info_field = dg_field_info_field(name);
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
        // This element is not a field, setup default options if none
        // have been provided. Then set the element id.
        if (!element.attributes) {
          form.elements[name].attributes = { };
        }
        id = dg_form_get_element_id(name, form.id);
        form.elements[name].id = id;
        form.elements[name].attributes.id = id;
      }
    }
  }
  catch (error) { console.log('dg_form_element_set_empty_options_and_attributes - ' + error); }
}

/**
 * Given a form element name and the form_id, this generates an html id
 * attribute value to be used in the DOM. An optional third argument is a
 * string language code to use. An optional fourth argument is an integer delta
 * value to use on field elements.
 * @param {String} name
 * @param {String} form_id
 * @return {String}
 */
function dg_form_get_element_id(name, form_id) {
  try {
    if (name == null || name == '') { return ''; }
    var id =
      'edit-' +
      form_id.toLowerCase().replace(/_/g, '-') + '-' +
      name.toLowerCase().replace(/_/g, '-');
    // Any language code to append to the id?
    if (arguments[2]) { id += '-' + arguments[2]; }
    // Any delta value to append to the id?
    if (typeof arguments[3] !== 'undefined') {
      id += '-' + arguments[3] + '-value';
    }
    return id;
  }
  catch (error) { console.log('dg_form_get_element_id - ' + error); }
}

