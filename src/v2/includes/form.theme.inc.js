/**
 *
 */
function theme_form(variables) {
  try {
    
    console.log(variables);
    
    var form = variables.form;
    
    // Open form.
    var html = '<form ' + dg_attributes(form.attributes) + '>';
    
    // Prefix.
    if (form.prefix) {
      console.log(typeof form.prefix);
      if (typeof form.prefix === 'array') { }
      else { html += form.prefix; }
    }
    
    // Elements.
    html += variables.elements;
    
    // Close form.
    html += '</form>';

    return html;
  }
  catch (error) { console.log('theme_form - ' + error); }
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

