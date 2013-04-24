drupalgap.api = {
'options':{ /* these are set by drupalgap_api_default_options() */ },
  'call':function(options){
    try {
      // Get the default api options, then adjust to the caller's options if they are present.
      var api_options = drupalgap_api_default_options();

      // Now assemble the callbacks together.
      var call_options = drupalgap_chain_callbacks(api_options, options);

      // TODO - this is a good spot for a hook, e.g. hook_drupalgap_api_preprocess

      // Build the Drupal URL path to call if one hasn't been assembled already
      // by the caller.
      if (!call_options.url || call_options.url == '') {
        call_options.url = call_options.site_path + drupalgap.settings.base_path;
        if (!drupalgap.settings.clean_urls) {
          call_options.url += '?q=';
        }
        if (call_options.endpoint) {
          call_options.url += call_options.endpoint + '/';
        }
        call_options.url += options.path;
      }

      // Print out the call options if debugging is turned on.
      if (drupalgap.settings.debug) {
        console.log(JSON.stringify(call_options));
      }

      // Make sure the device is online, if it isn't send the
      // user to the offline page.
      drupalgap_check_connection();
      if (!drupalgap.online) {
        navigator.notification.alert(
          'No network connection!',
          function(){ drupalgap_goto('offline'); },
          'Offline',
          'OK'
        );
        return false;
      }

      // Make the call...
      $.mobile.loading('show', {theme: "b", text: "Loading"});

      // Asynchronous call.
      if (call_options.async) {
        $.ajax({
          url: call_options.url,
            type: call_options.type,
            data: call_options.data,
            dataType: call_options.dataType,
            async: true,
            error: call_options.error,
            success: call_options.success,
        });
      }
      // Synchronous call.
      else {
        $.ajax({
            url: call_options.url,
            type: call_options.type,
            data: call_options.data,
            dataType: call_options.dataType,
            async: false,
            error: call_options.error,
            success: call_options.success,
        });
      }
    }
    catch (error) {
    navigator.notification.alert(
      error,
      function(){},
      'DrupalGap API Error',
      'OK'
    );
    }
  }
};

function drupalgap_api_default_options() {
  var default_options = {};
  default_options = {
    'url':'',
    'type':'get',
    'async':true,
    'data':'',
    'dataType':'json',
    'endpoint':drupalgap.settings.default_services_endpoint,
    'site_path':drupalgap.settings.site_path,
    'success':function(result){
      // TODO - this is a good spot for a hook
      // e.g. hook_drupalgap_api_postprocess
      // Hide the loading message.
      $.mobile.hidePageLoadingMsg();
      // If debugging is turned on, print the result to the console.
      if (drupalgap.settings.debug) {
        // Note: http://stackoverflow.com/a/11616993/763010
        var cache = [];
        console.log(JSON.stringify(result, function(key, value) {
            if (typeof value === 'object' && value !== null) {
              if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
              }
              // Store value in our collection
              cache.push(value);
            }
            return value;
        }));
        cache = null; // Enable garbage collection
      }
    },
    'error':function(jqXHR, textStatus, errorThrown, url){
      // TODO - this is a good spot for a hook
      // e.g. hook_drupalgap_api_postprocess
      $.mobile.hidePageLoadingMsg();
      console.log(JSON.stringify({
        "jqXHR":jqXHR,
        "textStatus":textStatus,
        "errorThrown":errorThrown,
      }));
      extra_msg = '';
      if (jqXHR.statusText && jqXHR.statusText != errorThrown) {
        extra_msg = '[' + jqXHR.statusText + ']';
      }
      else if (jqXHR.responseText && jqXHR.responseText != errorThrown) {
        extra_msg = jqXHR.responseText;
      }
      if (this.error_alert) {
        navigator.notification.alert(
          textStatus + ' (' + errorThrown + ') ' + extra_msg + '[' + url + ']',
          function(){},
          'DrupalGap API Call Error',
          'OK'
        );
      }
    },
    'error_alert':true, /* an option to supress the defaul error call back's
                           alert dialog window, use: options.error_alert = false;
                           use with caution */
  };
  return default_options;
}

