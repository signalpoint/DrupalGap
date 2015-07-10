/**
 *
 */
function drupalgap_form_render_elements(form) {
  try {
    //dpm('drupalgap_form_render_elements');
    //console.log(form);
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
    //dpm('drupalgap_form_render_element');
    //console.log(form);
    //console.log(element.name);
    //console.log(element);

    // Preprocess element if necessary...

    // @TODO great spot for a hook.


    // There are two main "types" of form elements, "flat" elements like node title
    // and node id, and many typical elements created on custom forms. Then there
    // are "field" elements like a node body provided by Drupal's entity system.
    // Flat elements will be rendered as is through the dg theme layer, field elements
    // will be passed along to their hook_field_widget_form() implementer.

    // FLAT ELEMENTS
    if (typeof element.field_name === 'undefined') {

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

      // @TODO we need to employ #theme_wrappers here so i.e. dg_bootstrap can wrap form elements properly
      // @see http://themery.com/dgd7/advanced-theming/forms/generated-markup
      var theme_wrapper = element.theme_wrappers[0];
      var theme_wrapper_vars = {};
      if (dg_is_object(theme_wrapper)) {
        theme_wrapper_vars = theme_wrapper;
        theme_wrapper = theme_wrapper.theme;
      }
      theme_wrapper_vars.children =
        theme('form_element_label', { element: element } ) +
        theme(element.type, {
          attributes: element.attributes,
          element: element
        });
      return theme(theme_wrapper, theme_wrapper_vars);

    }

    // FIELD ELEMENTS
    else {

      var language = form.entity ? form.entity.language : dg_language_default();

      // Determine the hook_field_widget_form().
      var hook = element.field_info_instance.widget.module + '_field_widget_form';
      if (!dg_function_exists(hook)) {
        console.log(hook + '() is missing!');
        return '';
      }

      // Prepare the container children and element items, if any.
      var children = '';
      var items = null;
      if (form.entity) { items = form.entity[element.name][language]; }

      // Field label.
      children += theme('form_element_label', { element: element });

      // New entity.
      if (!items) {
        var delta = 0;
        element = window[hook](
          form,
          null, // form_state
          element.field_info_field, // field
          element.field_info_instance, // instance
          language,
          null, // items
          delta, // delta
          dg_form_element_field_item_element_create(
            form.elements[element.name].attributes.id,
            element.name,
            language,
            delta
          ) // element
        );
        children += theme(element.type, element);
      }

      // Existing entity.
      else {

        for (var delta in items) {
          if (!items.hasOwnProperty(delta)) { continue; }
          var item = items[delta];
          element = window[hook](
            form,
            null, // form_state
            element.field_info_field, // field
            element.field_info_instance, // instance
            language,
            items, // items
            delta, // delta
            dg_form_element_field_item_element_create(
              form.elements[element.name].attributes.id,
              element.name,
              language,
              delta
            ) // element
          );
          children += theme(element.type, element);
        }
      }

      /*if (element.field_info_field.cardinality == '-1') {
        children += '';
      }*/

      return theme('container', {
        element: {
          children: children
        }
      });

    }
    


  }
  catch (error) { console.log('drupalgap_form_render_element - ' + error); }
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
      var element_is_field = typeof element.field_name !== 'undefined' ? true : false;

      if (!element.attributes) {
        form.elements[name].attributes = { };
      }
      id = dg_form_get_element_id(name, form.id);
      form.elements[name].id = id;
      form.elements[name].name = name;
      form.elements[name].attributes.id = id;
      if (!form.elements[name].attributes['class']) { form.elements[name].attributes['class'] = ''; }
      if (!form.elements[name].theme_wrappers) { form.elements[name].theme_wrappers = ['form_element']; }


      // Flat elements.
      if (!element_is_field) {

      }

      // Field elements.
      else {

        // Load its field_info_field and field_info_instance onto the element.
        form.elements[name].field_info_field = dg_field_info_field(name);
        form.elements[name].field_info_instance = dg_field_info_instance(
          form.entity_type,
          name,
          form.bundle
        );

        // Set the title property on the element if it isn't already set.
        if (!form.elements[name].title) {
          form.elements[name].title = t(form.elements[name].field_info_instance.label);
        }

      }

      continue;







      //form.elements[name].is_field = element_is_field; // @TODO Drupal does not use this boolean flag at all.



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
    }
  }
  catch (error) { console.log('dg_form_element_set_empty_options_and_attributes - ' + error); }
}

/**
  * @param {Object} element
  */
function dg_form_element_ng_model_attribute(element) {
  try {
    return "form_state.values['" + element.name + "']";
  }
  catch (error) {
    console.log('dg_form_element_ng_model_attribute - ' + error);
  }
}

/**
 *
 */
function dg_form_element_field_id_attribute(id, language, delta) {
  try {
    return id + '-' + language + '-' + delta + '-value';
  }
  catch (error) {
    console.log('dg_form_element_field_id_attribute - ' + error);
  }
}

/**
 *
 */
function dg_form_element_field_name_attribute(name, language, delta) {
  try {
    return name + '[' + language + '][' + delta + '][value]';
  }
  catch (error) {
    console.log('dg_form_element_field_name_attribute - ' + error);
  }
}

/**
 *
 */
function dg_form_element_field_ng_model_attribute(name, language, delta) {
  try {
    // The ng-model needs the language code and value wrapped in single quotes.
    return 'form_state.values.' + name + "['" + language + "'][" + delta + "]['value']";
  }
  catch (error) {
    console.log('dg_form_element_field_ng_model_attribute - ' + error);
  }
}

/**
 *
 * @param variables
 * @returns {string}
 */
function dg_form_element_field_item_element_create(id, name, language, delta) {
  try {
    return {
      attributes: {
        id: dg_form_element_field_id_attribute(id, language, delta),
        name: dg_form_element_field_name_attribute(name, language, delta),
        'ng-model': dg_form_element_field_ng_model_attribute(name, language, delta)
      }
    }
  }
  catch (error) {
    console.log('dg_form_element_field_item_element_create - ' + error);
  }
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
      //form_id.toLowerCase().replace(/_/g, '-') + '-' +
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

