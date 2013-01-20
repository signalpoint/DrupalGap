drupalgap.api = {
'options':{ /* these are set by drupalgap_api_default_options() */ },
  'call':function(options){
	  try {
		  // Get the default api options, then adjust to the caller's options if they are present.
		  var api_options = drupalgap_api_default_options();
		  if (options.type) { api_options.type = options.type; }
		  if (options.async) { api_options.async = options.async; }
		  if (options.data) { api_options.data = options.data; }
		  if (options.dataType) { api_options.dataType = options.dataType; }
		  if (options.endpoint || options.endpoint == '') { api_options.endpoint = options.endpoint; }
		  
		  // Now assemble the callbacks together.
		  var call_options = drupalgap_chain_callbacks(api_options, options);
		  
		  // TODO - this is a good spot for a hook, e.g. hook_drupalgap_api_preprocess
		  
		  // Build the Drupal URL path to call.
		  call_options.url = drupalgap.settings.site_path + drupalgap.settings.base_path;
		  if (!drupalgap.settings.clean_urls) {
			  call_options.url += '?q=';
		  }
		  if (call_options.endpoint) {
			  call_options.url += call_options.endpoint + '/';
		  }
		  call_options.url += options.path;
		  
		  if (drupalgap.settings.debug) {
			  console.log(JSON.stringify(call_options));
		  }
		  
		  // Make sure the device is online, if it isn't send the
		  // user to the offline page.
		  drupalgap_check_connection();
		  if (!drupalgap.online) {
			navigator.notification.alert(
			    'No network connection!',
			    function(){ $.mobile.changePage(drupalgap.settings.offline); },
			    'Offline',
			    'OK'
			);
			return false;
		  }
		  
		// Make the call...
		  
		  // Asynchronous call.
		  if (call_options.async) {
			  //alert('call');
			  $.mobile.loading('show', {theme: "b", text: "Loading"});
			  $.ajax({
				  url: call_options.url,
			      type: call_options.type,
			      data: call_options.data,
			      dataType: call_options.dataType,
			      async: call_options.async,
			      error: call_options.error,
			      success: call_options.success,
			  });
		  }
		  // Synchronous call.
		  else {
			navigator.notification.alert(
				'Only async calls are supported for now!',
				function(){},
				'DrupalGap API Error',
				'OK'
			);
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