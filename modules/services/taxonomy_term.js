drupalgap.services.taxonomy_term = {
	'create':{
		'options':{
			'type':'post',
			'path':'taxonomy_term.json',
			'success':function(result){
				// If the term was successfully created, clear out
				// taxonomy_term and taxonomy_term_edit, otherwise notify
				// the user of the problem.
				if (result[0] == 1) {
					drupalgap.taxonomy_term = {};
					drupalgap.taxonomy_term_edit = {};
				}
				else {
					alert('taxonomy_term - create failed - ' + JSON.stringify(result));
				}
			},
		},
		'call':function(options){
			try {
				var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_term.create.options, options);
				api_options.data = drupalgap_taxonomy_term_assemble_data(options);
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'taxonomy_term Create Error',
					'OK'
				);
			}
		},
	}, // <!-- create -->
	'retrieve':{
		'options':{
			'type':'get',
			'path':'taxonomy_term/%tid.json',
			'success':function(term){
				// Set the taxonomy_term with the term that was returned.
				drupalgap.taxonomy_term = term;
			},
		},
		'call':function(options){
			try {
				if (!options.tid) {
					navigator.notification.alert(
						'No Term ID provided!',
						function(){},
						'taxonomy_term Retrieve Error',
						'OK'
					);
				  return;
				}
				var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_term.retrieve.options, options);
				api_options.path = 'taxonomy_term/' + options.tid + '.json';
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'taxonomy_term Retrieve Error',
					'OK'
				);
			}
		},
	}, // <!-- retrieve -->
	'update':{
		'options':{
			'type':'put',
			'path':'taxonomy_term/%tid.json',
			'success':function(result){
				// If the update was successful, clear taxonomy_term_edit,
				// otherwise notify the user.
				if (result[0] == 2) {
					drupalgap.taxonomy_term_edit = {};
				}
				else {
					alert('taxonomy_term - update failed - ' + JSON.stringify(result));
				}
			}
		},
		'call':function(options){
			try {
				var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_term.update.options, options);
				api_options.data = drupalgap_taxonomy_term_assemble_data(options);
				api_options.path = 'taxonomy_term/' + options.taxonomy_term.tid + '.json';
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'taxonomy_term Update Error',
					'OK'
				);
			}
		},
	}, // <!-- update -->
	'del':{
		'options':{
			'type':'delete',
			'path':'taxonomy_term/%tid.json',
			'success':function(result) {
				// If the delete was successful, clear taxonomy_term
				// and taxonomy_term_edit, otherwise notify the user.
				if (result[0] == 3) {
					drupalgap.taxonomy_term = {};
					drupalgap.taxonomy_term_edit = {};
				}
				else {
					alert('taxonomy_term - delete failed - ' + JSON.stringify(result));
				}
			},
		},
		'call':function(options){
			try {
				var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_term.del.options, options);
				api_options.path = 'taxonomy_term/' + options.tid + '.json';
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'taxonomy_term Delete Error',
					'OK'
				);
			}
		},
	}, // <!-- delete -->
	'selectNodes':{
		'options':{
			'type':'post',
			'path':'taxonomy_term/selectNodes.json',
			'success':function(tree){
			},
		},
		'call':function(options){
			try {
				if (!options.tid) {
					navigator.notification.alert(
						'No Term ID protided!',
						function(){},
						'taxonomy_term selectNodes Error',
						'OK'
					);
				  return;
				}
				var api_options = drupalgap_chain_callbacks(drupalgap.services.taxonomy_term.selectNodes.options, options);
				api_options.data = '';
				if (options.tid) {
					api_options.data += '&tid=' + encodeURIComponent(options.tid);
				}
				if (options.pager) {
					api_options.data += '&pager=' + encodeURIComponent(options.pager);
				}
				if (options.limit) {
					api_options.data += '&limit=' + encodeURIComponent(options.limit);
				}
				if (options.order) {
					api_options.data += '&order=' + encodeURIComponent(options.maxdepth);
				}
				drupalgap.api.call(api_options);
			}
			catch (error) {
				navigator.notification.alert(
					error,
					function(){},
					'taxonomy_term selectNodes Error',
					'OK'
				);
			}
		},
	}, // <!-- selectNodes -->
};

function drupalgap_taxonomy_term_assemble_data (options) {
	// TODO - I'm pretty sure this function's implementation is causing this
	// console log error to show up when terms are created/updates:
	// TypeError: Result of expression 'this.element' [undefined] is not an object.
	// at file:///android_asset/www/jquery.mobile-1.2.0.min.js:2
	data = '';
	try {
		data += 'vid=' + encodeURIComponent(options.taxonomy_term.vid);
		data += '&name=' + encodeURIComponent(options.taxonomy_term.name);
		data += '&description=' + encodeURIComponent(options.taxonomy_term.description);
		data += '&weight=' + encodeURIComponent(options.taxonomy_term.weight);
	}
	catch (error) {
		alert('drupalgap_taxonomy_term_assemble_data - ' + error);
	}
	return data;
}
