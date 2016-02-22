With a [custom module](../Modules/Create_a_Custom_Module), we can make changes to any form by implementing `hook_form_alter()`.

## Alter a Form Element

For example the code below will modify an input label and the submit button's theme on the user login form:

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  try {

    //console.log(form_id); // Use to see the form id.
    //console.log(form);    // Use to inspect the form.

    if (form_id == 'user_login_form') {
    
      // Change the label for the name,
      form.elements.name.title = 'Your name';
      
      // the theme of the button on the login form.
      form.elements.submit.options.attributes['data-theme'] = 'a';
    }

  }
  catch (error) { console.log('my_module_form_alter - ' + error); }
}
```

## Attach a Custom Validate Handler

Sometimes we want to add our own validation logic to a pre-existing form. We can accomplish this by appending a function name to the form's `validate` array. In the example below, we'll prevent the user **joker** from logging in.

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  if (form_id == 'user_login_form') {
    form.validate.push('my_module_user_login_validate');
  }
}

/**
 * Custom validation handler for user login form.
 */
function my_module_user_login_validate(form, form_state) {
  // Prevent the joker from logging in.
  if (form.state.values.name == 'joker') {
    drupalgap_form_set_error('name', 'Sorry, no jokers allowed.');
  }
}
```

## Attach a Custom Submit Handler

Sometimes we want to add our own submission logic to a pre-existing form. We can accomplish this by appending a function name to the form's `submit` array. In the example below, we'll alert to the user an informative message when they attempt a login.

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  if (form_id == 'user_login_form') {
    form.submit.push('my_module_user_login_submit');
  }
}

/**
 * Custom submit handler for user login form.
 */
function my_module_user_login_submit(form, form_state) {
  alert('Buckle your seat belt ' + form_state.values.name + '!');
}
```

## Redirect After a Form Submission

Using the form `action` property, we can specify which path the app will redirect to after the form's submission. For example, by default when creating a new node, the form is designed to redirect to the newly created node for viewing. If we wanted to alter the redirection path, we can do so like so:

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  try {
    // Redirect the node edit form submission to the front page.
    if (form_id == 'node_edit') {
      form.action = drupalgap.settings.front;
    }
  }
  catch (error) { drupalgap_error(error); }
}
```

## Adding an Element to a Form

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  if (form_id == 'some_form') {
    form.elements['my_new_element'] = {
      type: 'textfield',
      id: drupalgap_form_get_element_id('my_new_element', form_id),
      title: 'My New Text Field'
    };
  }
}
```

## Hiding an Element in a Form

To hide a field on the node add/edit form.

```
function my_module_form_alter(form, form_state, form_id) {
  try {
  
    // console.log (form);
    
    if (form.id == 'node_edit' && form.bundle == 'article') {
      
      // form elements to hide field
      form.elements['field_name'].access = false;
      form.elements['field_name'].prefix = '<div style="display: none;">';
      form.elements['field_name'].suffix = '</div>';

    }

  }

  catch (error) { console.log('my_module_form_alter - ' + error); }
  
}
```

## Set Field Value in a form

To set the value of a field on the node add/edit form.

```
function my_module_form_alter(form, form_state, form_id) {
  try {
  
    // console.log (form);
    
    if (form.id == 'node_edit' && form.bundle == 'article') {
      
      // set value
      form.elements['field_name']['und']['0'].value = 1;

    }
    
    
  }

  catch (error) { console.log('my_module_form_alter - ' + error); }
  
}

```
