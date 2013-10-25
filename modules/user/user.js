/**
 * The access callback for the user/%/edit page.
 */
function user_edit_access(account) {
  try {
    // If the current user is looking at their own account, or if they have the
    // 'administer users' permission, then they are allowed to edit the account.
    if (drupalgap.user.uid == account.uid || user_access('administer users')) {
      return true;
    }
    return false;
  }
  catch (error) {
    alert('user_edit_access - ' + error);
  }
}

/**
 * A page call back function to display a simple list of drupal users.
 */
function user_listing() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_listing()');
      console.log(JSON.stringify(arguments));
    }
    // Place an empty item list that will hold a list of users.
    var content = {
      'user_listing':{
        'theme':'jqm_item_list',
        'title':'Users',
        'items':[],
        'attributes':{'id':'user_listing_items'},
      }
    };
    return content;
  }
  catch (error) {
    alert('user_listing - ' + error);
  }
}

/**
 * The pageshow callback handler for the user listing page.
 */
function user_listing_pageshow() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_listing_pageshow()');
    }
    // Grab some users and display them.
		drupalgap.views_datasource.call({
      'path':'drupalgap/views_datasource/drupalgap_users',
      'success':function(data) {
        // Extract the users into items, then drop them in the list.
        var items = [];
        $.each(data.users, function(index, object){
            items.push(l(object.user.name, 'user/' + object.user.uid));
        });
        drupalgap_item_list_populate("#user_listing_items", items);
      },
    });
  }
  catch (error) {
    alert('user_listing_pageshow - ' + error);
  }
}

/**
 * Loads a user object.
 */
function user_load(uid) {
  try {
    var options = null;
    if (arguments[1]) { options = arguments[1]; }
    return entity_load('user', uid, options);
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * The user login form.
 */
function user_login(form, form_state) {
  form.entity_type = 'user';
  form.elements.name = {
    'type':'textfield',
    'title':'Username',
    'required':true,
  };
  form.elements.pass = {
    'type':'password',
    'title':'Password',
    'required':true,
  };
  form.elements.submit = {
    'type':'submit',
    'value':'Login',
  };
  return form;
}

/**
 * The user login form submit handler.
 */
function user_login_submit(form, form_state) {
  try {
    drupalgap.services.drupalgap_user.login.call({
      'name':form_state.values.name,
      'pass':form_state.values.pass,
      'success':function(result){
        drupalgap_goto(drupalgap.settings.front);
      },
    });
  }
  catch (error) { drupalgap_error(error); } 
}

/**
 * The user logout page callback.
 */
function user_logout() {
  try { return '<p>Logging out...</p>'; }
  catch (error) { drupalgap_error(error); }
}

/**
 * The user logout pageshow callback. This actually handles the call to the
 * user logout service resource.
 */
function user_logout_pagechange() {
  try {
    drupalgap.services.user.logout.call({
      'success':function(data){
        drupalgap_goto(drupalgap.settings.front);
      }
    });
  }
  catch (error) { drupalgap_error(error); }
}

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
        'title':'Login',
        'page_callback':'drupalgap_get_form',
        'page_arguments':['user_login'],
        options:{reloadPage:true}
      },
      'user/logout':{
        'title':'Logout',
        'page_callback':'user_logout',
        'pagechange':'user_logout_pagechange',
        options:{reloadPage:true}
      },
      'user/register':{
        'title':'Register',
        'page_callback':'drupalgap_get_form',
        'page_arguments':['user_register'],
        options:{reloadPage:true}
      },
      'user/%':{
        'title':'My account',
        'page_callback':'user_view',
        'pageshow':'user_view_pageshow',
        'page_arguments':[1],
      },
      'user/%/view':{
        'title':'View',
        'type':'MENU_DEFAULT_LOCAL_TASK',
        'weight':-10,
      },
      'user/%/edit':{
        'title':'Edit',
        'page_callback':'entity_page_edit',
        'pageshow':'entity_page_edit_pageshow',
        'page_arguments':['user_profile_form', 'user', 1],
        'access_callback':'user_edit_access',
        'access_arguments':[1],
        'weight':0,
        'type':'MENU_LOCAL_TASK',
      },
      'user-listing':{
        'title':'Users',
        'page_callback':'user_listing',
        'access_arguments':['access user profiles'],
        'pageshow':'user_listing_pageshow',
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
    // NOTE, this page call back isn't actually used, because the 'user' path
    // in DrupalGap is redirected to either 'user/login' or e.g. 'user/123/view'.
    return 'user_page()';
  }
  catch (error) {
    alert('user_page - ' + error);
  }
}

/**
 * The user registration form.
 */
function user_register(form, form_state) {
  try {
    form.entity_type = 'user';
    form.elements.name = {
      'type':'textfield',
      'title':'Username',
      'required':true,
      'description':'Spaces are allowed; punctuation is not allowed except for periods, hyphens, apostrophes, and underscores.',
    };
    form.elements.mail = {
      'type':'email',
      'title':'E-mail address',
      'required':true,
    };
    form.elements.submit = {
      'type':'submit',
      'value':'Create new account',
    };
    return form;
  }
  catch (error) {
    alert('user_register - ' + error);
  }
}

/**
 * The user registration form submit handler.
 */
function user_register_submit(form, form_state) {
  try {
    drupalgap.services.user.register.call({
      'name':form_state.values.name,
      'mail':form_state.values.mail,
      'success':function(data){
        drupalgap_goto('');
      },
    });
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * The user profile form.
 */
function user_profile_form(form, form_state, account) {
  try {
    // Setup form defaults.
    form.entity_type = 'user';
    
    // Add the entity's core fields to the form.
    drupalgap_entity_add_core_fields_to_form('user', null, form, account);
    
    // Add the fields for accounts to the form.
    drupalgap_field_info_instances_add_to_form('user', null, form, account);
    
    // Add password fields to the form. We show the current password field only
    // if the user is editing their account. We show the password and confirm
    // password field no matter what.
    if (drupalgap.user.uid == account.uid) {
      form.elements.current_pass = {
        'title':'Current password',
        'type':'password',
        'description':'Enter your current password to change the E-mail address or Password.'
      };
    }
    form.elements.pass_pass1 = {
      'title':'Password',
      'type':'password'
    };
    form.elements.pass_pass2 = {
      'title':'Confirm password',
      'type':'password',
      'description':'To change the current user password, enter the new password in both fields.'
    };
    
    // Add submit to form.
    form.elements.submit = {
      'type':'submit',
      'value':'Save',
    };
    
    // Add cancel button to form.
    form.buttons['cancel'] = {
      'title':'Cancel',
      attributes:{
        onclick:"javascript:drupalgap_back();"
      }
    };
    
    return form;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * The user profile form submit handler.
 */
function user_profile_form_submit(form, form_state) {
  try {
    var account = drupalgap_entity_build_from_form_state(form, form_state);
    drupalgap_entity_form_submit(form, form_state, account);
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Implements hook_theme().
 */
function user_theme() {
  try {
    return {
      'user_picture':{
        'template':'user-picture',
      },
      'user_profile':{
        'template':'user-profile',
      },
    };
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Page callback for user/%.
 */
function user_view(uid) {
  try {
    if (uid) {
      var content = {
        container:_drupalgap_entity_page_container('user', uid, 'view')
      };
      return content;
    }
    else { drupalgap_error('No user id provided!'); }
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * jQM pageshow handler for node/% pages.
 */
function user_view_pageshow(uid) {
  try {
    user_load(uid, {
        success:function(account){
          // Determine the incoming arguments, and set defaults if necessary.
          var view_mode = 'full';
          var langcode = null;
          if (arguments[1]) { view_mode = arguments[1]; }
          if (arguments[2]) { langcode = arguments[2]; }
          if (!langcode) { langcode = drupalgap.settings.language; }
          if (account) {
            var build = {
              'theme':'user_profile',
              'account':account,
              'view_mode':view_mode,
              'language':langcode,
              'name':{'markup':account.name},
              'created':{'markup':(new Date(parseInt(account.created)*1000)).toDateString()},
            };
            // Any picture?
            if (account.picture && account.picture.fid) {
              build.picture = {
                'theme':'image',
                'path':account.picture.url,
              };
            }
            _drupalgap_entity_page_container_inject('user', account.uid, 'view', build);
          }
        }
    });
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a user role (string), this determines if the current user has the role.
 * Returns true if the user has the role, false otherwise. You may pass in a
 * user account object to check against a certain account, instead of the current user.
 */
function drupalgap_user_has_role(role) {
  try {
    var has_role = false;
    var account = null;
    if (arguments[1]) { account = arguments[1]; }
    else { account = drupalgap.user; }
    $.each(account.roles, function(rid, value){
        if (role == value) {
          has_role = true;
          return false;
        }
    });
    return has_role;
  }
  catch (error) { drupalgap_error(error); }
}

