drupalgap.services.drupalgap_system = {
	'connect':{
		'options':{
			'type':'post',
			'path':'drupalgap_system/connect.json',
			'success':function(data){
				// Set the drupalgap.user to the system connect user.
				drupalgap.user = data.system_connect.user;
				// Extract drupalgap service resource results.
				drupalgap.field_info_instances = data.field_info_instances;
				drupalgap.field_info_fields = data.field_info_fields;
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