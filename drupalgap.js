var drupalgap = {
  'settings':{
    'site_path':'', /* e.g. http://www.drupalgap.org */
    'base_path':'/',
    'language':'und',
    'debug':true, /* set to true to see console.log debug information */
    'front':'dashboard.html',
  }, // <!-- settings -->
  'user':{
	  'uid':0, /* do not change this user id value */
	  'name':'Anonymous',
  }, // <!-- user -->
  'api':{
	  'options':{ /* these are set by drupalgap_api_default_options() */ },
	  'call':function(options){
		  try {
			  // Get the default api options, then adjust to the caller's options if they are present.
			  api_options = drupalgap_api_default_options();
			  if (options.type) { api_options.type = options.type; }
			  if (options.async) { api_options.async = options.async; }
			  if (options.data) { api_options.data = options.data; }
			  if (options.dataType) { api_options.dataType = options.dataType; }
			  if (options.endpoint || options.endpoint == '') { api_options.endpoint = options.endpoint; }
			  
			  // Now assemble the callbacks together.
			  api_options = drupalgap_chain_callbacks(api_options, options);
			  
			  // TODO - this is a good spot for a hook, e.g. hook_drupalgap_api_preprocess
			  
			  // Build the Drupal URL path to call.
			  api_options.url = drupalgap.settings.site_path + drupalgap.settings.base_path + '?q=';
			  if (api_options.endpoint) {
				  api_options.url += api_options.endpoint + '/';
			  }
			  api_options.url += options.path;
			  
			  if (drupalgap.settings.debug) {
				  console.log(JSON.stringify(api_options));
			  }
			  
			  // Make the call...
			  
			  // Asynchronous call.
			  if (api_options.async) {
				  $.mobile.loading('show', {theme: "b", text: "Loading"});
				  $.ajax({
					  url: api_options.url,
				      type: api_options.type,
				      data: api_options.data,
				      dataType: api_options.dataType,
				      async: api_options.async,
				      error: api_options.error,
				      success: api_options.success,
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
							console.log('drupalgap.services.user.login.call - missing user name or password');
						}
						return false;
					}
					api_options = drupalgap_chain_callbacks(drupalgap.services.user.login.options, options);
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
					api_options = drupalgap_chain_callbacks(drupalgap.services.user.register.options, options);
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
					api_options = drupalgap_chain_callbacks(drupalgap.services.user.retrieve.options, options);
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
	}, // <!-- user -->
	'node':{
		'create':{
			'options':{
				'type':'post',
				'path':'node.json',
			},
			'call':function(options){
				try {
					api_options = drupalgap_chain_callbacks(drupalgap.services.node.create.options, options);
					api_options.data = 'node[language]=' + drupalgap.settings.language +
						'&node[type]=' + encodeURIComponent(options.node.type) +
						'&node[title]=' + encodeURIComponent(options.node.title);
						/*'&node[body][' + drupalgap.settings.language + '][0][value]=' + 
						encodeURIComponent(options.node.body[drupalgap.settings.language][0].value);*/
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
					// TODO - this should assemble a node.content
					// variable with the body and fields. It should also
					// be a good opportunity for a hook to come in
					// and modify node.content if they want.
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
					api_options = drupalgap_chain_callbacks(drupalgap.services.node.retrieve.options, options);
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
	}, // <!-- node -->
	'drupalgap_content':{
		'content_types_user_permissions':{
			'options':{
				'type':'post',
				'path':'drupalgap_content/content_types_user_permissions.json',
				'success':function(data){
					
				},
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
			  drupalgap.views_datasource.options = drupalgap_api_default_options();
			  api_options = drupalgap_chain_callbacks(drupalgap.views_datasource.options, options);
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
  'node':{
	  'nid':null,
  }, // <!-- node -->
  'node_edit':{
	  'nid':null,
	  'type':null,
	  'destination':null,
  }, // <!-- node_edit -->
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
	return {
		'url':'',
		'type':'get',
		'async':true,
		'data':'',
		'dataType':'json',
		'endpoint':'drupalgap',
		'success':function(result){
			// TODO - this is a good spot for a hook, e.g. hook_drupalgap_api_postprocess
			$.mobile.hidePageLoadingMsg();
			if (drupalgap.settings.debug) {
				console.log(JSON.stringify(result));  
			} 
		},
		'error':function(jqXHR, textStatus, errorThrown){
			// TODO - this is a good spot for a hook, e.g. hook_drupalgap_api_postprocess
			$.mobile.hidePageLoadingMsg();
			console.log(JSON.stringify({
				"jqXHR":jqXHR,
				"textStatus":textStatus,
				"errorThrown":errorThrown,
			}));
			navigator.notification.alert(
				textStatus + ' (' + errorThrown + ')',
				function(){},
				'DrupalGap API Error',
				'OK'
			);
		},
	};
}

/**
 * Takes option set 2, grabs the success/error callback(s), if any, 
 * and appends them onto option set 1's callback(s), then returns
 * the newly assembled option set 1.
 */
function drupalgap_chain_callbacks(options_set_1, options_set_2) {
	if (options_set_2.success) {
		if (options_set_1.success) {
			if ($.isArray(options_set_1.success)) {
				$(options_set_1.success).add(options_set_2.success);
			}
			else {
				var success = [];
				success.push(options_set_1.success);
				success.push(options_set_2.success);
				options_set_1.success = success;
			}
		}
		else {
			options_set_1.success = options_set_2.success;
		}
	}
	if (options_set_2.error) {
		if (options_set_1.error) {
			if ($.isArray(options_set_1.error)) {
				$(options_set_1.error).add(options_set_2.error);
			}
			else {
				var error = [];
				error.push(options_set_1.error);
				error.push(options_set_2.error);
				options_set_1.error = error;
			}
		}
		else {
			options_set_1.error = options_set_2.error;
		}
	}
	return options_set_1;
}