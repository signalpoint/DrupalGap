function user_login_form() {
  form = {
    'id':'user_login',
    'submit':['user_login_form_submit'],
    'validate':['user_login_form_validate'],
    'elements':{
      'name':{
        'type':'textfield',
        'title':'Hey Username',
        'required':true,
      },
      'pass':{
        'type':'password',
        'title':'Password',
        'required':true,
      },
      'submit':{
        'type':'submit',
        'value':'Login',
      },
    },
  };
  return form;
}

function user_login_form_validate(form, form_state) {
  try {
  }
  catch (error) {
    alert('user_login_form_validate - ' + error);
  }
}

function user_login_form_submit(form, form_state) {
  try {
    drupalgap.services.drupalgap_user.login.call({
      'name':drupalgap.form_state.values.name,
      'pass':drupalgap.form_state.values.pass,
      'success':function(result){
        $.mobile.changePage(drupalgap.settings.front);
      },
    });
  }
  catch (error) {
    alert('user_login_form_submit - ' + error);
  }
  
}

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
  try {
  }
  catch (error) {
    alert('user_register_form_validate - ' + error);
  }
}

function user_register_form_submit(form, form_state) {
  try {
    drupalgap.services.user.register.call({
      'name':drupalgap.form_state.values.name,
      'mail':drupalgap.form_state.values.mail,
      'success':function(data){
        $.mobile.changePage(drupalgap.settings.front);
      },
    });
  }
  catch (error) {
    alert('user_register_form_submit - ' + error);
  }
}

