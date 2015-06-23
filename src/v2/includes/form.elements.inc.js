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
    return theme('form_element', { element: element });
  }
  catch (error) { console.log('drupalgap_form_render_element - ' + error); }
}

/**
 *
 */
function theme_form_element(variables) {
  try {
    //console.log(variables);
    return '<div>' +
      theme('form_element_label', { element: variables.element } ) +
      theme(variables.element.type, { element: variables.element } ) +
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

