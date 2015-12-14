var UserLoginForm = function() {
  //this.id = 'UserLoginForm';

  this.buildForm = function(form, form_state, options) {
    form.name = {
      _type: 'textfield',
      _title: 'Username',
      _required: true,
      _title_placeholder: true
    };
    form.pass = {
      _type: 'password',
      _title: 'Password',
      _required: true,
      _title_placeholder: true
    };
    form.actions = {
      _type: 'actions',
      submit: {
        _type: 'submit',
        _value: 'Log in',
        _button_type: 'primary'
      }
    };
    options.success(form);
  };

  this.submitForm = function(form, form_state) {
    console.log('submit town!');
  };

};

// Extend the form prototype and attach our constructor.
UserLoginForm.prototype = new dg.Form('UserLoginForm');
UserLoginForm.constructor = UserLoginForm;