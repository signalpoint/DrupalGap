To create a custom form in DrupalGap, place code like this in your [custom DrupalGap module](../Modules/Create_a_Custom_Module). We can add as many [Form Elements](Form_Elements) to the form as we'd like.

## Building the Form

```
/**
 * Define the form.
 */
function my_module_custom_form(form, form_state) {
  try {
    form.elements['name'] = {
      type: 'textfield',
      title: 'Your name',
      required: true
    };
    form.elements['submit'] = {
      type: 'submit',
      value: 'Say Hello'
    };
    return form;
  }
  catch (error) { console.log('my_module_custom_form - ' + error); }
}
```

## Form Validation

Since we specified the `required` property to be `true` on our form's `textfield` above, DrupalGap will automatically validate this form input element. If the user's input is null, the form's submission handler will not be called.

To handle any custom form validation, we can implement the form's validation function. Notice the function name below is the same as our form builder function name, except our validation function has `_validate` appended to it? This informs DrupalGap to automatically call this function for any additional form validation needs.

```
/**
 * Define the form's validation function (optional).
 */
function my_module_custom_form_validate(form, form_state) {
  try {
    // Inform the user that Bob is out to lunch.
    if (form_state.values['name'] == 'Bob') {
      drupalgap_form_set_error('name', 'Sorry, Bob is out to lunch!');
    }
  }
  catch (error) { console.log('my_module_custom_form_validate - ' + error); }
}
```

## Form Submission

To handle our form's submission, we implement the form's submit function. Notice the function name below is the same as our form builder function name, except our submission function has `_submit` appended to it? This informs DrupalGap to automatically call this function to handle the form's submission.

```
/**
 * Define the form's submit function.
 */
function my_module_custom_form_submit(form, form_state) {
  try {
    drupalgap_alert('Hello ' + form_state.values['name'] + '!');
  }
  catch (error) { console.log('my_module_custom_form_submit - ' + error); }
}
```

## Create a Custom Page to View the Form

```
/**
 * Implements hook_menu().
 */
function my_module_menu() {
  try {
    var items = {};
    items['my_form'] = {
      title: 'Hello World',
      page_callback: 'drupalgap_get_form',
      page_arguments: ['my_module_custom_form']
    };
    return items;
  }
  catch (error) { console.log('my_module_menu - ' + error); }
}
```

Now when the `my_form` page is visited, it will automatically display your form! Visit [Navigating Pages](../Pages/Navigating_Pages) to learn more about linking to custom pages.
