drupalgap.services.taxonomy_vocabulary = {
	'create':{
		'options':{
			'type':'post',
			'path':'taxonomy_vocabulary.json',
		},
		'call':function(options){
			try {
				if (!options.taxonomy_vocabulary.name) {
					alert('taxonomy_vocabulary - create - no name provided');
					return;
				}
				if (!options.taxonomy_vocabulary.machine_name) {
					if (options.taxonomy_vocabulary.name) {
						var machine_name = taxonomy_vocabulary.name.toLowerCase().replace(' ', '_');
						options.taxonomy_vocabulary.machine_name = machine_name;
					}
					else {
						alert('taxonomy_vocabulary - create - no machine_name provided');
						return;
					}						
				}
				var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_vocabulary.create.options, options);
				api_options.data = drupalgap_taxonomy_vocabulary_assemble_data(options);
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'taxonomy_vocabulary Create Error',
					'OK'
				);
			}
		},
	}, // <!-- create -->
	'retrieve':{
		'options':{
			'type':'get',
			'path':'taxonomy_vocabulary/%vid.json',
			'success':function(vocabulary){
				drupalgap.taxonomy_vocabulary = vocabulary;
			},
		},
		'call':function(options){
			try {
				if (!options.vid) {
					navigator.notification.alert(
						'No Vocabulary ID provided!',
						function(){},
						'taxonomy_vocabulary Retrieve Error',
						'OK'
					);
				  return;
				}
				var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_vocabulary.retrieve.options, options);
				api_options.path = 'taxonomy_vocabulary/' + options.vid + '.json';
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'taxonomy_vocabulary Retrieve Error',
					'OK'
				);
			}
		},
	}, // <!-- retrieve -->
	'update':{
		'options':{
			'type':'put',
			'path':'taxonomy_vocabulary/%vid.json',
		},
		'call':function(options){
			try {
				var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_vocabulary.update.options, options);
				api_options.data = drupalgap_taxonomy_vocabulary_assemble_data(options);
				api_options.path = 'taxonomy_vocabulary/' + options.taxonomy_vocabulary.vid + '.json';
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'taxonomy_vocabulary Update Error',
					'OK'
				);
			}
		},
	}, // <!-- update -->
	'del':{
		'options':{
			'type':'delete',
			'path':'taxonomy_vocabulary/%vid.json',
		},
		'call':function(options){
			try {
				var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_vocabulary.del.options, options);
				api_options.path = 'taxonomy_vocabulary/' + options.vid + '.json';
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'taxonomy_vocabulary Delete Error',
					'OK'
				);
			}
		},
	}, // <!-- delete -->
	'getTree':{
		'options':{
			'type':'post',
			'path':'taxonomy_vocabulary/getTree.json',
			'success':function(tree){
			},
		},
		'call':function(options){
			try {
				if (!options.vid) {
					navigator.notification.alert(
						'No Vocabulary ID provided!',
						function(){},
						'taxonomy_vocabulary getTree Error',
						'OK'
					);
				  return;
				}
				var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_vocabulary.getTree.options, options);
				api_options.data = '';
				if (options.vid) {
					api_options.data += '&vid=' + encodeURIComponent(options.vid);
				}
				if (options.parent) {
					api_options.data += '&parent=' + encodeURIComponent(options.parent);
				}
				if (options.maxdepth) {
					api_options.data += '&maxdepth=' + encodeURIComponent(options.maxdepth);
				}
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'taxonomy_vocabulary getTree Error',
					'OK'
				);
			}
		},
	}, // <!-- getTree -->
};

function drupalgap_taxonomy_vocabulary_assemble_data (options) {
	try {
		data = ''
		//data += 'vid=' + encodeURIComponent(options.taxonomy_term.vid);
		data += '&name=' + encodeURIComponent(options.taxonomy_vocabulary.name);
		data += '&machine_name=' + encodeURIComponent(options.taxonomy_vocabulary.machine_name);
		data += '&description=' + encodeURIComponent(options.taxonomy_vocabulary.description);
		data += '&weight=' + encodeURIComponent(options.taxonomy_vocabulary.weight);
		return data;
	}
	catch (error) {
		alert('drupalgap_taxonomy_vocabulary_assemble_data - ' + error);
	}
	return '';
}
