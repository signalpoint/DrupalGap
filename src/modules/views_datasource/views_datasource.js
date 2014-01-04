drupalgap.views_datasource = {
  'options':{ /* these are set by drupalgap_api_default_options() */ },
  'call':function(options) {
	  try {
		  if (!options.path) {
			  navigator.notification.alert(
					'No path provided!',
					function(){},
					'DrupalGap Views Datasource Error',
					'OK'
				);
			  return;
		  }
		  //drupalgap.views_datasource.options = drupalgap_api_default_options();
		  var api_options = drupalgap_chain_callbacks(drupalgap.views_datasource.options, options);
		  api_options.endpoint = '';
		  api_options.path = options.path;
		  drupalgap.api.call(api_options);
	  }
	  catch (error) {
		  navigator.notification.alert(
				error,
				function(){},
				'DrupalGap Views Datasource Error',
				'OK'
			);
	  }
	  
  }
};
  