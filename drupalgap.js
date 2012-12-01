var drupalgap = {
  'settings':{
    'site_path':'http://10.0.2.2/mobile.lib.umich.edu',
    'base_path':'/',
    'debug':true,
  },
  'user':{},
  'api':{
	  'options':{
		  'url':'',
		  'type':'get',
		  'async':true,
		  'data':'',
		  'dataType':'json',
		  'endpoint':'drupalgap',
		  'error':function(jqXHR, textStatus, errorThrown){
			  if (drupalgap.settings.debug) {
				  console.log(JSON.stringify({
					"jqXHR":jqXHR,
					"textStatus":textStatus,
					"errorThrown":errorThrown,
				  }));  
			  }
			  navigator.notification.alert(
			    errorThrown,
				function(){},
				'Error',
				'OK'
		     );
		  },
		  'success':function(result){
			  if (drupalgap.settings.debug) {
				  console.log(JSON.stringify(result));  
			  }  
		  },
	  },
	  'call':function(options){
		  try {
			  
			  // Get the default api options, then adjust them to make the call to Drupal
			  api_options = drupalgap.api.options;
			  if (options.type) { api_options.type = options.type; }
			  if (options.async) { api_options.async = options.async; }
			  if (options.data) { api_options.data = options.data; }
			  if (options.dataType) { api_options.dataType = options.dataType; }
			  if (options.endpoint) { api_options.endpoint = options.endpoint; }
			  
			  // Build the Drupal URL path to call.
			  api_options.url = drupalgap.settings.site_path + drupalgap.settings.base_path + '?q=';
			  if (api_options.endpoint) {
				  api_options.url += api_options.endpoint + '/';
			  }
			  api_options.url += options.path;
			  
			  if (drupalgap.settings.debug) {
				  console.log(api_options.url);
				  console.log(api_options);
			  }
			  
			  // Make the call.
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
			  else {
				navigator.notification.alert(
					'Only async calls are supported for now!',
					function(){},
					'Error',
					'OK'
				);
			  }
		  }
		  catch (error) {
			navigator.notification.alert(
				error,
				function(){},
				'Error',
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
				'path':'drupalgap_system/connect.json',
			},
			'call':function(){
				options = drupalgap.services.system.connect.options;
				options.success = function(){};
				drupalgap.api.call(options);
			}
		},
	}  
  },
};

/**
 * 
 */
function drupalgap_onload() {
	document.addEventListener("deviceready", drupalgap_deviceready, false);
}

/**
 * Cordova is loaded and it is now safe to make calls Cordova methods.
 */
function drupalgap_deviceready() {
	// Check device connection.
	if (drupalgap_check_connection() == 'No network connection') {
		// Device is offline.
		navigator.notification.alert(
		    'No network connection!',
		    function(){},
		    'Offline',
		    'OK'
		);
	}
	else {
		// Device is online, let's make a call to the System Connect Service
		// Resource.
		drupalgap.services.system.connect.call();
		
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
