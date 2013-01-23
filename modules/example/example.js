/**
 * Implements hook_form_alter().
 */
function example_form_alter(form, form_state, form_id) {
  if (form_id == 'user_login') {
    form.elements.name.title = 'Your Login Name';
  }
}

function custom_stuff_form() {
  try {
  }
  catch (error) {
    alert('custom_stuff_form - ' + error);
  }
}

function custom_stuff_validate(form, form_state) {
  try {
  }
  catch (error) {
    alert('custom_stuff_validate - ' + error);
  }
}

function custom_stuff_submit(form, form_state) {
  try {
  }
  catch (error) {
    alert('custom_stuff_submit - ' + error);
  }
}

