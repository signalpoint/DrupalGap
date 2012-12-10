var drupalgap = {
  'settings':{
    'site_path':'', /* e.g. http://www.drupalgap.org */
    'base_path':'/',
    'language':'und',
    'file_public_path':'sites/default/files',
    'debug':true, /* set to true to see console.log debug information */
    'front':'dashboard.html',
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
			  call_options.url = drupalgap.settings.site_path + drupalgap.settings.base_path + '?q=';
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
		// Device is online, let's make a call to the System Connect Service Resource.
		drupalgap.services.system.connect.call({
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
    var networkState = navigator.connection.type;

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
