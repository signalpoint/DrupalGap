## Add submit button to form

Here's a quick example of a submit button that can be used within a `buildForm` function:

```
form.actions = {
  _type: 'actions',
  submit: {
    _type: 'submit',
    _value: dg.t('Save')
  }
};
```

## Submit button behavior

DrupalGap automatically disables a form's submit button when the form is submitted. Upon any validation errors, DrupalGap will re-enable the submit button automatically.

To control the status of a form's submit button, try these helper functions:

### Disable submit button
```
// When you have a Form prototype...
form.disableSubmitButton();

// OR...

// When you have a FormInterface object...
dg.loadFormFromInterface(form).disableSubmitButton();
```

### Enable submit button
```
// When you have a Form prototype...
form.enableSubmitButton();  

// OR...

// When you have a FormInterface object...
dg.loadFormFromInterface(form).enableSubmitButton(); 
```

## Manually submit form
```
var form = dg.loadForm('MyCustomForm');
form.submit();
```
