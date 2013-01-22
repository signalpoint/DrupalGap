drupalgap.services.system = {
	'connect':{
		'options':{
			'type':'post',
			'path':'system/connect.json',
			'success':function(data){
			  // Extract data and set drupalgap variables.
				drupalgap.user = data.user;
			},
		},
		'call':function(options){
			try {
				drupalgap.api.call(drupalgap_chain_callbacks(drupalgap.services.system.connect.options, options));
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'System Connect Error',
					'OK'
				);
			}
		},
	}, // <!-- connect -->
	'get_variable':{
		'options':{
			'type':'post',
			'path':'system/get_variable.json',
		},
		'call':function(options){
			try {
				if (!options.name) {
					alert('drupalgap.services.system.get_variable.call - missing argument name');
					return false;
				}
				var api_options = drupalgap_chain_callbacks(drupalgap.services.system.get_variable.options, options);					
				api_options.data = 'name=' + encodeURIComponent(options.name);
				if (options.default_value) {
					api_options.data += 'default=' + encodeURIComponent(options.default_value);
				}
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'System Get Variable Error',
					'OK'
				);
			}
		},
	}, // <!-- get_variable -->
	'set_variable':{
		'options':{
			'type':'post',
			'path':'system/set_variable.json',
		},
		'call':function(options){
			try {
				if (!options.name) {
					alert('drupalgap.services.system.set_variable.call - missing argument "name"');
					return false;
				}
				if (!options.value) {
					alert('drupalgap.services.system.set_variable.call - missing argument "value"');
					return false;
				}
				var api_options = drupalgap_chain_callbacks(drupalgap.services.system.set_variable.options, options);					
				api_options.data =
					'name=' + encodeURIComponent(options.name) + 
					'&value=' + encodeURIComponent(options.value);
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'System Set Variable Error',
					'OK'
				);
			}
		},
	}, // <!-- set_variable -->
	'del_variable':{
		'options':{
			'type':'post',
			'path':'system/del_variable.json',
		},
		'call':function(options){
			try {
				if (!options.name) {
					alert('drupalgap.services.system.del_variable.call - missing argument "name"');
					return false;
				}
				var api_options = drupalgap_chain_callbacks(drupalgap.services.system.del_variable.options, options);					
				api_options.data = 'name=' + encodeURIComponent(options.name);
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'System Delete Variable Error',
					'OK'
				);
			}
		},
	}, // <!-- del_variable -->
};
