drupalgap.services.drupalgap_taxonomy = {
	'get_vocabularies':{
		'options':{
			'type':'post',
			'path':'drupalgap_taxonomy/get_vocabularies.json',
			'success':function(vocabularies){
				
			},
		},
		'call':function(options){
			try {
				drupalgap.api.call(drupalgap_chain_callbacks(drupalgap.services.drupalgap_taxonomy.get_vocabularies.options, options));
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'DrupalGap Taxonomy Get Vocabularies Error',
					'OK'
				);
			}
		},
	}, // <!-- get_vocabularies -->
	'get_terms':{
		'options':{
			'type':'post',
			'path':'drupalgap_taxonomy/get_terms.json',
			'success':function(terms){
				
			},
		},
		'call':function(options){
			try {
				var api_options = drupalgap_chain_callbacks(drupalgap.services.drupalgap_taxonomy.get_terms.options, options);
				api_options.data = 'vid=' + options.vid;
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'DrupalGap Taxonomy Get Terms Error',
					'OK'
				);
			}
		},
	}, // <!-- get_terms -->
};