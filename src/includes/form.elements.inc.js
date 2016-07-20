/**
 * Given a form element, this will return true if access to the element is
 * permitted, false otherwise.
 * @param {Object} element
 * @return {Boolean}
 */
function drupalgap_form_element_access(element) {
  try {
    var access = true;
    if (element.access == false) { access = false; }
    return access;
  }
  catch (error) { console.log('drupalgap_form_element_access - ' + error); }
}

/**
 * Given a form element type, this will return the name of the module that
 * implements the hook_field_widget_form() for the element. Keep in mind for now
 * some of the module names don't exist, and are actually implemented inside
 * the field module. If no module is found, it returns false.
 * @param {String} type
 * @return {String}
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
  catch (error) {
    console.log('drupalgap_form_element_get_module_name - ' + error);
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
function drupalgap_form_get_element_id(name, form_id) {
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
  catch (error) { console.log('drupalgap_form_get_element_id - ' + error); }
}

/**
 * Given an element name, this will return the class name to use on the
 * element's container.
 * @param {String} name
 * @return {String}
 */
function drupalgap_form_get_element_container_class(name) {
  try {
    return 'form-item field-name-' + name.replace(/_/g, '-');
  }
  catch (error) {
    console.log('drupalgap_form_get_element_container_class - ' + error);
  }
}

/**
 * Renders all the input elements in a form.
 * @param {Object} form
 * @return {String}
 */
function _drupalgap_form_render_elements(form) {
  try {
    var content = '';
    var content_sorted = '';
    var content_weighted = [];
    // For each form element, if the element objects name property isn't set,
    // set it, then render the element if access is permitted. While rendering
    // the elements, set them aside according to their widget weight so they
    // can be appended to the content string in the correct order later.
    for (var name in form.elements) {
        if (!form.elements.hasOwnProperty(name)) { continue; }
        var element = form.elements[name];
        if (!element.name) { element.name = name; }
        if (drupalgap_form_element_access(element)) {
          if (
            element.is_field &&
            typeof element.field_info_instance.widget.weight !== 'undefined'
          ) {
            var weight = element.field_info_instance.widget.weight;
            while (typeof content_weighted[weight] !== 'undefined') { weight += .1; }
            content_weighted['' + weight] = _drupalgap_form_render_element(form, element);
          }
          else {
            // Extract the bundle. Note, on comments the bundle is prefixed with
            // 'comment_node_' so we need to remove that to correctly map to the
            // potential extra fields data.
            var bundle = null;
            if (form.bundle) {
              bundle = form.bundle;
              if (
                form.entity_type == 'comment' &&
                form.bundle.indexOf('comment_node_') != -1
              ) { bundle = form.bundle.replace('comment_node_', ''); }
            }

            // This is not a field, if it has it's own weight use it, or see if
            // there is a weight in field_info_extra_fields, otherwise just
            // append it to the element content.

            // Elements with a weight defined.
            if (typeof element.weight !== 'undefined') {
              if (content_weighted[element.weight]) {
                var msg = 'WARNING: _drupalgap_form_render_elements - the ' +
                'weight of ' + element.weight + ' for ' + element.name +
                ' is already in use by ' +
                content_weighted[element.weight].name;
                console.log(msg);
                // Just render it.
                var _content = _drupalgap_form_render_element(form, element);
                if (typeof _content !== 'undefined') { content += _content; }
              }
              else {
                content_weighted[element.weight] =
                  _drupalgap_form_render_element(form, element);
              }
            }

            // Extra fields.
            else if (
              form.entity_type && bundle &&
              typeof drupalgap.field_info_extra_fields[bundle][name] !==
                'undefined' &&
              typeof
                drupalgap.field_info_extra_fields[bundle][name].weight !==
                'undefined'
            ) {
              var weight =
                drupalgap.field_info_extra_fields[bundle][name].weight;
              if (content_weighted[weight]) {
                var msg = 'WARNING: _drupalgap_form_render_elements - the ' + 
                'weight of ' + weight + ' for ' + element.name + ' is ' +
                'already in use by ' + content_weighted[weight].name;
                console.log(msg);
                // Just render it.
                var _content = _drupalgap_form_render_element(form, element);
                if (typeof _content !== 'undefined') { content += _content; }
              }
              else {
                content_weighted[weight] =
                  _drupalgap_form_render_element(form, element);
              }
            }

            // No weight, just render it.
            else {
              var _content = _drupalgap_form_render_element(form, element);
              if (typeof _content !== 'undefined') { content += _content; }
            }

          }
        }
    }
    // Prepend the weighted elements to the content.
    if (!empty(content_weighted)) {
      for (var weight in content_weighted) {
        content_sorted += content_weighted[weight] + '\n';
      }
      // Attach sorted content.
      content = content_sorted + '\n' + content;
    }
    // Add any form buttons to the form elements html, if access to the button
    // is permitted.
    if (form.buttons && form.buttons.length != 0) {
      for (var name in form.buttons) {
          if (!form.buttons.hasOwnProperty(name)) { continue; }
          var button = form.buttons[name];
          if (drupalgap_form_element_access(button)) {
            var attributes = {
              type: 'button',
              id: drupalgap_form_get_element_id(name, form.id)
            };
            if (button.attributes) { $.extend(attributes, button.attributes); }
            content += '<button ' + drupalgap_attributes(attributes) + '">' +
              button.title +
            '</button>';
          }
      }
    }
    return content;
  }
  catch (error) { console.log('_drupalgap_form_render_elements - ' + error); }
}

/**
 * Renders an input element for a form.
 * @param {Object} form
 * @param {Object} element
 * @return {String}
 */
function _drupalgap_form_render_element(form, element) {
  try {
    var html = '';

    if (!element) { return html; }

    // Extract the element name.
    var name = element.name;

    // Grab the language.
    var language = language_default();

    // We'll assume the element has no items (e.g. title, nid, vid, etc), unless
    // we determine later that this element is a field, then it'll have items.
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
      items = {0: element};
      module = drupalgap_form_element_get_module_name(element.type);
    }
    if (module) {
      field_widget_form_function_name = module + '_field_widget_form';

      if (drupalgap_function_exists(field_widget_form_function_name)) {
        field_widget_form_function = window[field_widget_form_function_name];
      }
      else {
        console.log(
          'WARNING: _drupalgap_form_render_element() - ' +
          field_widget_form_function_name +
          '() does not exist for the "' + element.type + '" form element!'
        );
      }
    }

    // If there were no items, just return.
    if (!items || items.length == 0) { return html; }

    // Generate default variables.
    var variables = {
      attributes: {}
    };

    // Grab the info instance and info field for the field, then attach them
    // both to the variables object so all theme functions will have access
    // to that data.
    variables.field_info_field = element.field_info_field;
    variables.field_info_instance = element.field_info_instance;

    // Render the element item(s). Remember the final delta value for later.
    var delta = 0;
    var item_html = '';
    var item_label = '';
    var render_item = null;
    for (var delta in items) {
        if (!items.hasOwnProperty(delta)) { continue; }
        var item = items[delta];

        // We'll render the item, unless we prove otherwise.
        render_item = true;

        // Overwrite the variable's attributes id with the item's id.
        variables.attributes.id = item.id;

        // Attach the item as the element onto variables.
        variables.element = item;

        // Create an array for the item's children if it doesn't exist already.
        // This is used by field widget forms to extend form elements.
        if (!items[delta].children) { items[delta].children = []; }

        // Generate the label for field items on delta zero only. Keep in mind
        // rendered labels, with an element title_placeholder set to true,
        // will not be appended to the result html later.
        if (element.is_field && delta == 0) {
          item.title = element.title;
          item_label = theme('form_element_label', {'element': item});
        }

        // If the element's title is set to be a placeholder, set the
        // placeholder attribute equal to the title on the current item, unless
        // someone already set it. If it is a required element, mark it as such.
        if (
          delta == 0 && typeof element.title_placeholder !== 'undefined' &&
          element.title_placeholder &&
          typeof variables.attributes['placeholder'] === 'undefined'
        ) {
          var placeholder = element.title;
          // @TODO show a better required marker for placeholders.
          /*if (element.required) {
            placeholder += ' ' + theme('form_required_marker', { });
          }*/
          variables.attributes['placeholder'] = placeholder;
        }

        // If there wasn't a default value provided, set one. Then set the default value into the variables' attributes,
        // if it wasn't already set, otherwise set it to the item's value.
        if (!item.default_value) { item.default_value = ''; }
        variables.attributes.value = item.default_value;
        if (
            typeof item.value !== 'undefined' &&
            (typeof variables.attributes.value === 'undefined' || empty(variables.attributes.value))
        ) { variables.attributes.value = item.value; }

        // Call the hook_field_widget_form() if necessary. Merge any changes
        // to the item back into this item.
        if (field_widget_form_function) {
          field_widget_form_function.apply(
            null, [
              form,
              null,
              element.field_info_field,
              element.field_info_instance,
              language,
              items,
              delta,
              element
          ]);
          item = $.extend(true, item, items[delta]);
          // If the item type got lost, replace it.
          if (!item.type && element.type) { item.type = element.type; }
        }

        // Merge element attributes into the variables object.
        if (item.options && item.options.attributes) {
          variables.attributes = $.extend(
            true,
            variables.attributes,
            item.options.attributes
          );
        }

        // Render the element item, unless it wasn't supported. Before rendering, clear out any default values so they
        // aren't stale for the next delta item.
        item_html += _drupalgap_form_render_element_item(
          form,
          element,
          variables,
          item
        );
        if (typeof variables.default_value !== 'undefined') { delete variables.default_value; }
        if (typeof variables.default_value_label !== 'undefined') { delete variables.default_value_label; }
        if (typeof variables.value !== 'undefined') { delete variables.value; }
        if (typeof item_html === 'undefined') {
          render_item = false;
          break;
        }
    }

    // Are we skipping the render of the item?
    if (!render_item) { return ''; }

    // Show the 'Add another item' button on unlimited value fields.
    /*if (element.field_info_field &&
      element.field_info_field.cardinality == -1) {
      var add_another_item_variables = {
        text: 'Add another item',
        attributes: {
          'class': 'drupalgap_form_add_another_item',
          onclick:
            "javascript:_drupalgap_form_add_another_item('" +
              form.id + "', '" +
              element.name + "', " +
              delta +
            ')'
        }
      };
      html += theme('button', add_another_item_variables);
    }*/

    // Is this element wrapped? We won't wrap hidden inputs by default, unless
    // someone is overriding it.
    var wrapped = true;
    if (typeof element.wrapped !== 'undefined' && !element.wrapped) {
      wrapped = false;
    }
    if (element.type == 'hidden') {
      wrapped = false;
      if (element.wrapped) { wrapped = true; }
    }

    // If there is an element prefix, place it in the html.
    if (element.prefix) { html += element.prefix; }

    // Open the element container.
    var container_attributes = {
      'class': drupalgap_form_get_element_container_class(name)
    };
    if (wrapped) {
      html += '<div ' + drupalgap_attributes(container_attributes) + '>';
    }

    // Add a label to the element, except submit and hidden elements. Any field
    // labels have already been rendered, other element labels must be manually
    // rendered here. Don't attach the label if the element's title_placeholder
    // is set to true.
    if (element.type != 'submit' && element.type != 'hidden') {
      if (
        typeof element.title_placeholder !== 'undefined' &&
        element.title_placeholder
      ) { /* Skip label for placeholders. */ }
      else {
        if (element.is_field) { html += item_label; }
        else {
          html += theme('form_element_label', {'element': element});
        }
      }
    }

    // Add the item html if it isn't empty.
    if (item_html != '') { html += item_html; }

    // Add element description.
    if (element.description && element.type != 'hidden') {
      html += '<div class="description">' + t(element.description) + '</div>';
    }

    // Close the element container.
    if (wrapped) { html += '</div>'; }

    // If there is an element suffix, place it in the html.
    if (element.suffix) { html += element.suffix; }

    // Return the element html.
    return html;

  }
  catch (error) { console.log('_drupalgap_form_render_element - ' + error); }
}

/**
 * Given a form, an element, the variables for a theme function, and the element
 * item, this will return the html rendering of the element item.
 * @param {Object} form
 * @param {Object} element
 * @param {Object} variables
 * @param {Object} item
 * @return {*}
 */
function _drupalgap_form_render_element_item(form, element, variables, item) {
  try {
    var html = '';
    // Depending on the element type, if necessary, adjust the variables and/or
    // theme function to be used, then render the element by calling its theme
    // function.
    // @TODO - this block of code should be moved into their respective
    // implementations of hook_field_widget_form().
    switch (item.type) {
      case 'text':
        item.type = 'textfield';
        break;
      case 'list_text':
      case 'list_float':
      case 'list_integer':
        item.type = 'select';
        break;
    }

    // Set the theme function.
    var theme_function = item.type;

    // If the element is disabled, add the 'disabled' attribute.
    if (element.disabled) { variables.attributes.disabled = ''; }

    // Make any preprocess modifications to the elements so they will map
    // cleanly to their theme function.
    // @todo A hook_field_widget_form() should be used instead here.
    if (item.type == 'submit') {
      variables.attributes.onclick =
        '_drupalgap_form_submit(\'' + form.id + '\');';
      if (!variables.attributes['data-theme']) {
        variables.attributes['data-theme'] = 'b';
      }
      if (typeof variables.attributes.type === 'undefined') {
        variables.attributes.type = 'button';
      }
      if (typeof variables.attributes['class'] === 'undefined') {
        variables.attributes['class'] = '';
      }
      variables.attributes['class'] += ' dg_form_submit_button ';
    }

    // Merge the item into variables.
    $.extend(true, variables, item);

    // If a value isn't set on variables, try to set it with the default value
    // on the item.
    if (typeof variables.value === 'undefined' || variables.value == null) {
      if (typeof item.default_value !== 'undefined') {
        variables.value = item.default_value;
      }
    }

    // Run the item through the theme system if a theme function exists, or try
    // to use the item markup, or let the user know the field isn't supported.
    if (drupalgap_function_exists('theme_' + theme_function)) {
      html += theme(theme_function, variables);
    }
    else {
      if (item.markup || item.markup == '') { html += item.markup; }
      else {
        // @todo - the reason for this warning sometimes happens because the
        // item.type is lost with $.extend in _drupalgap_form_render_element().
        // @update - if an item doesn't have a type, it gets set by the parent
        // element, so we should now always have a type available here.
        var msg = 'Field ' + item.type + ' not supported.';
        console.log('WARNING: _drupalgap_form_render_element_item() - ' + msg);
        dpm(item);
        return null;
      }
    }

    // Render any item children. If the child has markup, just use the html,
    // otherwise run the child through theme().
    if (item.children && item.children.length > 0) {
      for (var i = 0; i < item.children.length; i++) {
        if (item.children[i].markup) { html += item.children[i].markup; }
        else if (item.children[i].type || item.children[i].theme) {
          var theme_type = item.children[i].type;
          if (!theme_type) { theme_type = item.children[i].theme; }
          // Is there a title for a label?
          if (item.children[i].title) {
            html += theme('form_element_label', {
                element: item.children[i]
            });
          }
          // Render the child with the theme system.
          if (item.children[i].prefix) { html += item.children[i].prefix; }
          html += theme(theme_type, item.children[i]);
          if (item.children[i].suffix) { html += item.children[i].suffix; }
        }
        else {
          console.log(
            'WARNING: _drupalgap_form_render_element_item - ' +
            'failed to render child ' + i + ' for ' + element.name
          );
        }
      }
    }

    return html;
  }
  catch (error) {
    console.log('_drupalgap_form_render_element_item - ' + error);
  }
}

/**
 * Given an element name, the form, a language code and a delta value, this
 * will return default values that can be used to place an item element into a
 * Forms API object.
 * @param {String} name
 * @param {Object} form
 * @param {String} language
 * @param {Number} delta
 * @return {Object}
 */
function drupalgap_form_element_item_create(name, form, language, delta) {
  try {
    // Generate the id for this element field item and set it and
    // some default options onto the element item.
    var id = drupalgap_form_get_element_id(name, form.id, language, delta);
    return {
      id: id,
      options: {
        attributes: {
          id: id
        }
      },
      required: form.elements[name].required
    };
  }
  catch (error) {
    console.log('drupalgap_form_element_item_create - ' + error);
  }
}

/**
 *
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} element
 * @param {String} language
 * @param {Number} delta
 * @return {Array}
 */
function _drupalgap_form_element_items_widget_arguments(form, form_state,
  element, language, delta) {
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
  catch (error) {
    console.log('_drupalgap_form_element_items_widget_arguments - ' + error);
  }
}

