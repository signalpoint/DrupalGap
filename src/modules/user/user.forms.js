var UserLoginForm = function() {
  this.id = 'UserLoginForm';

  this.buildForm = function(form, form_state) {
    form.name = {
      _type: 'textfield',
      _required: true
    };
  };

  this.submitForm = function(form, form_state) {

  };

};

// Extend the form prototype and attach our constructor.
UserLoginForm.prototype = new drupalgap.Form;
UserLoginForm.constructor = UserLoginForm;