To create a custom form in DrupalGap, place code like this in your [custom DrupalGap module](../Modules/Create_a_Custom_Module). We can add as many [Form Elements](Form_Elements) to the form as we'd like.

## Create a Custom Route to View the Form

```
routes["my_module.say-hello"] = {
  "path": "/say-hello",
  "defaults": {
    "_form": 'MyModuleSayHelloForm',
    "_title": "Say hello"
  }
};
```

## Building the Form

```
/**
 * My form's constructor.
 */
var MyModuleSayHelloForm = function() {

  this.buildForm = function(form, formState) {
    return new Promise(function(ok, err) {
      form.name = {
        _type: 'textfield',
        _title: 'Name',
        _required: true,
        _title_placeholder: true
      };
      form.actions = {
        _type: 'actions',
        submit: {
          _type: 'submit',
          _value: 'Say hello',
          _button_type: 'primary'
        }
      };
      ok(form);
    });
  };
  
  this.validateForm = function(form, formState) {
    return new Promise(function(ok, err) {
      if (formState.getValue('name') == 'bob') {
        formState.setErrorByName('name', 'Sorry bob!');
      }
      ok();
    });
  };

  this.submitForm = function(form, formState) {
    return new Promise(function(ok, err) {
      var msg = 'Hello ' + formState.getValue('name');
      dg.alert(msg);
      ok();
    });
  };

};
// Extend the DrupalGap form prototype and attach my form's constructor.
MyModuleSayHelloForm.prototype = new dg.Form('MyModuleSayHelloForm');
MyModuleSayHelloForm.constructor = MyModuleSayHelloForm;
```

## Form Validation

Since we specified the `_required` property to be `true` on our form's `textfield` above, DrupalGap will automatically validate this form input element. If the user's input is null, the form's submission handler will not be called.

To handle any custom form validation, we can implement the form's validation function. Notice the `validateForm` function above, this informs DrupalGap to automatically call this function for any additional form validation needs.

## Form Submission

To handle our form's submission, we implement the form's submit function. Notice the `submitForm` function above, this informs DrupalGap to automatically call this function to handle the form's submission.

## Viewing the Form

Now when the `say-hello` page is visited, it will automatically display your form! Visit [Navigating Pages](../Pages/Navigating_Pages) to learn more about linking to custom pages.

### Placing the Form in a Block

In a [custom block's](../Blocks/Create_a_Custom_Block) `build` function, we can provide a form to be rendered within the block:

```
return new Promise(function(ok, err) {

  // Load the form, add it to DrupalGap, render it and then return it.
  dg.addForm('MyModuleSayHelloForm', dg.applyToConstructor(MyModuleSayHelloForm)).getForm().then(ok);

});
```
