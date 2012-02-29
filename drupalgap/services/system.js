// global variables used to hold the latest system resource call results
//var drupalgap_services_system_connect_result; 
var drupalgap_services_system_get_variable_result;

var drupalgap_services_system_connect = {
		
		"resource_path":"system/connect.json",
		"resource_type":"post",
		"resource_result":"",
		
		/**
		 * Makes a Service call to Drupal's System Connect resource.
		 *
		 * @return
		 *   A JSON object containing information about the drupal user who made the service call, and NULL if the service call failed.
		 */
		"resource_call":function() {
			
			try {
				
				this.resource_result = drupalgap_services_resource_call({"resource_path":this.resource_path});
				
				if (this.resource_result.textStatus == "error") { // there was a problem connecting...
					if (this.resource_result.errorThrown) {
						alert(this.resource_result.errorThrown);
					}
					else {
						alert(this.resource_result.textStatus);
					}
				}
				else { // the connect was successful...
					// save a copy of the current user
					drupalgap_user = this.resource_result.user;
					// make sure authenticated user's account is active
					if (drupalgap_user.uid != 0 && drupalgap_user.status != 1) {
						// TODO - this alert doesn't work... the forced logout seems to work though...
						alert("The username " + drupalgap_user.name + " has not been activated or is blocked.");
						drupalgap_services_user_logout();
					}
				}
			}
			catch (error) {
				console.log("drupalgap_services_system_connect.resource_call");
				console.log(error);
			}
			return this.resource_result;
		},
};

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