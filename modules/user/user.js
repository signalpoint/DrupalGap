function user_register_form() {
  form = {
    'id':'user_register',
    'submit':['user_register_form_submit'],
    'validate':['user_register_form_validate'],
    'elements':{
      'name':{
        'type':'textfield',
        'title':'Username',
        'required':true,
      },
      'mail':{
        'type':'email',
        'title':'E-mail address',
        'required':true,
      },
      'submit':{
        'type':'submit',
        'value':'Create new account',
      },
    },
  };
  return form;
}

function user_register_form_validate(form, form_state) {
}

function user_register_form_submit(form, form_state) {
  drupalgap.services.user.register.call({
    'name':drupalgap.form_state.values.name,
    'mail':drupalgap.form_state.values.mail,
    'success':function(data){
      $.mobile.changePage(drupalgap.settings.front);
    },
  });
}

