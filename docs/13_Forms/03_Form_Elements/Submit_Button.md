DrupalGap automatically disables a form's submit button when the form is submitted. Upon any validation errors, DrupalGap will re-enable the submit button automatically.

To control the status of a form's submit button, try these helper functions:

### Disable the submit button
```
form.disableSubmitButton(); // When you have a Form prototype.

// OR...

dg.loadFormFromInterface(form).enableSubmitButton(); // When you have a FormInterface object.
```

### Enable the submit button
```
form.enableSubmitButton();  // When you have a Form prototype.

// OR...

dg.loadFormFromInterface(form).enableSubmitButton(); // When you have a FormInterface object.
```
