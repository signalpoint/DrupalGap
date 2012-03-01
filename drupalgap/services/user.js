// define global variables to hold the latest service resource call result json
var drupalgap_services_user_login_result;
var drupalgap_services_user_logout_result;
var drupalgap_services_user_update_result;
var drupalgap_services_user_register_result;
var drupalgap_services_user_access_result;
var drupalgap_services_user_roles_and_permissions_result;

// TODO - the user login resource should be extended (just like system connect)
// and bundle up the logged in user's settings/roles/permissions during the service
// call. This will need a new drupalgap_user login resource in the module.
// That way, when we login a user, it doesn't need to perform the
// subsequent system connect resource call that is currently in place.

// TODO - We need a user retrieve service resource implementation here.

/**
 * Makes a synchronous call to Drupal's User Login Service Resource. 
 *
 * @param name
 *   A string containing the drupal user name.
 * @param pass
 *   A string containing the drupal user password.
 *   
 * @return
 *   TRUE if the login is successful, false otherwise.
 */
function drupalgap_services_user_login (name, pass) {
	try {
		if (!name || !pass) { return false; }
		
		// Make the service call.
		resource_path = "user/login.json";
		data = 'username=' + encodeURIComponent(name) + '&password=' + encodeURIComponent(pass);
		options = {"resource_path":resource_path,"data":data,"save_to_local_storage":"0"};
		drupalgap_services_user_login_result = drupalgap_services_resource_call(options);
		
		if (drupalgap_services_user_login_result.errorThrown) { return false; }
		else {
			// Make another call to system connect to refresh global variables.
			// TODO - this is a nested service resource call, ideally we should
			// create a custom drupalgap user login resource that bundles up 
			// the drupalgap system connect in the results as well.
			//drupalgap_services_resource_system_connect();
			drupalgap_services_resource_system_connect.resource_call();
			return true;
		}
	}
	catch (error) {
		console.log("drupalgap_services_user_login");
		console.log(error);
	}
	return false; // if it made it this fair, the user login call failed
}

/**
 * Makes a synchronous call to Drupal's User Logout Service Resource. 
 *   
 * @return
 *   TRUE if the logout was successful, false otherwise.
 */
function drupalgap_services_user_logout () {
	try {
		
		// make the service call
		options = {"resource_path":"user/logout.json", "save_to_local_storage":"0"};
		drupalgap_services_user_logout_result = drupalgap_services_resource_call(options);
		
		if (drupalgap_services_user_logout_result.errorThrown) { return false; }
		else {
			// Make another call to system connect to refresh global variables.
			// TODO - this is a nested service resource call, ideally we should
			// create a custom drupalgap user logout resource that bundles up 
			// the drupalgap system connect in the results as well.
			//drupalgap_services_resource_system_connect();
			drupalgap_services_resource_system_connect.resource_call();
			return true;
		}
	
	}
	catch (error) {
		console.log("drupalgap_services_user_logout - " + error);
		alert("drupalgap_services_user_logout - " + error);	
	}
	return false; // if it made it this fair, the user logout call failed
}

function drupalgap_services_user_update (user) {
	try {
		
		drupalgap_services_user_update_result = null; // clear previous call
		
		if (!user) {
			// TODO - do a better job validating incoming user...
			console.log("drupalgap_services_user_update - user empty");
			return false;
		}
		
		// TODO - implement user name change (if they have permission) and password changing
		
		// make the service call depending on what they're doing to their account...
		
		// drupal user form input names
		// user.current_pass
		// user.pass1
		// user.pass2
		
		// working example to change name & e-mail, by providing current password
		// name=foobar&mail=new.email.for%40foobar.com&current_pass=12345678
		
		// add name and e-mail to resource call data
		data = "";
		data += "name=" + encodeURIComponent(user.name);
		data += "&mail=" + encodeURIComponent(user.mail);
		
		if (user.current_pass)
			data += "&current_pass=" + encodeURIComponent(user.current_pass);
		// @todo - get change password working... (not sure this option is even provided by the services user update resouce)
		/*if (user.pass1)
			data += "&account[pass1]=" + encodeURIComponent(user.pass1);
		if (user.pass2)
			data += "&account[pass2]=" + encodeURIComponent(user.pass2);*/
		
		options = {"resource_path":"user/" + user.uid + ".json", "data":data, "type":"put", "save_to_local_storage":"0"};
		drupalgap_services_user_update_result = drupalgap_services_resource_call(options);
		
		// make another call to system connect to refresh global variables if there wasn't any problems
		if (!drupalgap_services_user_update_result.errorThrown) {
			// Make another call to system connect to refresh global variables.
			// TODO - this is a nested service resource call, ideally we should
			// create a custom drupalgap user update resource that bundles up 
			// the drupalgap system connect in the results as well.
			//drupalgap_services_resource_system_connect();
			drupalgap_services_resource_system_connect.resource_call();
		}
		
		return drupalgap_services_user_update_result;
	}
	catch (error) {
		console.log("drupalgap_services_user_update");
		console.log(error);
	}
	return false; // if it made it this fair, the user update call failed
}

function drupalgap_services_user_register (name,mail,pass) {
	
	try {
		
		// validate input
		if (!name) {
			alert("drupalgap_services_user_register - name empty");
			return false;
		}
		if (!mail) {
			alert("drupalgap_services_user_register - mail empty");
			return false;
		}
		if (!pass) {
			alert("drupalgap_services_user_register - pass empty");
			return false;
		}
		
		// make the service call
		data = 'name=' + encodeURIComponent(name) + '&mail=' + encodeURIComponent(mail) + '&pass=' + encodeURIComponent(pass);
		options = {"resource_path":"user/register.json", "data":data, "save_to_local_storage":"0"};
		drupalgap_services_user_register_result = drupalgap_services_resource_call(options);
		
		// Make another call to system connect to refresh global variables.
		// TODO - this is a nested service resource call, ideally we should
		// create a custom drupalgap user register resource that bundles up 
		// the drupalgap system connect in the results as well.
		//drupalgap_services_resource_system_connect();
		drupalgap_services_resource_system_connect.resource_call();
		
		return drupalgap_services_user_register_result;
	}
	catch (error) {
		console.log("drupalgap_services_user_register");
		console.log(error);	
	}
	return false; // if it made it this fair, the user register call failed
}

function drupalgap_services_user_access(options) {
	try {
		// Clear the previous call.
		drupalgap_services_user_access_result = false;
		
		// Validate the input.
		if (!options.permission) {
			alert("drupalgap_services_user_access - no permission provided");
			return false;
		}
		
		// If we have the user's roles and permissions already stored from
		// a call to drupalgap system connect, iterate over the collection
		// to see if the user has access to the permission.
		if (drupalgap_user_roles_and_permissions) {
			$.each(drupalgap_user_roles_and_permissions,function(index,object){
				if (object.permission == options.permission) {
					drupalgap_services_user_access_result = true;
					return;
				}
			});
		}
		else {
			// We did not have the user's roles and permissions stored, make
			// a call to the drupalgap user access resource to see if the user
			// has the requested permission.
			if (valid) {
				resource_path = "drupalgap_user/access.json";
				data = 'permission=' + encodeURIComponent(options.permission);
				drupalgap_services_user_access_result = drupalgap_services_resource_call({"resource_path":resource_path,"data":data});
			}
		}
	}
	catch (error) {
		console.log("drupalgap_services_user_access");
		console.log(error);	
	}
	return drupalgap_services_user_access_result;
}

function drupalgap_services_user_roles_and_permissions(uid) {
	try {
		
		// Clear the previous call.
		drupalgap_services_user_roles_and_permissions_result = null;
		
		// Validate the user id.
		valid = true;
		if (!uid) {
			valid = false;
			alert("drupalgap_services_user_roles_and_permissions - no user id provided");
		}
		
		if (valid) {
			// Make the service call.
			resource_path = "drupalgap_user/roles_and_permissions.json";
			data = 'uid=' + encodeURIComponent(uid);
			drupalgap_services_user_roles_and_permissions_result = drupalgap_services_resource_call({"resource_path":resource_path,"data":data});
		}
	}
	catch (error) {
		console.log("drupalgap_services_user_roles_and_permissions");
		console.log(error);	
	}
	return drupalgap_services_user_roles_and_permissions_result;
}