A handy type of form in DrupalGap 8 is a `configForm` (which is similar to Drupal 8's `ConfigFormBase`) and allows you to save and re-use values to and from local storage.

Add something like this to your form's `buildForm` function:

```
this.buildForm = function(form, formState) {
  return new Promise(function(ok, err) {
    
    form.my_module_title = {
      _type: 'textfield',
      _title: dg.t('Title'),
      _required: true,
      _default_value: dg.getVar('my_module_title', '')
    };
    
    form.actions = {
      _type: 'actions',
      submit: {
        _type: 'submit',
        _value: dg.t('Apply')
      }
    };
    
    // Turn the form into a config form.
    dg.configForm(form);
    
    // Send it back to be rendered.
    ok(form);
    
  });
};
```

Upon form submission, all elements (in this case just `my_module_title`) will have their values saved to local storage, so they can be re-used anytime later:

```
var title = dg.getVar('my_module_title', '');
dg.alert(title);
```

It is *strongly recommended* you prefix your element names with your module's machine name, that way the variables don't collide with anybody else in local storage.
