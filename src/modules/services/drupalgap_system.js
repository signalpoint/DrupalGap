// @deprecated
drupalgap.services.drupalgap_system = {
  'connect':{
    'options':{
      'type':'post',
      'path':'drupalgap_system/connect.json',
      'success':function(data){
        var message = 'drupalgap_system.connect has been deprecated! ' + 
          'Use system_connect() instead.';
        alert(message);
        return;
        // Set the session id.
        //drupalgap.sessid = data.system_connect.sessid;
        // Set the Drupal.user to the system connect user.
        Drupal.user = data.system_connect.user;
        // Extract drupalgap service resource results.
        drupalgap.entity_info = data.entity_info;
        drupalgap.field_info_instances = data.field_info_instances;
        drupalgap.field_info_fields = data.field_info_fields;
        drupalgap.taxonomy_vocabularies = drupalgap_taxonomy_vocabularies_extract(data.taxonomy_vocabularies);
        drupalgap_service_resource_extract_results({
          'service':'drupalgap_system',
          'resource':'connect',
          'data':data
        });
      },
    },
    'call':function(options){
      try {
        drupalgap.api.call(drupalgap_chain_callbacks(drupalgap.services.drupalgap_system.connect.options, options));
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'DrupalGap System Connect Error',
          'OK'
        );
      }
    },
  }, // <!-- connect -->
};
