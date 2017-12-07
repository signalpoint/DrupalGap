To create a custom form in DrupalGap, place code like this in your [custom DrupalGap module](../Modules/Create_a_Custom_Module).

## Create a Route to View the Form

```
my_module.routing = function() {
  var routes = {};

  routes['my_module.say-hello'] = {
    path: '/say-hello',
    defaults: {
      _title: "Say hello",
      _form: 'MyModuleSayHelloForm',
    }
  };

  return routes;
};
```

## Building the Form

1. decide on a *unique* name for our form such as `MyModuleSayHelloForm`
2. add the `buildForm` handler function to specify what elements will be on the form to collect user input
3. optional, attach a `validateForm` handler function for any custom validation to the form's input prior to submission
4. add the `submitForm` handler functions  to decide what happens when the form is submitted

We can add as many [Form Elements](Form_Elements) to the form as we'd like, for example:

```
dg.createForm('MyModuleSayHelloForm', function() {

    this.buildForm = function(form, formState) {
      return new Promise(function(ok, err) {
        form.name = {
          _type: 'textfield',
          _title: dg.t('Name'),
          _required: true,
          _title_placeholder: true
        };
        form.actions = {
          _type: 'actions',
          submit: {
            _type: 'submit',
            _value: dg.t('Say hello'),
            _button_type: 'primary'
          }
        };
        ok(form);
      });
    };

    this.validateForm = function(form, formState) {
      return new Promise(function(ok, err) {
        var name = formState.getValue('name');
        if (name == 'bob') {
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

});
```

Once `dg.createForm()` is complete, `MyModuleSayHelloForm` will be available as a global variable for all to use and
contain the `dg.Form` instance. Additionally, `dg.createForm()` returns the `dg.Form` instance for convenience.

## Form Validation

Since we specified the `_required` property to be `true` on our form's `textfield` above, DrupalGap will automatically validate this form input element. If the user's input is null, the form's submission handler will not be called.

To handle any custom form validation, we can implement the form's validation function. Notice the `validateForm` function above, this informs DrupalGap to automatically call this function for any additional form validation needs.

## Form Submission

To handle our form's submission, we implement the form's submit function. Notice the `submitForm` function above, this informs DrupalGap to automatically call this function to handle the form's submission.

## Viewing the Form

Now when the `say-hello` page is visited, it will automatically display your form! Visit [Navigating Pages](../Pages/Navigating_Pages) to learn more about linking to custom pages.
