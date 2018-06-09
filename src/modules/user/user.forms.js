var UserLoginForm = function() {

  this.buildForm = function(form, formState) {
    return new Promise(function(ok, err) {
      if (!form._action) { form._action = dg.getFrontPagePath(); }
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
    return new Promise(function(ok, err) {
      jDrupal.userLogin(
        formState.getValue('name'),
        formState.getValue('pass')
      ).then(function() {
        if (dg.isFrontPage()) { dg.router.check(dg.getFrontPagePath()); }
        else if (dg.getPath() == form._action) { dg.router.check(form._action); }
        ok();
      }, function(error) {
        var pass = dg.qs('#edit-pass');
        pass.value = '';
        pass.focus();
        var msg = JSON.parse(error.responseText).message;
        !!dg.alert ? dg.alert(msg) : console.log(msg);
        err();
      });
    });
  };

};
UserLoginForm.prototype = new dg.Form('UserLoginForm');
UserLoginForm.constructor = UserLoginForm;
