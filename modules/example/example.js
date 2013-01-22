/**
 * Implements hook_form_alter().
 */
function example_form_alter(form, form_state, form_id) {
  if (form_id == 'user_login') {
    form.elements.name.title = 'Your Login Name';
  }
}

