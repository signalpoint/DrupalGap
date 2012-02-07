// global variables used to hold the latest system resource call results
var drupalgap_services_system_connect_result; 
var drupalgap_services_system_get_variable_result;
var drupalgap_services_system_site_settings_result;

/**
 * Makes a synchronous call to Drupal's System Connect Service Resource.
 *
 * @return
 *   A JSON object containing information about the drupal user who made the service call, and NULL if the service call failed.
 */
function drupalgap_services_system_connect () {
	
	/* // here is an example system connect result json if the user not authenticated (anonymous)
	 * {
	 *   "sessid":"random-session-id",
	 *   "user":{
	 *     "uid":0,
	 *     "hostname":"127.0.0.1",
	 *     "roles":{
	 *       "1":"anonymous user"
	 *     },
	 *     "cache":0
	 *   }
	 * }

	 * // here is an example system connect result json if the user is authenticated
	  {
		"sessid":"random-session-id",
		"user":{
		  "uid":"1",
		  "name":"admin",
		  "pass":"md5-hashed-string",
		  "mail":"admin@example.com",
		  "theme":"",
		  "signature":"",
		  "signature_format":null,
		  "created":"1327358991",
		  "access":"1327446430",
		  "login":"1327446430",
		  "status":"1",
		  "timezone":"America/New_York",
		  "language":"",
		  "picture":"0",
		  "init":"admin@example.com",
		  "data":false,
		  "sid":"same-random-session-id-as-above",
		  "ssid":"",
		  "hostname":"127.0.0.1",
		  "timestamp":"1327446430",
		  "cache":"0",
		  "session":"",
		  "roles":{
		    "2":"authenticated user",
		    "3":"administrator"
		  }
	    }
	  }
	*/
	
	
	
	
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
				// @todo - this alert doesn't work... the forced logout seems to work though...
				alert("The username " + drupalgap_user.name + " has not been activated or is blocked.");
				drupalgap_services_user_logout();
			}
			else {
				// load drupalgap system settings (WARNING: this is a nested service call, need to figure out a way to bundle this
				// into one call and setup some caching and expiration feature layer on top of the main service resource call function
				// that utilizes local storage!)
				drupalgap_site_settings = drupalgap_services_system_site_settings();
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
