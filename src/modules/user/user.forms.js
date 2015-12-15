var UserLoginForm = function() {
  //this.id = 'UserLoginForm';

  this.buildForm = function(form, form_state, options) {
    this.form._action = dg.config('front'),
    this.form.name = {
      _type: 'textfield',
      _title: 'Username',
      _required: true,
      _title_placeholder: true
    };
    this.form.pass = {
      _type: 'password',
      _title: 'Password',
      _required: true,
      _title_placeholder: true
    };
    this.form.actions = {
      _type: 'actions',
      submit: {
        _type: 'submit',
        _value: 'Log in',
        _button_type: 'primary'
      }
    };
    options.success(form);
  };

  this.submitForm = function(options) {
    var form_state = this.getFormState();
    jDrupal.userLogin(form_state.values['name'], form_state.values['pass'], options);
  };

};

// Extend the form prototype and attach our constructor.
UserLoginForm.prototype = new dg.Form('UserLoginForm');
UserLoginForm.constructor = UserLoginForm;