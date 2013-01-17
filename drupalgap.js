var drupalgap = {
  'settings':{
    'site_path':'', /* e.g. http://www.drupalgap.org */
    'base_path':'/',
    'language':'und',
    'file_public_path':'sites/default/files',
    'debug':true, /* set to true to see console.log debug information */
    'front':'dashboard.html',
    'clean_urls':false, /* set to true if you have clean urls enabled on your site */
  }, // <!-- settings -->
  'destination':'',
  'user':{
	  'uid':0, /* do not change this user id value */
	  'name':'Anonymous',
  }, // <!-- user -->
  'account':{},
  'api':{
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
	  },
  }, // <!-- api -->
  'services':{
	'system':{
		'connect':{
			'options':{
				'type':'post',
				'path':'system/connect.json',
				'success':function(data){
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
	}, // <!-- system -->
	'file':{
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
	}, // <!-- file -->
	'user':{
		'login':{
			'options':{
				'type':'post',
				'path':'user/login.json',
				'success':function(data){
					drupalgap.user = data.user;
				},
			},
			'call':function(options){
				try {
					if (!options.name || !options.pass) {
						if (drupalgap.settings.debug) {
							alert('drupalgap.services.user.login.call - missing user name or password');
						}
						return false;
					}
					var api_options = drupalgap_chain_callbacks(drupalgap.services.user.login.options, options);
					api_options.data = 'username=' + encodeURIComponent(options.name);
					api_options.data += '&password=' + encodeURIComponent(options.pass);
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'User Login Error',
						'OK'
					);
				}
			},
		}, // <!-- login -->
		'logout':{
			'options':{
				'type':'post',
				'path':'user/logout.json',
				'success':function(data){
					drupalgap.user = {'uid':0};
				},
			},
			'call':function(options){
				try {
					drupalgap.api.call(drupalgap_chain_callbacks(drupalgap.services.user.logout.options, options));
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'User Logout Error',
						'OK'
					);
				}
			},
		}, // <!-- logout -->
		'register':{
			'options':{
				'type':'post',
				'path':'user/register.json',
				'success':function(data){
					// TODO - depending on the site's user registration settings,
					// display an informative message about what to do next.
					navigator.notification.alert(
						  'Registration Complete!',
						  function(){},
						  'Notification',
						  'OK'
					  );
				},
			},
			'call':function(options){
				try {
					if (!options.name) {
						if (drupalgap.settings.debug) {
							console.log('drupalgap.services.user.register.call - missing user name');
						}
						return false;
					}
					if (!options.mail) {
						if (drupalgap.settings.debug) {
							console.log('drupalgap.services.user.register.call - missing user mail');
						}
						return false;
					}
					var api_options = drupalgap_chain_callbacks(drupalgap.services.user.register.options, options);
					api_options.data = 'name=' + encodeURIComponent(options.name);
					api_options.data += '&mail=' + encodeURIComponent(options.mail);
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'User Registration Error',
						'OK'
					);
				}
			},
		}, // <!-- register -->
		'retrieve':{
			'options':{
				'type':'get',
				'path':'user/%uid.json',
			},
			'call':function(options){
				try {
					if (!options.uid) {
						if (drupalgap.settings.debug) {
							console.log('drupalgap.services.user.retrieve.call - missing uid');
						}
						return false;
					}
					var api_options = drupalgap_chain_callbacks(drupalgap.services.user.retrieve.options, options);
					api_options.path = 'user/' + options.uid + '.json';
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'User Retrieve Error',
						'OK'
					);
				}
			},
		}, // <!-- retrieve -->
		'update':{
			'options':{
				'type':'put',
				'path':'user/%uid.json',
			},
			'call':function(options){
				try {
					var api_options = drupalgap_chain_callbacks(drupalgap.services.user.update.options, options);
					api_options.data = drupalgap_user_assemble_data(options);
					api_options.path = 'user/' + options.account.uid + '.json';
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'User Update Error',
						'OK'
					);
				}
			},
		}, // <!-- update -->
	}, // <!-- user -->
	'comment':{
		'create':{
			'options':{
				'type':'post',
				'path':'comment.json',
			},
			'call':function(options){
				try {
					var api_options = drupalgap_chain_callbacks(drupalgap.services.comment.create.options, options);
					api_options.data = drupalgap_comment_assemble_data(options);
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'Comment Create Error',
						'OK'
					);
				}
			},
		}, // <!-- create -->
		'retrieve':{
			'options':{
				'type':'get',
				'path':'comment/%nid.json',
				'success':function(comment){
					// TODO - a good opportunity for a hook to come in
					// and modify comment.content if developer wants.
					comment.content = '';
					if (comment.body.length != 0) {
						comment.content = comment.body[comment.language][0].safe_value;
					}
				},
			},
			'call':function(options){
				try {
					if (!options.nid) {
						navigator.notification.alert(
							'No comment id provided!',
							function(){},
							'Comment Retrieve Error',
							'OK'
						);
					  return;
					}
					var api_options = drupalgap_chain_callbacks(drupalgap.services.comment.retrieve.options, options);
					api_options.path = 'comment/' + options.nid + '.json';
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'Comment Retrieve Error',
						'OK'
					);
				}
			},
		}, // <!-- retrieve -->
		'update':{
			'options':{
				'type':'put',
				'path':'comment/%nid.json',
			},
			'call':function(options){
				try {
					var api_options = drupalgap_chain_callbacks(drupalgap.services.comment.update.options, options);
					api_options.data = drupalgap_comment_assemble_data(options);
					api_options.path = 'comment/' + options.comment.nid + '.json';
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'Comment Update Error',
						'OK'
					);
				}
			},
		}, // <!-- update -->
		'del':{
			'options':{
				'type':'delete',
				'path':'comment/%nid.json',
			},
			'call':function(options){
				try {
					var api_options = drupalgap_chain_callbacks(drupalgap.services.comment.del.options, options);
					api_options.path = 'comment/' + options.nid + '.json';
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'Comment Delete Error',
						'OK'
					);
				}
			},
		}, // <!-- delete -->
	}, // <!-- comment -->
	'node':{
		'create':{
			'options':{
				'type':'post',
				'path':'node.json',
			},
			'call':function(options){
				try {
					var api_options = drupalgap_chain_callbacks(drupalgap.services.node.create.options, options);
					api_options.data = drupalgap_node_assemble_data(options);
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'Node Create Error',
						'OK'
					);
				}
			},
		}, // <!-- create -->
		'retrieve':{
			'options':{
				'type':'get',
				'path':'node/%nid.json',
				'success':function(node){
					// TODO - a good opportunity for a hook to come in
					// and modify node.content if developer wants.
					node.content = '';
					if (node.body.length != 0) {
						node.content = node.body[node.language][0].safe_value;
					}
				},
			},
			'call':function(options){
				try {
					if (!options.nid) {
						navigator.notification.alert(
							'No node id provided!',
							function(){},
							'Node Retrieve Error',
							'OK'
						);
					  return;
					}
					var api_options = drupalgap_chain_callbacks(drupalgap.services.node.retrieve.options, options);
					api_options.path = 'node/' + options.nid + '.json';
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'Node Retrieve Error',
						'OK'
					);
				}
			},
		}, // <!-- retrieve -->
		'update':{
			'options':{
				'type':'put',
				'path':'node/%nid.json',
			},
			'call':function(options){
				try {
					var api_options = drupalgap_chain_callbacks(drupalgap.services.node.update.options, options);
					api_options.data = drupalgap_node_assemble_data(options);
					api_options.path = 'node/' + options.node.nid + '.json';
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'Node Update Error',
						'OK'
					);
				}
			},
		}, // <!-- update -->
		'del':{
			'options':{
				'type':'delete',
				'path':'node/%nid.json',
			},
			'call':function(options){
				try {
					var api_options = drupalgap_chain_callbacks(drupalgap.services.node.del.options, options);
					api_options.path = 'node/' + options.nid + '.json';
					drupalgap.api.call(api_options);
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'Node Delete Error',
						'OK'
					);
				}
			},
		}, // <!-- delete -->
	}, // <!-- node -->
	'taxonomy_term':{
		'create':{
			'options':{
				'type':'post',
				'path':'taxonomy_term.json',
				'success':function(result){
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
	}, // <!-- taxonomy_term -->
	'taxonomy_vocabulary':{
		'create':{
			'options':{
				'type':'post',
				'path':'taxonomy_vocabulary.json',
			},
			'call':function(options){
				try {
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
	}, // <!-- taxonomy_vocabulary -->
	'drupalgap_content':{
		'content_types_user_permissions':{
			'options':{
				'type':'post',
				'path':'drupalgap_content/content_types_user_permissions.json',
			},
			'call':function(options){
				try {
					drupalgap.api.call(drupalgap_chain_callbacks(drupalgap.services.drupalgap_content.content_types_user_permissions.options, options));
				}
				catch (error) {
					navigator.notification.alert(
						error,
						function(){},
						'DrupalGap User Roles and Permissions Error',
						'OK'
					);
				}
			},
		}, // <!-- content_types_user_permissions -->
	}, // <!-- drupalgap_content -->
	'drupalgap_system':{
		'connect':{
			'options':{
				'type':'post',
				'path':'drupalgap_system/connect.json',
				'success':function(data){
					// Set the drupalgap.user to the system connect user.
					drupalgap.user = data.system_connect.user;
					// Extract drupalgap service resource results.
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
	}, // <!-- drupalgap_system -->
	'drupalgap_user':{
		'login':{
			'options':{
				'type':'post',
				'path':'drupalgap_user/login.json',
				'success':function(data){
					// Extract the system connect user and set drupalgap.user with it.
					drupalgap.user = data.drupalgap_system_connect.system_connect.user;
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
	}, // <!-- drupalgap_user -->
  }, // <!-- services -->
  'views_datasource':{
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
		  
	  },
  }, // <!-- views_datasource -->
  'node':{ }, // <!-- node -->
  'node_edit':{ }, // <!-- node_edit -->
  'comment':{ }, // <!-- comment -->
  'comment_edit':{ }, // <!-- comment_edit -->
  'taxonomy_term':{ }, // <!-- taxonomy_term ->
  'taxonomy_term_edit':{ }, // <!-- taxonomy_term_edit ->
  'taxonomy_vocabulary':{ }, // <!-- taxonomy_vocabulary ->
  'taxonomy_vocabulary_edit':{ }, // <!-- taxonomy_vocabulary_edit ->
}; // <!-- drupalgap -->

/**
 * 
 */
function drupalgap_onload() {
	document.addEventListener("deviceready", drupalgap_deviceready, false);
}

/**
 * Cordova is loaded and it is now safe to make calls to Cordova methods.
 */
function drupalgap_deviceready() {
	// Verify site path is set.
	if (!drupalgap.settings.site_path || drupalgap.settings.site_path == '') {
		navigator.notification.alert(
		    'You must specify a site path to your Drupal site in the drupalgap.js file!',
		    function(){},
		    'Error',
		    'OK'
		);
		return false;
	}
	// Check device connection.
	if (drupalgap_check_connection() == 'No network connection') {
		// Device is off-line.
		navigator.notification.alert(
		    'Warning, no network connection!',
		    function(){},
		    'Offline',
		    'OK'
		);
		$.mobile.changePage(drupalgap.settings.front);
	}
	else {
		// Device is online, let's make a call to the
		// DrupalGap System Connect Service Resource.
		drupalgap.services.drupalgap_system.connect.call({
			'success':function(result){
				$.mobile.changePage(drupalgap.settings.front);
			},
			'error':function(jqXHR, textStatus, errorThrown) {
				if (errorThrown == 'Not Found') {
					navigator.notification.alert(
					    'Review DrupalGap Troubleshooting Topics!',
					    function(){},
					    'Unable to Connect to Drupal',
					    'OK'
					);
				}
			}
		});
	}
}

/**
 * Checks the devices connection.
 * @returns
 */
function drupalgap_check_connection() {
    // TODO - Uncomment and use this line once cordova 2.3 is released
    // instead of the navigator.network.connection.type variable.
    //var networkState = navigator.connection.type;
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    return states[networkState];
}

function drupalgap_api_default_options() {
	var default_options = {};
	default_options = {
		'url':'',
		'type':'get',
		'async':true,
		'data':'',
		'dataType':'json',
		'endpoint':'drupalgap',
		'success':function(result){
			// TODO - this is a good spot for a hook
			// e.g. hook_drupalgap_api_postprocess
			$.mobile.hidePageLoadingMsg();
			if (drupalgap.settings.debug) {
				console.log(JSON.stringify(result));  
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
			navigator.notification.alert(
				textStatus + ' (' + errorThrown + ') ' + extra_msg,
				function(){},
				'DrupalGap API Error',
				'OK'
			);
		},
	};
	return default_options;
}

/**
 * Takes option set 2, grabs the success/error callback(s), if any, 
 * and appends them onto option set 1's callback(s), then returns
 * the a newly assembled option set.
 */
function drupalgap_chain_callbacks(options_set_1, options_set_2) {
	var new_options_set = {};
	$.extend(true, new_options_set, options_set_1);
	if (options_set_2.success) {
		if (new_options_set.success) {
			if (!$.isArray(new_options_set.success)) {
				var backup = new_options_set.success;
				new_options_set.success = [];
				new_options_set.success.push(backup);
			}
			new_options_set.success.push(options_set_2.success);
		}
		else {
			new_options_set.success = options_set_2.success; 
		}
	}
	if (options_set_2.error) {
		if (new_options_set.error) {
			if (!$.isArray(new_options_set.error)) {	
				var backup = new_options_set.error;
				new_options_set.error = [];
				new_options_set.error.push(backup);
			}
			new_options_set.error.push(options_set_2.error);
		}
		else {
			new_options_set.error = options_set_2.error; 
		}
	}
	return new_options_set;
}

/**
 * 
 */
function drupalgap_node_assemble_data(options) {
	data = 'node[language]=' + encodeURIComponent(drupalgap.settings.language);
	if (options.node.type) {
		data += '&node[type]=' + encodeURIComponent(options.node.type); 
	}
	if (options.node.title) {
		data += '&node[title]=' + encodeURIComponent(options.node.title);
	}
	if (options.node.body) {
		data += '&node[body][' + drupalgap.settings.language + '][0][value]=' +
			encodeURIComponent(options.node.body[drupalgap.settings.language][0].value);
	}
	return data;
}

/**
 * 
 */
function drupalgap_comment_assemble_data(options) {
	data = '';
	if (options.nid) {
		data += '&nid=' + encodeURIComponent(options.nid);
	}
	if (options.subject) {
		data += '&subject=' + encodeURIComponent(options.subject);
	}
	if (options.comment_body) {
		data += '&comment_body[' + drupalgap.settings.language +'][0][value]=' +
			encodeURIComponent(options.comment_body);
	}
	return data;
}

function drupalgap_user_assemble_data (options) {
	data = '';
	if (options.account.name) {
		data += '&name=' + encodeURIComponent(options.account.name);
	}
	if (options.account.mail) {
		data += '&mail=' + encodeURIComponent(options.account.mail);
	}
	if (options.account.current_pass) {
		data += '&current_pass=' + encodeURIComponent(options.account.current_pass);
	}
	if (options.account.picture && options.account.picture.fid) {
		data += '&picture[fid]=' + encodeURIComponent(options.account.picture.fid);
	}
	return data;
}

function drupalgap_taxonomy_term_assemble_data (options) {
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

function drupalgap_taxonomy_vocabulary_assemble_data (options) {
	data = '';
	return data;
}

/**
 *
 */
function drupalgap_format_plural(count, singular, plural) {
	if (count == 1) {
		return singular;
	}
	return plural;
}

/**
 * 
 */
function drupalgap_theme(hook, variables) {
	html = '';
	if (hook == 'image') {
		html = '<img src="' + drupalgap_image_path(variables.path)  + '" />';
	}
	return html;
}

/**
 * 
 * @param uri
 */
function drupalgap_image_path(uri) {
	try {
		src = drupalgap.settings.site_path + drupalgap.settings.base_path + uri;
		if (src.indexOf('public://') != -1) {
			src = src.replace('public://', drupalgap.settings.file_public_path + '/');
		}
		return src;
	}
	catch (error) {
		alert('drupalgap_image_path - ' + error);
	}
}

/*
 * Given a drupal permission machine name, this function returns true if the
 * current user has that permission, false otherwise. Here is example input
 * that checks to see if the current user has the 'access content' permission.
 * 	Example Usage:
 * 		user_access = drupalgap_user_access({'permission':'access content'});
 * 		if (user_access) {
 * 			alert("You have the 'access content' permission.");
 * 		}
 * 		else {
 * 			alert("You do not have the 'access content' permission.");
 * 		}
 */
function drupalgap_user_access(options) {
	try {
		// Make sure they provided a permission.
		if (!options.permission) {
			alert("drupalgap_user_access - permission not provided");
			return false;
		}
		// Assume they don't have permission.
		access = false;
		// Iterate over drupalgap.user.permissions to see if the current
		// user has the given permission, then return the result.
		$.each(drupalgap.user.permissions, function(index, permission){
			if (options.permission == permission) {
				access = true;
				return;
			}
		});
		return access;
	}
	catch (error) {
		alert("drupalgap_user_access - " + error);
	}
	return false;
}

/**
 * 
 */
function drupalgap_service_resource_extract_results(options) {
	try {
		if (options.service == 'drupalgap_system' || options.service == 'drupalgap_user') {
			if (options.resource == 'connect' || options.resource == 'login') {
				// Depending on the service resource, extract the permissions
				// from the options data.
				permissions = {};
				if (options.service == 'drupalgap_system' && options.resource == 'connect') {
					permissions = options.data.user_permissions; 
				}
				else if (options.service == 'drupalgap_user' && options.resource == 'login') {
					permissions = options.data.drupalgap_system_connect.user_permissions; 
				}
				// Now iterate over the extracted user_permissions and attach to
				// the drupalgap.user.permissions variable.
				drupalgap.user.permissions = [];
				$.each(permissions, function(index, object){
					drupalgap.user.permissions.push(object.permission)
				});
			}
		}
	}
	catch (error) {
		alert('drupalgap_service_resource_extract_results - ' + error);
		return null;
	}
}
