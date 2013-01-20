var drupalgap = {
  'user':{
	  'uid':0, /* do not change this user id value */
	  'name':'Anonymous',
  },
  'online':false,
  'destination':'',
  'account':{ }, /* <!-- account --> */
  'account_edit':{ }, /* <!-- account_edit --> */
  'node':{ }, /* <!-- node --> */
  'node_edit':{ }, /* <!-- node_edit --> */
  'comment':{ }, /* <!-- comment --> */
  'comment_edit':{ }, /* <!-- comment_edit --> */
  'taxonomy_term':{ }, /* <!-- taxonomy_term -> */
  'taxonomy_term_edit':{ }, /* <!-- taxonomy_term_edit -> */
  'taxonomy_vocabulary':{ }, /* <!-- taxonomy_vocabulary -> */
  'taxonomy_vocabulary_edit':{ }, /* <!-- taxonomy_vocabulary_edit -> */
  'api':{}, // <!-- api -->
  'services':{}, // <!-- services -->
  'views_datasource':{}, // <!-- views_datasource -->
}; // <!-- drupalgap -->

/**
 * 
 */
function drupalgap_onload() {
	// Add device ready listener.
	document.addEventListener("deviceready", drupalgap_deviceready, false);
}

/**
 * Cordova is loaded and it is now safe to make calls to Cordova methods.
 */
function drupalgap_deviceready() {
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
	// Load up modules.
	if (drupalgap.modules != null && drupalgap.modules.length != 0) {
		console.log(JSON.stringify(drupalgap.modules));
		$.each(drupalgap.modules, function(bundle, modules){
			console.log(bundle);
			console.log(JSON.stringify(modules));
			$.each(modules, function(index, module){
				alert(module.name);
				// Determine module directory.
				dir = '';
				if (bundle != 'core') { dir = bundle + '/'; }
				module_base_path = 'DrupalGap/modules/' + dir + module.name;
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
					    		console.log(modules_paths_object);
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
	// Check device connection.
	drupalgap_check_connection();
	if (!drupalgap.online) {
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
		// Device is online, let's make a call to the
		// DrupalGap System Connect Service Resource.
		drupalgap.services.drupalgap_system.connect.call({
			'success':function(result){
				//drupalgap_module_invoke_all('device_connected');
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
	if (options.comment.nid) {
		data += '&nid=' + encodeURIComponent(options.comment.nid);
	}
	if (options.comment.cid) {
		data += '&cid=' + encodeURIComponent(options.comment.cid);
	}
	if (options.comment.subject) {
		data += '&subject=' + encodeURIComponent(options.comment.subject);
	}
	if (options.comment.body) {
		data += '&comment_body[' + drupalgap.settings.language +'][0][value]=' +
			encodeURIComponent(options.comment.body);
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
		if (options.permission == null) {
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
