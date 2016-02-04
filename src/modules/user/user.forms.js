var UserLoginForm = function() {

  this.buildForm = function(form, formState) {
    return new Promise(function(ok, err) {
      form._action = dg.getFrontPagePath();
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
      ok(form);
    });
  };

  this.submitForm = function(form, formState) {
    var self = this;
    return new Promise(function(ok, err) {
      jDrupal.userLogin(
        formState.getValue('name'),
        formState.getValue('pass')
      ).then(ok);
    });

  };

};
UserLoginForm.prototype = new dg.Form('UserLoginForm');
UserLoginForm.constructor = UserLoginForm;

/**
 * A custom submit handler for the user login block.
 * @param {Form} form
 * @param {FormStateInterface} form_state
 * @returns {*}
 */
dg.modules.user.user_login_block_form_submit = function(form, form_state) {
  var self = this;
  return new Promise(function(ok, err) {
    self.submitForm(form, form_state).then(function() {
      // If were on the front page reload it, otherwise the default form action will take care of redirecting them.
      if (dg.isFrontPage()) { dg.router.check(dg.getFrontPagePath()); }
      ok();
    });
  });
};
