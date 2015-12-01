You can place empty elements on a form that contain markup only. For example, with a form alteration you can add markup like this:

```
/**
 * Implements hook_form_alter().
 */
function my_module_form_alter(form, form_state, form_id) {
  try {
    if (form_id == 'user_login_form') {
      form.elements['my_markup'] = {
        markup: '<p>Hello</p>'
      };
    }
  }
  catch (error) { console.log('my_module_form_alter - ' + error); }
}
```

Also view the [Form Prefix and Suffix](../Form_Prefix_and_Suffix) page for other techniques on placing markup onto a form.