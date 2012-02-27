// global variables used to hold the latest system resource call results
var drupalgap_services_system_connect_result; 
var drupalgap_services_system_get_variable_result;

/**
 * Makes a Service call to Drupal's System Connect resource.
 *
 * @return
 *   A JSON object containing information about the drupal user who made the service call, and NULL if the service call failed.
 */
function drupalgap_services_system_connect () {
	try {
		// make the service call
		drupalgap_services_system_connect_result = drupalgap_services_resource_call({"resource_path":"system/connect.json"});
		
		if (drupalgap_services_system_connect_result.textStatus == "error") { // there was a problem connecting...
			if (drupalgap_services_system_connect_result.errorThrown) {
				alert(drupalgap_services_system_connect_result.errorThrown);
			}
			else {
				alert(drupalgap_services_system_connect_result.textStatus);
			}
		}
		else { // the connect was successful...
			// save a copy of the current user
			drupalgap_user = drupalgap_services_system_connect_result.user;
			// make sure authenticated user's account is active
			if (drupalgap_user.uid != 0 && drupalgap_user.status != 1) {
				// TODO - this alert doesn't work... the forced logout seems to work though...
				alert("The username " + drupalgap_user.name + " has not been activated or is blocked.");
				drupalgap_services_user_logout();
			}
			else {
				// load drupalgap system settings (WARNING: this is a nested service call, need to figure out a way to bundle this
				// into one call and setup some caching and expiration feature layer on top of the main service resource call function
				// that utilizes local storage!)
				
				// This has been moved to a bundled service call in services/drupalgap.js
				// drupalgap_site_settings = drupalgap_services_system_site_settings();
			}
		}
	    
		// return the result
		return drupalgap_services_system_connect_result;
	}
	catch (error) {
		console.log("drupalgap_services_system_connect");
		console.log(error);
	}
	return drupalgap_services_system_connect_result;
}

/**
 * Makes an synchronous call to Drupal's System Get Variable Resource.
 *
 * @param 
 *   name The name of the Drupal Variable to retrieve.
 *   
 * @return
 *   The value of the drupal variable, FALSE otherwise.
 */
function drupalgap_services_system_get_variable (name) {
	try {
		if (!name) { return false; }
		drupalgap_services_system_get_variable_result = drupalgap_services_resource_call({"resource_path":"system/get_variable.json","data":'name=' + encodeURIComponent(name)});
		return drupalgap_services_system_get_variable_result;
	}
	catch (error) {
		console.log("drupalgap_services_system_get_variable");
		console.log(error);
	}
	return FALSE;
}