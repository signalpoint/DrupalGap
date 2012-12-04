var drupalgap = {
  'settings':{
    'site_path':'http://10.0.2.2/mobile.lib.umich.edu', /* e.g. http://www.drupalgap.org */
    'base_path':'/',
    'debug':true, /* set to true to see console.log debug information */
  },
  'user':{
	  'uid':0, /* do not change this user id value */
	  'name':'Anonymous',
  },
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
			  if (options.endpoint) { api_options.endpoint = options.endpoint; }
			  
			  // Now assemble the callbacks together.
			  api_options = drupalgap_chain_callbacks(api_options, options);
			  
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
  },
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
		},
	},
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
		},
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
		},
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
		},
		'retrieve':{
			'options':{
				'type':'get',
				'path':'user/%uid.json',
				'success':function(data){
					
				},
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
		},
	},
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
		},
	},
  },
};

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
		    'You must specify a site path to your Drupal site in the drupalgap.js settings file!',
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
		$.mobile.changePage('dashboard.html');
	}
	else {
		// Device is online, let's make a call to the System Connect Service Resource.
		drupalgap.services.system.connect.call({
			'success':function(result){
				//$.mobile.changePage('dashboard.html');
				$.mobile.changePage('node_add.html');
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
			if (drupalgap.settings.debug) {
				console.log(JSON.stringify(result));  
			} 
		},
		'error':function(jqXHR, textStatus, errorThrown){
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