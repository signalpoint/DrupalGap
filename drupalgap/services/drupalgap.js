// global variables used to hold the latest drupalgap system resource call results
var drupalgap_services_system_site_settings_result;

var drupalgap_services_resource_system_connect = {

	"resource_path":"drupalgap_system/connect.json",
	"resource_type":"post",
	
	/**
	 * Makes a Service call to DrupalGap's System Connect resource.
	 *
	 * @return
	 *   A JSON object containing system connect, site settings, and user roles and permissions.
	 */
	"resource_call":function(caller_options) {
		
		try {
			
			// When was the last system connect time created?
			last_system_connect_time = this.last_system_connect_time();
			
			// Set up resource defaults. (These cannot be overridden).
			options = {
				"resource_path":this.resource_path,
				"type":this.resource_type,
				"async":true,
				"success":this.success,
				"error":this.error
			};
			
			// Attach error/success hooks if provided.
			if (caller_options.error) {
				options.hook_error = caller_options.error;
			}
			if (caller_options.success) {
				options.hook_success = caller_options.success;
			}
			
			// Send along the last system connect time, if there was one.
			options.data = "";
			if (last_system_connect_time) {
				console.log("sending along system connect (" + last_system_connect_time + ")");
				options.data += "created=" + last_system_connect_time;
			}
			else {
				console.log("NOT sending along system connect (" + last_system_connect_time + ")");
			}
			
			// Make the service call.
			drupalgap_services.resource_call(options);
		}
		catch (error) {
			console.log("drupalgap_services_resource_system_connect");
			console.log(error);
		}
		// Return the result.
		return this.resource_result;
	},
	
	"error":function (jqXHR, textStatus, errorThrown) {
		if (errorThrown) {
			alert(errorThrown);
		}
		else {
			alert(textStatus);
		}
	},
	
	"success":function (data) {
		// Service call was successful...
		
		// Extract the DrupalGap system connect result.
		drupalgap_services_resource_system_connect_success(data);
	},
	
	"local_storage_remove":function() {
		type = this.resource_type;
		resource_path = this.resource_path;
		key = drupalgap_services_default_local_storage_key(type,resource_path);
		window.localStorage.removeItem(key);
		console.log("Removed from local storage (" + key + ")");
	},
	
	"last_system_connect_time":function() {
		// When did the last drupalgap system connect occur, if ever?
		type = this.resource_type;
		resource_path = this.resource_path;
		local_storage_key = drupalgap_services_default_local_storage_key(type, resource_path);
		last_system_connect_time = window.localStorage.getItem(local_storage_key);
		if (last_system_connect_time) {
			last_system_connect_time = JSON.parse(last_system_connect_time);
			if (last_system_connect_time.created) {
				return last_system_connect_time.created;
			}
		}
		return null;
	},
};

// This function is to be used only during success call backs by bundled
// service resources as a way to pull out and populate global variables.
function drupalgap_services_resource_system_connect_success (data) {
	
	// Save a copy of the current user.
	drupalgap_user = data.system_connect.user
	
	// Make sure authenticated user's account is active.
	if (drupalgap_user.uid != 0 && drupalgap_user.status != 1) {
		// TODO - this alert doesn't work... the forced logout seems to work though...
		alert("The username " + drupalgap_user.name + " has not been activated or is blocked.");
		drupalgap_services_user_logout();
	}
	else {
		// Extract the current user's roles and permissions.
		drupalgap_user_roles_and_permissions = data.user_roles_and_permissions;

		// Extract the site_settings from the resource result.
		drupalgap_site_settings = data.site_settings;
		
		// Extract the content types list.
		drupalgap_content_types_list = data.content_types_list;
		
		// Extract the content type's user permissions.
		drupalgap_content_types_user_permissions = data.content_types_user_permissions;
		
		// TODO - this resource also needs some way to indicate what local storage items need
		// to be cleared if they have been updated on the drupal site... perhaps send along
		// the last time the system connect (or something else) was performed and then
		// send back a list of nodes/comments/etc ids to remove from local storage. 
	}
	
}


/**
 * Makes a synchronous call to DrupalGap's system site settings resource.
 *   
 * @return
 *   The result of the service call, FALSE otherwise.
 */
function drupalgap_services_system_site_settings () {
	try {
		options = {"resource_path":"drupalgap_system/site_settings.json"};
		drupalgap_services_system_site_settings_result = drupalgap_services.resource_call(options);
		return drupalgap_services_system_site_settings_result;
	}
	catch (error) {
		console.log("drupalgap_services_system_site_settings");
		console.log(error);
	}
	return FALSE;
}

// This is a DrupalGap bundled service resource, it performs a user login resource
// and the bundled DrupalGap system connect service resource in one call to the
// server.
var drupalgap_services_drupalgap_user_login = {
		
	"resource_path":"drupalgap_user/login.json",
	"resource_type":"post",
	
	/**
	 * Makes a call to DrupalGap's User Login Service Resource. 
	 *
	 * @param options.name
	 *   A string containing the drupal user name.
	 * @param options.pass
	 *   A string containing the drupal user password.
	 */
	"resource_call":function (caller_options) {
		try {
			if (!caller_options.name || !caller_options.pass) { return false; }
			
			// Build service call options.
			data = 'username=' + encodeURIComponent(caller_options.name);
			data += '&password=' + encodeURIComponent(caller_options.pass);
			options = {
				"resource_path":this.resource_path,
				"data":data,
				"async":true,
				"success":this.success,
				"error":this.error
			};
			
			// Attach error/success hooks if provided.
			if (caller_options.error) {
				options.hook_error = caller_options.error;
			}
			if (caller_options.success) {
				options.hook_success = caller_options.success;
			}
			
			// Make the service call.
			drupalgap_services.resource_call(options);
		}
		catch (error) {
			console.log("drupalgap_services_drupalgap_user_login");
			console.log(error);
		}
	},
	
	"error":function (jqXHR, textStatus, errorThrown) {
		if (errorThrown) {
			alert(errorThrown);
		}
		else {
			alert(textStatus);
		}
	},
	
	"success":function (data) {
		// Extract the DrupalGap system connect result.
		drupalgap_services_resource_system_connect_success(data.drupalgap_system_connect);
	},
};

var drupalgap_services_drupalgap_user_logout = {
		
	"resource_path":"drupalgap_user/logout.json",
	"resource_type":"post",
	
	/**
	 * Makes a synchronous call to Drupal's User Logout Service Resource. 
	 *   
	 * @return
	 *   TRUE if the logout was successful, false otherwise.
	 */
	"resource_call":function (caller_options) {
		try {
			
			// Build the service call options.
			//, "save_to_local_storage":"0"
			options = {
				"resource_path":this.resource_path,
				"async":true,
				"success":this.success,
				"error":this.error
			};
			
			// Attach error/success hooks if provided.
			if (caller_options.error) {
				options.hook_error = caller_options.error;
			}
			if (caller_options.success) {
				options.hook_success = caller_options.success;
			}
			
			// Make the service call.
			drupalgap_services.resource_call(options);
		
		}
		catch (error) {
			console.log("drupalgap_services_user_logout - " + error);
			alert("drupalgap_services_user_logout - " + error);	
		}
	},
	
	"error":function (jqXHR, textStatus, errorThrown) {
		if (errorThrown) {
			alert(errorThrown);
		}
		else {
			alert(textStatus);
		}
	},
	
	"success":function (data) {
		// Extract the DrupalGap system connect result.
		drupalgap_services_resource_system_connect_success(data.drupalgap_system_connect);
	},
	
};

var drupalgap_services_drupalgap_user_register = {
	"resource_path":"drupalgap_user/register.json",
	"resource_type":"post",
	"resource_call":function(caller_options) {
		try {
		
			// validate input
			if (!caller_options.name) {
				alert("drupalgap_services_drupalgap_user_register - name empty");
				return false;
			}
			if (!caller_options.mail) {
				alert("drupalgap_services_drupalgap_user_register - mail empty");
				return false;
			}
			if (!caller_options.pass) {
				alert("drupalgap_services_drupalgap_user_register - pass empty");
				return false;
			}
			
			// Build the options for the service call.
			data = 'name=' + encodeURIComponent(caller_options.name);
			data += '&mail=' + encodeURIComponent(caller_options.mail);
			data += '&pass=' + encodeURIComponent(caller_options.pass);
			//, "save_to_local_storage":"0"
			options = {
				"resource_path":this.resource_path,
				"data":data,
				"async":true,
				"success":this.success,
				"error":this.error
			};
			
			// Attach error/success hooks if provided.
			if (caller_options.error) {
				options.hook_error = caller_options.error;
			}
			if (caller_options.success) {
				options.hook_success = caller_options.success;
			}
			
			// Make the service call.
			drupalgap_services.resource_call(options);
		}
		catch (error) {
			console.log("drupalgap_services_drupalgap_user_register");
			console.log(error);	
		}
	},
	
	"error":function (jqXHR, textStatus, errorThrown) {
		if (errorThrown) {
			alert(errorThrown);
		}
		else {
			alert(textStatus);
		}
	},
	
	"success":function (data) {
		// Extract the DrupalGap system connect result.
		drupalgap_services_resource_system_connect_success(data.drupalgap_system_connect);
	},
};