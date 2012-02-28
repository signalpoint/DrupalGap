// global variables used to hold the latest drupalgap system resource call results
var drupalgap_services_resource_system_connect_result;
var drupalgap_services_system_site_settings_result;

// TODO - the new local storage layer being used with node/comment c.r.u.d.
// and views json, should be abstracted onto another layer of functionality
// for the default service resource call function, there is too much duplicate code
// being generated for the local storage management of resource results.
// It also needs some kind of expiration mechanism, which should probably listen
// to whatever Drupal cache settings are enabled.

/**
 * Makes a Service call to DrupalGap's System Connect resource.
 *
 * @return
 *   A JSON object containing system connect, site settings, and user roles and permissions.
 */
function drupalgap_services_resource_system_connect () {
	
	try {
		
		// Clear the last service call.
		drupalgap_services_resource_system_connect_result = null;
		
		// Make the service Call.
		var resource_path = "drupalgap_system/connect.json";
		result = drupalgap_services_resource_call({"resource_path":resource_path});
		
		if (result.textStatus == "error") {
			if (result.errorThrown) {
				alert(result.errorThrown);
			}
			else {
				alert(result.textStatus);
			}
		}
		else {
			
			// Service call was successful...
			
			// Save a copy of the current user.
			drupalgap_user = result.system_connect.user
			
			// Make sure authenticated user's account is active.
			if (drupalgap_user.uid != 0 && drupalgap_user.status != 1) {
				// TODO - this alert doesn't work... the forced logout seems to work though...
				alert("The username " + drupalgap_user.name + " has not been activated or is blocked.");
				drupalgap_services_user_logout();
			}
			else {
				// Extract the current user's roles and permissions.
				drupalgap_user_roles_and_permissions = result.user_roles_and_permissions;

				// Extract the site_settings from the resource result.
				drupalgap_site_settings = result.site_settings;
				
				// Extract the content types list.
				drupalgap_content_types_list = result.content_types_list;
				
				// Extract the content type's user permissions.
				drupalgap_content_types_user_permissions = result.content_types_user_permissions;
				
				// TODO - this resource also needs some way to indicate what local storage items need
				// to be cleared if they have been updated on the drupal site... perhaps send along
				// the last time the system connect (or something else) was performed and then
				// send back a list of nodes/comments/etc ids to remove from local storage. 
			}
		}
	    
		// Return the result.
		drupalgap_services_resource_system_connect_result = result;
		return drupalgap_services_resource_system_connect_result;
	}
	catch (error) {
		console.log("drupalgap_services_resource_system_connect");
		console.log(error);
	}
	console.log(JSON.stringify(drupalgap_services_system_connect_result));
	return drupalgap_services_system_connect_result;
}


/**
 * Makes an synchronous call to DrupalGap's system site settings resource.
 *   
 * @return
 *   The result of the service call, FALSE otherwise.
 */
function drupalgap_services_system_site_settings () {
	try {
		drupalgap_services_system_site_settings_result = drupalgap_services_resource_call({"resource_path":"drupalgap_system/site_settings.json"});
		return drupalgap_services_system_site_settings_result;
	}
	catch (error) {
		console.log("drupalgap_services_system_site_settings");
		console.log(error);
	}
	return FALSE;
}