/**
 * Implements hook_menu().
 */
function user_menu() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_menu()');
      console.log(JSON.stringify(arguments));
    }
    var items = {
      'user':{
        'page_callback':'user_page',
      },
      'user/login':{
        'page_callback':'drupalgap_get_form',
        'page_arguments':['user_login'],
      },
      'user/logout':{
        'page_callback':'user_logout',
      },
      'user/register':{
        'page_callback':'drupalgap_get_form',
        'page_arguments':['user_register'],
      },
      'user/%':{
        /*'title':'My account',
        'title_callback':'user_page_title',*/
        'page_callback':'user_view',
        'page_arguments':[1],
      },
    };
    return items;
  }
  catch (error) {
    alert('user_menu - ' + error);
  }
}

/**
 * Page callback for the user page.
 */
function user_page() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_page()');
    }
    if (drupalgap.user.uid != 0) {
      var path = 'user/' + drupalgap.user.uid;
      //menu_set_active_item(path);
      //return menu_execute_active_handler(null, false);
      return menu_execute_active_handler(path, false);
    }
    else {
      return drupalgap_get_form('user_login');
    }
  }
  catch (error) {
    alert('user_page - ' + error);
  }
}


/**
 * Logs the app user out of the website and app.
 */
function user_logout() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_logout()');
      console.log(JSON.stringify(arguments));
    }
    drupalgap.services.user.logout.call({
      'success':function(data){
        drupalgap.services.system.connect.call({
          'success':function(result){
            drupalgap_goto(drupalgap.settings.front);
          },
        });
      }
    });
  }
  catch (error) {
    alert('user_logout - ' + error);
  }
}


/**
 *
 */
function user_listing() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_listing()');
      console.log(JSON.stringify(arguments));
    }
    return {
      'dashboard':{
        'theme':'link',
        'path':'dashboard',
        'text':'Dashboard',
        'attributes':{
          'data-role':'button',
        },
      }
    };
  }
  catch (error) {
    alert('user_listing - ' + error);
  }
}

function user_login() {
  var form = {
    'id':'user_login',
    'entity_type':'user',
    'elements':{
      'name':{
        'type':'textfield',
        'title':'Username',
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

function user_login_submit(form, form_state) {
  try {
    drupalgap.services.drupalgap_user.login.call({
      'name':drupalgap.form_state.values.name,
      'pass':drupalgap.form_state.values.pass,
      'success':function(result){
        drupalgap_goto(drupalgap.settings.front);
      },
    });
  }
  catch (error) {
    alert('user_login_submit - ' + error);
  }
  
}

function user_register() {
  var form = {
    'id':'user_register',
    'entity_type':'user',
    'elements':{
      'name':{
        'type':'textfield',
        'title':'Username',
        'required':true,
        'description':'Spaces are allowed; punctuation is not allowed except for periods, hyphens, apostrophes, and underscores.',
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

function user_register_submit(form, form_state) {
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
    alert('user_register_submit - ' + error);
  }
}

function user_profile_form() {
  var form = {
    'id':'user_profile_form',
    'entity_type':'user',
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
      'picture':{
        'type':'image',
        'widget_type':'imagefield_widget',
        'title':'Picture',
        'required':false,
        'value':'Add Picture',
      },
      'submit':{
        'type':'submit',
        'value':'Create new account',
      },
    },
    'buttons':{
      'cancel':{
        'title':'Cancel',
      },
    },
  };
  return form;
}

function user_profile_form_loaded() {
  try {
    // Are we editing a user?
    if (drupalgap.account_edit.uid) {
      // Retrieve the user and fill in the form values.
      drupalgap.services.user.retrieve.call({
        'uid':drupalgap.account_edit.uid,
        'success':function(account){
          // Set the drupalgap account edit.
          drupalgap.account_edit = account;
          // Load the entity into the form.
          drupalgap_entity_load_into_form('user', null, drupalgap.account_edit, drupalgap.form);
          /*$('#name').val(account.name);
          if (account.mail) {
            $('#mail').val(account.mail);
          }
          else {
            $('#mail').hide();
            $('#current_pass').hide();
          }
          */
          /*if (account.picture) {
            $('#edit_picture').attr('src', drupalgap_image_path(account.picture.uri)).show();
          }*/
        }
      });
    }
  }
  catch (error) {
    alert('node_edit_loaded - ' + error);
  }
}

/**
 *
 */
function user_profile_form_submit(form, form_state) {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_profile_form_submit()');
      console.log(JSON.stringify(arguments));
    }
    var user = drupalgap_entity_build_from_form_state();
    drupalgap_entity_form_submit(user);
  }
  catch (error) {
    alert('user_profile_form_submit - ' + error);
  }
}

/**
 * 
 */
function user_view() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_view()');
      console.log(JSON.stringify(arguments));
    }
    var uid = null;
    if (arguments[0]) { uid = arguments[0]; }
    if (uid) {
      return 'howdy user #' + uid;
    }
    else {
      return 'user_view - failed (' + uid + ')';
    }
  }
  catch (error) {
    alert('user_view - ' + error);
  }
}

