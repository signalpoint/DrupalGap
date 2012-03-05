// global variables used to hold the latest drupalgap system resource call results
//var drupalgap_services_resource_system_connect_result;
var drupalgap_services_system_site_settings_result;

// TODO - the new local storage layer being used with node/comment c.r.u.d.
// and views json, should be abstracted onto another layer of functionality
// for the default service resource call function, there is too much duplicate code
// being generated for the local storage management of resource results.
// It also needs some kind of expiration mechanism, which should probably listen
// to whatever Drupal cache settings are enabled.

var drupalgap_services_resource_system_connect = {

	"resource_path":"drupalgap_system/connect.json",
	"resource_type":"post",
	"resource_result":"",
	
	/**
	 * Makes a Service call to DrupalGap's System Connect resource.
	 *
	 * @return
	 *   A JSON object containing system connect, site settings, and user roles and permissions.
	 */
	"resource_call":function(options) {
		
		try {
			
			// Clear the last resource result.
			this.resource_result = null;
			
			// When was the last system connect time created?
			last_system_connect_time = this.last_system_connect_time();
			
			// Set up resource defaults. (These cannot be overridden).
			options.resource_path = this.resource_path;
			options.type = this.resource_type;
			
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
			this.resource_result = drupalgap_services_resource_call(options);
			
			if (this.resource_result.textStatus == "error") {
				if (this.resource_result.errorThrown) {
					alert(this.resource_result.errorThrown);
				}
				else {
					alert(this.resource_result.textStatus);
				}
			}
			else {
				
				// Service call was successful...
				
				// Save a copy of the current user.
				drupalgap_user = this.resource_result.system_connect.user
				
				// Make sure authenticated user's account is active.
				if (drupalgap_user.uid != 0 && drupalgap_user.status != 1) {
					// TODO - this alert doesn't work... the forced logout seems to work though...
					alert("The username " + drupalgap_user.name + " has not been activated or is blocked.");
					drupalgap_services_user_logout();
				}
				else {
					// Extract the current user's roles and permissions.
					drupalgap_user_roles_and_permissions = this.resource_result.user_roles_and_permissions;
	
					// Extract the site_settings from the resource result.
					drupalgap_site_settings = this.resource_result.site_settings;
					
					// Extract the content types list.
					drupalgap_content_types_list = this.resource_result.content_types_list;
					
					// Extract the content type's user permissions.
					drupalgap_content_types_user_permissions = this.resource_result.content_types_user_permissions;
					
					// TODO - this resource also needs some way to indicate what local storage items need
					// to be cleared if they have been updated on the drupal site... perhaps send along
					// the last time the system connect (or something else) was performed and then
					// send back a list of nodes/comments/etc ids to remove from local storage. 
				}
				
			}
		}
		catch (error) {
			console.log("drupalgap_services_resource_system_connect");
			console.log(error);
		}
		// Return the result.
		return this.resource_result;
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


/**
 * Makes an synchronous call to DrupalGap's system site settings resource.
 *   
 * @return
 *   The result of the service call, FALSE otherwise.
 */
function drupalgap_services_system_site_settings () {
	try {
		options = {"resource_path":"drupalgap_system/site_settings.json"};
		drupalgap_services_system_site_settings_result = drupalgap_services_resource_call(options);
		return drupalgap_services_system_site_settings_result;
	}
	catch (error) {
		console.log("drupalgap_services_system_site_settings");
		console.log(error);
	}
	return FALSE;
}