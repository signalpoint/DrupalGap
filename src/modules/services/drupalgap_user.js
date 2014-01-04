drupalgap.services.drupalgap_user = {
  'login':{
    'options':{
      'type':'post',
      'path':'drupalgap_user/login.json',
      'success':function(data){
        
        // Now that we are logged in, we need to get a CSRF token. We'll make a
        // synchronous (for now) to retrieve it.
        // TODO - set this call up as async.
        var token_url = drupalgap.settings.site_path +
                        drupalgap.settings.base_path +
                        '?q=services/session/token';
        $.ajax({
            url:token_url,
            type:'get',
            dataType:'text',
            async:false,
            success:function(token){
              //alert('acquired token after login ' + token);
              // Save the session id to local storage and set drupalgap
              // session id.
              window.localStorage.setItem('sessid', token);
              drupalgap.sessid = token;
            },
            error:function (jqXHR, textStatus, errorThrown) {
              alert('Failed to retrieve CSRF token after login! (' + errorThrown + ') ' +
                    'Have you upgraded the Services module to at least version 3.4 in Drupal?');
            }
        });
        
        // Extract the system connect user and set drupalgap.user with it.
        drupalgap.user = data.drupalgap_system_connect.system_connect.user;
        drupalgap.field_info_instances = data.drupalgap_system_connect.field_info_instances;
        drupalgap.field_info_fields = data.drupalgap_system_connect.field_info_fields;
        
        // Extract drupalgap service resource results.
        drupalgap_service_resource_extract_results({
          'service':'drupalgap_user',
          'resource':'login',
          'data':data
        });
        
        // Remove all pages from the DOM.
        drupalgap_remove_pages_from_dom();
      },
    },
    'call':function(options){
      try {
        if (!options.name || !options.pass) {
          if (drupalgap.settings.debug) {
            alert('drupalgap.services.drupalgap_user.login.call - missing user name or password');
          }
          return false;
        }
        var api_options = drupalgap_chain_callbacks(drupalgap.services.drupalgap_user.login.options, options);
        api_options.data = 'username=' + encodeURIComponent(options.name);
        api_options.data += '&password=' + encodeURIComponent(options.pass);
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'DrupalGap User Login Error',
          'OK'
        );
      }
    },
  }, // <!-- login -->
};

