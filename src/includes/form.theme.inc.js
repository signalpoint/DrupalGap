/**
 * Themes a checkbox input.
 * @param {Object} variables
 * @return {String}
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
  catch (error) { console.log('theme_checkbox - ' + error); }
}

/**
 * Themes checkboxes input.
 * @param {Object} variables
 * @return {String}
 */
function theme_checkboxes(variables) {
  try {
    var html = '';
    variables.attributes.type = 'checkboxes';
    for (var value in variables.options) {
        if (!variables.options.hasOwnProperty(value)) { continue; }
        var label = variables.options[value];
        if (value == 'attributes') { continue; } // Skip attributes.
        var _label = value;
        if (!empty(label)) { _label = label; }
        var checkbox = {
          value: value,
          attributes: {
            name: variables.name + '[' + value + ']',
            'class': variables.name,
            value: value
          }
        };
        if (variables.value && variables.value[value]) { checkbox.checked = true; }
        html += '<label>' + theme('checkbox', checkbox) + '&nbsp;' + label + '</label>';
    }
    // Check the box?
    /*if (variables.checked) {
      variables.attributes.checked = 'checked';
    }*/
    return html;
  }
  catch (error) { console.log('theme_checkbox - ' + error); }
}

/**
 * Themes a email input.
 * @param {Object} variables
 * @return {String}
 */
function theme_email(variables) {
  try {
    variables.attributes.type = 'email';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_email - ' + error); }
}

/**
 * Themes a file input.
 * @param {Object} variables
 * @return {String}
 */
function theme_file(variables) {
  try {
    variables.attributes.type = 'file';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_file - ' + error); }
}

/**
 * Themes a form element label.
 * @param {Object} variables
 * @return {String}
 */
function theme_form_element_label(variables) {
  try {
    var element = variables.element;
    if (empty(element.title)) { return ''; }
    // Any elements with a title_placeholder set to true
    // By default, use the element id as the label for, unless the element is
    // a radio, then use the name.
    var label_for = '';
    if (element.id) { label_for = element.id; }
    else if (element.attributes && element.attributes['for']) {
      label_for = element.attributes['for'];
    }
    if (element.type == 'radios') { label_for = element.name; }
    // Render the label.
    var html =
      '<label for="' + label_for + '"><strong>' + element.title + '</strong>';
    if (element.required) { html += theme('form_required_marker', { }); }
    html += '</label>';
    return html;
  }
  catch (error) { console.log('theme_form_element_label - ' + error); }
}

/**
 * Themes a marker for a required form element label.
 * @param {Object} variables
 * @return {String}
 */
function theme_form_required_marker(variables) {
    return '*';
}

/**
 * Themes a number input.
 * @param {Object} variables
 * @return {String}
 */
function theme_number(variables) {
  try {
    variables.attributes.type = 'number';
    return '<input ' + drupalgap_attributes(variables.attributes) + ' />';
  }
  catch (error) { console.log('theme_number - ' + error); }
}

/**
 * Themes a hidden input.
 * @param {Object} variables
 * @return {String}
 */
function theme_hidden(variables) {
  try {
    variables.attributes.type = 'hidden';
    if (!variables.attributes.value && variables.value != null) {
      variables.attributes.value = variables.value;
    }
    return '<input ' + drupalgap_attributes(variables.attributes) + ' />';
  }
  catch (error) { console.log('theme_hidden - ' + error); }
}

/**
 * Themes a password input.
 * @param {Object} variables
 * @return {String}
 */
function theme_password(variables) {
  try {
    variables.attributes.type = 'password';
    return '<input ' + drupalgap_attributes(variables.attributes) + ' />';
  }
  catch (error) { console.log('theme_password - ' + error); }
}

/**
 * Themes radio buttons.
 * @param {Object} variables
 * @return {String}
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
      for (var value in variables.options) {
          if (!variables.options.hasOwnProperty(value)) { continue; }
          var label = variables.options[value];
          if (value == 'attributes') { continue; } // Skip the attributes.
          var checked = '';
          if (variables.value && variables.value == value) {
            checked = ' checked="checked" ';
          }
          var input_id = id + '_' + delta.toString();
          var input_label =
            '<label for="' + input_id + '">' + label + '</label>';
          radios += '<input id="' + input_id + '" value="' + value + '" ' +
                                 drupalgap_attributes(variables.attributes) +
                                 checked + ' />' + input_label;
          delta++;
      }
    }
    return radios;
  }
  catch (error) { console.log('theme_radios - ' + error); }
}

/**
 * Themes a range input.
 * @param {Object} variables
 * @return {String}
 */
function theme_range(variables) {
  try {
    variables.attributes.type = 'range';
    if (typeof variables.attributes.value === 'undefined') {
      variables.attributes.value = variables.value;
    }
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_range - ' + error); }
}

/**
 * Themes a search input.
 * @param {Object} variables
 * @return {String}
 */
function theme_search(variables) {
  try {
    variables.attributes.type = 'search';
    var output = '<input ' + drupalgap_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_search - ' + error); }
}

/**
 * Themes a select list input.
 * @param {Object} variables
 * @return {String}
 */
function theme_select(variables) {
  try {
    var options = '';
    if (variables.options) {
      for (var value in variables.options) {
          if (!variables.options.hasOwnProperty(value)) { continue; }
          var label = variables.options[value];
          if (value == 'attributes') { continue; } // Skip the attributes.
          // Is the option selected?
          var selected = '';
          if (typeof variables.value !== 'undefined') {
            if (
              ($.isArray(variables.value) && in_array(value, variables.value)) ||
              variables.value == value
            ) { selected = ' selected '; }
          }
          // Render the option.
          options += '<option value="' + value + '" ' + selected + '>' +
            label +
          '</option>';
      }
    }
    return '<select ' + drupalgap_attributes(variables.attributes) + '>' +
      options +
    '</select>';
  }
  catch (error) { console.log('theme_select - ' + error); }
}

/**
 * Themes a telephone input.
 * @param {Object} variables
 * @return {String}
 */
function theme_tel(variables) {
  try {
    variables.attributes['type'] = 'tel';
    return '<input ' + drupalgap_attributes(variables.attributes) + ' />';
  }
  catch (error) { console.log('theme_tel - ' + error); }
}

/**
 * Themes a text input.
 * @param {Object} variables
 * @return {String}
 */
function theme_textfield(variables) {
  try {
    variables.attributes.type = 'text';
    return '<input ' + drupalgap_attributes(variables.attributes) + ' />';
  }
  catch (error) { console.log('theme_textfield - ' + error); }
}

/**
 * Themes a textarea input.
 * @param {Object} variables
 * @return {String}
 */
function theme_textarea(variables) {
  try {
    var output =
      '<div><textarea ' + drupalgap_attributes(variables.attributes) + '>' +
        variables.value +
      '</textarea></div>';
    return output;
  }
  catch (error) { console.log('theme_textarea - ' + error); }
}

