With a [custom module](../Modules/Create_a_Custom_Module), we can make changes to any form by implementing `hook_form_alter()`.

## Alter a Form Element

For example the code below will modify an input label and the submit button's theme on the user login form:

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  return new Promise(function(ok, err) {
    if (form_id == 'UserLoginForm') {
      form._validate.push('my_module.user_login_form_validate');
      form._submit.push('my_module.user_login_form_submit');
    }
    ok();
  });
}
```

## Attach a Custom Validate Handler

Sometimes we want to add our own validation logic to a pre-existing form. We can accomplish this by appending a function name to the form's `validate` array. In the example below, we'll prevent the user **joker** from logging in.

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  return new Promise(function(ok, err) {
    if (form_id == 'UserLoginForm') {
      form._validate.push('my_module.user_login_form_validate');
    }
    ok();
  });
}

my_module.user_login_form_validate = function(form, form_state) {
  return new Promise(function(ok, err) {
    if (form_state.getValue('name') == 'jerk') {
      form_state.setErrorByName('name', 'No jerks allowed!');
    }
    ok();
  });
};
```

## Attach a Custom Submit Handler

Sometimes we want to add our own submission logic to a pre-existing form. We can accomplish this by appending a function name to the form's `submit` array. In the example below, we'll alert to the user an informative message when they attempt a login.

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  return new Promise(function(ok, err) {
    if (form_id == 'UserLoginForm') {
      form._submit.push('my_module.user_login_form_submit');
    }
    ok();
  });
}

my_module.user_login_form_submit = function(form, form_state) {
  return new Promise(function(ok, err) {
    dg.nodeLoad(1).then(function(node) {
      console.log(node.getTitle());
      ok();
    });
  });
};
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