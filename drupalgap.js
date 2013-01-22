var drupalgap = {
  'modules':{
	  'core':[
	     {'name':'api'},
	     {'name':'comment'},
	     {'name':'entity'},
	     {'name':'field'},
	     {'name':'form'},
	     {'name':'node'},
	     {'name':'services',
	       'includes':[
		       {'name':'comment'},
		       {'name':'drupalgap_content'},
		       {'name':'drupalgap_system'},
		       {'name':'drupalgap_taxonomy'},
		       {'name':'drupalgap_user'},
		       {'name':'file'},
		       {'name':'node'},
		       {'name':'services'},
		       {'name':'system'},
		       {'name':'taxonomy_term'},
		       {'name':'taxonomy_vocabulary'},
		       {'name':'user'},
	       ]
	     },
	     {'name':'taxonomy'},
	     {'name':'user'},
	     {'name':'views_datasource'},
	   ]
  },
  'user':{
	  'uid':0, /* do not change this user id value */
	  'name':'Anonymous',
  },
  'online':false,
  'destination':'',
  'account':{ }, /* <!-- account --> */
  'account_edit':{ }, /* <!-- account_edit --> */
  'api':{}, // <!-- api -->
  'comment':{ }, /* <!-- comment --> */
  'comment_edit':{ }, /* <!-- comment_edit --> */
  'field_info_fields':{ }, /* <!-- field_info_fields --> */
  'field_info_instances':{ }, /* <!-- field_info_instances --> */
  'form':{ }, /* <!-- form --> */
  'form_state':{ }, /* <!-- form_state --> */
  'form_errors':{ }, /* <!-- form_errors --> */
  'node':{ }, /* <!-- node --> */
  'node_edit':{ }, /* <!-- node_edit --> */
  'services':{}, // <!-- services -->
  'taxonomy_term':{ }, /* <!-- taxonomy_term -> */
  'taxonomy_term_edit':{ }, /* <!-- taxonomy_term_edit -> */
  'taxonomy_vocabulary':{ }, /* <!-- taxonomy_vocabulary -> */
  'taxonomy_vocabulary_edit':{ }, /* <!-- taxonomy_vocabulary_edit -> */
  'views_datasource':{}, // <!-- views_datasource -->
}; // <!-- drupalgap -->

function drupalgap_add_js() {
	var data;
	if (arguments[0]) { data = arguments[0]; }
	jQuery.ajax({
	    async:false,
	    type:'GET',
	    url:data,
	    data:null,
	    success:function(){
	    	if (drupalgap.settings.debug) {
	    		// Print the js path to the console.
	    		console.log(data.replace(drupalgap.settings.modules_path + '/', ''));
	    	}
	    },
	    dataType:'script',
	    error: function(xhr, textStatus, errorThrown) {
	    	console.log('drupalgap_add_js - error');
	    	console.log(JSON.stringify(xhr));
	    	alert('drupalgap_add_js - (' + data + ' : ' + textStatus + ') ' + errorThrown);
	    }
	});
}

/**
 * Takes option set 2, grabs the success/error callback(s), if any, 
 * and appends them onto option set 1's callback(s), then returns
 * the newly assembled option set.
 */
function drupalgap_chain_callbacks(options_set_1, options_set_2) {
	
	//console.log(JSON.stringify(options_set_1));
	//console.log(JSON.stringify(options_set_2));
	
	// Setup the new options.
	var new_options_set = {};
	$.extend(true, new_options_set, options_set_1);
	
	// Chain the success callbacks.
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
	
	// Chain the error callbacks.
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
	
	// For all other variables in option set 2, add them to the new option set.
	$.each(options_set_2, function(index, object){
		if (index != 'success' && index != 'error') {
			new_options_set[index] = object;
		}
	});
	
	// Return the new option set.
	//console.log(JSON.stringify(new_options_set));
	return new_options_set;
}

function drupalgap_changePage(path) {
	$.mobile.changePage('file:///android_asset/www/' + path);
}

/**
 * Checks the devices connection and sets drupalgap.online to true if the
 * device has a connection, false otherwise.
 * @returns A string indicating the type of connection according to PhoneGap.
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
    
    if (states[networkState] == 'No network connection') {
    	drupalgap.online = false;
    }
    else {
    	drupalgap.online = true;
    }

    return states[networkState];
}

/**
 * Cordova is loaded and it is now safe to make calls to Cordova methods.
 */
function drupalgap_deviceready() {
	// Load up modules.
	drupalgap_modules_load();
	// Initialize entities.
	drupalgap_entity_get_info();
	// Verify site path is set.
	if (!drupalgap.settings.site_path || drupalgap.settings.site_path == '') {
		navigator.notification.alert(
		    'You must specify a site path to Drupal in the index.html file!',
		    function(){},
		    'Error',
		    'OK'
		);
		return false;
	}
	// Check device connection.
	drupalgap_check_connection();
	if (!drupalgap.online) {
		drupalgap_module_invoke_all('device_offine');
		// Device is off-line.
		navigator.notification.alert(
		    'No connection found!',
		    function(){ $.mobile.changePage(drupalgap.settings.offline); },
		    'Offline',
		    'OK'
		);
		return false;
	}
	else {
		// Implementations of hook_device_online().
		drupalgap_module_invoke_all('device_online');
		
		if (drupalgap_module_invoke_continue) {
			
			// Device is online, let's make a call to the
			// DrupalGap System Connect Service Resource.
			drupalgap.services.drupalgap_system.connect.call({
				'success':function(result){
					drupalgap_module_invoke_all('device_connected');
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
}

/**
 * 
 * @param count
 * @param singular
 * @param plural
 * @returns
 */
function drupalgap_format_plural(count, singular, plural) {
	if (count == 1) {
		return singular;
	}
	return plural;
}

/**
 * 
 * @param type
 * @param name
 */
function drupalgap_get_path(type, name) {
	var path = '';
	var found_it = false;
	if (type == 'module') {
		$.each(drupalgap.modules, function(bundle, modules){
			$.each(modules, function(index, module){
				if (name == module.name) {
					path = drupalgap.settings.modules_path + '/';
					if (bundle != 'core') { path += bundle + '/'; }
					path += module.name;
					found_it = true;
				}
				if (found_it) {
					return false;
				}
			});
			if (found_it) {
				return false;
			}
		});
	}
	return path;
}

/**
 * 
 * @param uri
 * @returns
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

function drupalgap_module_invoke(module, hook) {
  try {
    var module_arguments = Array.prototype.slice.call(arguments);
    if (drupalgap.modules[module]) {
      function_name = drupalgap.modules[module].name + '_' + hook;
      if (eval('typeof ' + function_name) == 'function') {
        // Get the hook function.
        var fn = window[function_name];
        // Remove the hook from the arguments.
        module_arguments.splice(0,1);
        // If there are no arguments, just call the hook directly, otherwise
        // call the hook and pass along all the arguments.
        if ($.isEmptyObject(module_arguments) ) { fn(); }
        else { fn.apply(null, module_arguments); }
      }
    }
  }
  catch (error) {
    alert('drupalgap_module_invoke - ' + error);
  }
  
}

var drupalgap_module_invoke_continue = null;
/**
 * 
 * @param hook
 */
function drupalgap_module_invoke_all(hook) {
  try {
    // Copy the arguments.
    var module_arguments = Array.prototype.slice.call(arguments);
    drupalgap_module_invoke_continue = true;
    // Try to fire the hook in every module.
    $.each(drupalgap.modules, function(bundle, modules){
      $.each(modules, function(index, module){
        function_name = module.name + '_' + hook;
        if (eval('typeof ' + function_name) == 'function') {
            if (drupalgap.settings.debug) {
              console.log('hook(): ' + function_name);
            }
            // Get the hook function.
            var fn = window[function_name];
            
            // Remove the hook from the arguments.
            module_arguments.splice(0,1);
            if (drupalgap.settings.debug) {
              console.log(JSON.stringify(module_arguments));
            }
            
            // If there are no arguments, just call the hook directly, otherwise
            // call the hook and pass along all the arguments.
            if ($.isEmptyObject(module_arguments) ) { fn(); }
            else { fn.apply(null, module_arguments); }
        }
        // Try to fire the hook in any includes for this module.
        /*if (module.includes != null && module.includes.length != 0) {
          $.each(module.includes, function(include_index, include_object){
            function_name = include_object.name + '_' + hook;
            if (typeof function_name == 'string' &&
                eval('typeof ' + function_name) == 'function') {
                  if (drupalgap.settings.debug) {
                    console.log('hook(): ' + function_name);
                  }
                  //eval(function_name+'();');
                  var fn = window[function_name];
                  console.log(JSON.stringify(module_arguments));
                  delete module_arguments[0];
                  console.log(JSON.stringify(module_arguments));
                  fn(module_arguments);
              }
          });
        }*/
      });
    });
  }
  catch (error) {
    alert('drupalgap_module_invoke_all - ' + error);
  }
}

/**
 * 
 */
function drupalgap_modules_load() {
	if (drupalgap.modules != null && drupalgap.modules.length != 0) {
		$.each(drupalgap.modules, function(bundle, modules){
			$.each(modules, function(index, module){
				// Determine module directory.
				dir = '';
				if (bundle != 'core') { dir = bundle + '/'; }
				module_base_path = drupalgap.settings.modules_path + '/' + dir + module.name;
				// Add module .js file to array of paths to load.
				module_path =  module_base_path + '/' + module.name + '.js';
				modules_paths = [module_path];
				// If there are any includes with this module, at them
				// to the list of paths to include.
				if (module.includes != null && module.includes.length != 0) {
					$.each(module.includes, function(include_index, include_object){
						modules_paths.push(module_base_path + '/' + include_object.name + '.js');
					});
				}
				// Now load all the paths for this module.
				$.each(modules_paths, function(modules_paths_index, modules_paths_object){
					jQuery.ajax({
					    async:false,
					    type:'GET',
					    url:modules_paths_object,
					    data:null,
					    success:function(){
					    	if (drupalgap.settings.debug) {
					    		// Print the module path to the console.
					    		console.log(modules_paths_object.replace(drupalgap.settings.modules_path + '/', ''));
					    	}
					    },
					    dataType:'script',
					    error: function(xhr, textStatus, errorThrown) {
					        // Look at the `textStatus` and/or `errorThrown` properties.
					    }
					});
				});
			});
		});
	}
}

/**
 * 
 */
function drupalgap_onload() {
	// Add device ready listener.
	document.addEventListener("deviceready", drupalgap_deviceready, false);
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
		if (options.permission == null) {
			alert("drupalgap_user_access - permission not provided");
			return false;
		}
		// User 1 always has permission.
		if (drupalgap.user.uid == 1) {
			return true;
		}
		// For everyone else, assume they don't have permission. Iterate over
		// drupalgap.user.permissions to see if the current user has the given
		// permission, then return the result.
		access = false;
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

$('.drupalgap_front').live('click', function(){
    drupalgap_changePage(drupalgap.settings.front);
});

