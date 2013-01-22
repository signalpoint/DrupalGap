drupalgap.services.drupalgap_user = {
	'login':{
		'options':{
			'type':'post',
			'path':'drupalgap_user/login.json',
			'success':function(data){
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
