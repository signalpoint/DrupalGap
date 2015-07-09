/**
 * Themes a container.
 * @param {Object} variables
 * @return {String}
 */
function theme_container(variables) {
  try {
    var element = variables.element;
    var output = '<div ' + dg_attributes(variables.attributes) + '>' + element.children + '</div>';
    return output;
  }
  catch (error) { console.log('theme_container - ' + error); }
}

/**
 * Themes a form element label.
 * @param {Object} variables
 * @return {String}
 */
function theme_form_element_label(variables) {
  try {
    //dpm('theme_form_element_label');
    //console.log(element.title);
    //console.log(variables);
    var element = variables.element;
    if (dg_empty(element.title)) { return ''; }
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
    var output = '<input ' + dg_attributes(variables.attributes) + ' />';
    return output;
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
    var output = '<input ' + dg_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_password - ' + error); }
}

/**
 * Themes a password input.
 * @param {Object} variables
 * @return {String}
 */
function theme_submit(variables) {
  try {
    //dpm('theme_submit');
    //console.log(variables);
    variables.attributes.type = 'submit';
    var output = '<input ' + dg_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_submit - ' + error); }
}

/**
 * Themes a textarea input.
 * @param {Object} variables
 * @return {String}
 */
function theme_textarea(variables) {
  try {
    var value = typeof variables.value !== 'undefined' ?
      variables.value : '';
    return '<textarea ' + dg_attributes(variables.attributes) + '>' +
      value +
    '</textarea>';
  }
  catch (error) { console.log('theme_textarea - ' + error); }
}

/**
 * Themes a text input.
 * @param {Object} variables
 * @return {String}
 */
function theme_textfield(variables) {
  try {
    variables.attributes.type = 'text';
    var output = '<input ' + dg_attributes(variables.attributes) + ' />';
    return output;
  }
  catch (error) { console.log('theme_textfield - ' + error); }
}
