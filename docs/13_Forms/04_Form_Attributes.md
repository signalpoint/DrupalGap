With the DrupalGap Forms API, we can place attributes within our form. For example, say we wanted to add a class attribute to our form, we could do something like this:

```
/**
 * My custom form builder.
 */
function my_module_custom_form(form, form_state) {
  try {
    form.options.attributes['class'] += 'bar ';
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
  catch (error) { console.log('my_module_custom_form - ' + error); }
}
```

When our form is rendered, it will look something like this:

![A Custom Form with a Text Field and Submit Button](http://drupalgap.org/sites/default/files/form-attributes.png)

Then when we inspect our form's html, we can see our class attribute attached to the form element, for example:

`<form id="my_module_custom_form" class="bar "><!-- ... --></form>`
