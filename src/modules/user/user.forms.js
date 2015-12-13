var UserLoginForm = function() {
  //this.id = 'UserLoginForm';

  this.buildForm = function(form, form_state, options) {
    form.name = {
      _type: 'textfield',
      _required: true
    };
    options.success();
  };

  this.submitForm = function(form, form_state) {

  };

};

// Extend the form prototype and attach our constructor.
UserLoginForm.prototype = new dg.Form('UserLoginForm');
UserLoginForm.constructor = UserLoginForm;