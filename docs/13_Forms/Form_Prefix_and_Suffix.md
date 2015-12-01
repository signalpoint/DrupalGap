We can place a prefix and/or suffix on forms. This can be done either when creating a custom form, or you can add/edit the prefix and/or suffix on an existing form.

Also view the [Element Markup](Form_Elements/Element_Markup) page for another technique on placing markup on forms.

## Prefix and Suffix on Custom Form

Here's an example that places a prefix and suffix on a custom form:

![Prefix and Suffix on a Form](http://drupalgap.org/sites/default/files/form-prefix-suffix.png)

```
/**
 * Define the form.
 */
function my_module_custom_form(form, form_state) {
  form.prefix += '<p>Welcome to the form!</p>';
  form.suffix += '<p>Thanks for visiting the form!</p>';
  form.elements['my_text_field'] = {
    type: 'textfield',
    title: 'My Text Field'
  };
  form.elements['submit'] = {
    type: 'submit',
    value: 'Submit'
  };
  return form;
}
```

## Alter an Existing Form's Prefix and Suffix

Here's an example that places a prefix and suffix onto the User Login form:

![Form Prefix and Suffix via Form Alteration](http://drupalgap.org/sites/default/files/form-alter-prefix-suffix.png)

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  try {
    if (form_id == 'user_login_form') {
      form.prefix += '<p>Login to access your account.</p>';
      var register_link = l('create a new account', 'user/register');
      form.suffix += '<p>Or ' + register_link + ' to get started.</p>';
    }
  }
  catch (error) { console.log('my_module_form_alter - ' + error); }
}
```

Notice how we use the `+=` operator on the `prefix` and `suffix`. That ensures us we won't overwrite any other module's alterations to the form. It is OK, to use the `=` operator to overwrite the prefix and/or suffix, but just be careful of what you may be overwritting.
