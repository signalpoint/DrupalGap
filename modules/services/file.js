drupalgap.services.file = {
	'create':{
		'options':{
			'type':'post',
			'path':'file.json',
		},
		'call':function(options){
			try {
				var api_options = drupalgap_chain_callbacks(drupalgap.services.file.create.options, options);
				api_options.data = options.file;
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'File Create Error',
					'OK'
				);
			}
		},
	}, // <!-- create -->
};
