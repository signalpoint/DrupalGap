drupalgap.services.user = {
  'login':{
    'options':{
      'type':'post',
      'path':'user/login.json',
      'success':function(data){
        drupalgap.user = data.user;
        // WARNING - we don't automatically make a call to acquire the CSRF
        // token here. The DrupalGap User Login resource automatically gets the
        // token, but since this is the default implementation of the Services
        // User Login resource, we won't auto get the CSRF token and set
        // drupalgap.sessid with it.
        // Remove all pages from the DOM.
        drupalgap_remove_pages_from_dom();
      },
    },
    'call':function(options){
      try {
        if (!options.name || !options.pass) {
          if (drupalgap.settings.debug) {
            alert('drupalgap.services.user.login.call - missing user name or password');
          }
          return false;
        }
        var api_options = drupalgap_chain_callbacks(drupalgap.services.user.login.options, options);
        api_options.data = 'username=' + encodeURIComponent(options.name);
        api_options.data += '&password=' + encodeURIComponent(options.pass);
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'User Login Error',
          'OK'
        );
      }
    },
  }, // <!-- login -->
  'logout':{
    'options':{
      'type':'post',
      'path':'user/logout.json',
      'success':function(data){
        // Clear the session id then remove it from local storage, then reset
        // the drupalgap user and call drupalgap system connect.
        drupalgap.sessid = null;
        window.localStorage.removeItem('sessid');
        drupalgap.user = {'uid':0,'roles':{'1':'anonymous user'}};
        drupalgap.services.drupalgap_system.connect.call({'async':false});
        // Remove all pages from the DOM.
        drupalgap_remove_pages_from_dom();
      },
    },
    'call':function(options){
      try {
        drupalgap.api.call(drupalgap_chain_callbacks(drupalgap.services.user.logout.options, options));
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'User Logout Error',
          'OK'
        );
      }
    },
  }, // <!-- logout -->
  'register':{
    'options':{
      'type':'post',
      'path':'user/register.json',
      'success':function(data){
        // TODO - depending on the site's user registration settings,
        // display an informative message about what to do next.
        navigator.notification.alert(
            'Registration Complete!',
            function(){},
            'Notification',
            'OK'
          );
      },
    },
    'call':function(options){
      try {
        if (!options.name) {
          if (drupalgap.settings.debug) {
            console.log('drupalgap.services.user.register.call - missing user name');
          }
          return false;
        }
        if (!options.mail) {
          if (drupalgap.settings.debug) {
            console.log('drupalgap.services.user.register.call - missing user mail');
          }
          return false;
        }
        var api_options = drupalgap_chain_callbacks(drupalgap.services.user.register.options, options);
        api_options.data = 'name=' + encodeURIComponent(options.name);
        api_options.data += '&mail=' + encodeURIComponent(options.mail);
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'User Registration Error',
          'OK'
        );
      }
    },
  }, // <!-- register -->
  'retrieve':{
    'options':{
      'type':'get',
      'path':'user/%uid.json',
      'success':function(account){
        drupalgap.account = account;
      },
    },
    'call':function(options){
      try {
        if (!options.uid) {
          if (drupalgap.settings.debug) {
            console.log('drupalgap.services.user.retrieve.call - missing uid');
          }
          return false;
        }
        var api_options = drupalgap_chain_callbacks(drupalgap.services.user.retrieve.options, options);
        api_options.path = 'user/' + options.uid + '.json';
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'User Retrieve Error',
          'OK'
        );
      }
    },
  }, // <!-- retrieve -->
  'update':{
    'options':{
      'type':'put',
      'path':'user/%uid.json',
    },
    'call':function(options){
      try {
        var api_options = drupalgap_chain_callbacks(drupalgap.services.user.update.options, options);
        api_options.data = drupalgap_user_assemble_data(options);
        api_options.path = 'user/' + options.account.uid + '.json';
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'User Update Error',
          'OK'
        );
      }
    },
  }, // <!-- update -->
};

/**
 * Assembles the data uri component for user entity service resource calls.
 */
function drupalgap_user_assemble_data (options) {
  var data = '';
  if (options.account.name) {
    data += '&name=' + encodeURIComponent(options.account.name);
  }
  if (options.account.mail) {
    data += '&mail=' + encodeURIComponent(options.account.mail);
  }
  if (options.account.current_pass) {
    data += '&current_pass=' + encodeURIComponent(options.account.current_pass);
  }
  if (options.account.picture && options.account.picture.fid) {
    data += '&picture[fid]=' + encodeURIComponent(options.account.picture.fid);
  }
  return data;
}

