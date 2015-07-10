angular.module('dg_bootstrap', ['drupalgap']);

/**
 * Implements hook_form_alter().
 */
function dg_bootstrap_form_alter(form, form_state, form_id) {
  //dpm('dg_bootstrap_form_alter');
  //dpm(arguments);
  if (!form.attributes.role) { form.attributes.role = 'form'; }
  for (var name in form.elements) {
    if (!form.elements.hasOwnProperty(name)) { continue; }
    var element = form.elements[name];

    // Add class name to element wrapper.
    element.theme_wrappers[0] = {
      theme: 'form_element',
      attributes: {
        'class': 'form-group'
      }
    };

    // Add class names to elements.
    switch (element.type) {
      case 'password':
      case 'textfield':
      case 'textarea':
      case 'select':
        form.elements[name].attributes['class'] += ' form-control ';
        break;
      case 'submit':
        form.elements[name].attributes['class'] += ' btn btn-default ';
        break;
    }

  }
}
