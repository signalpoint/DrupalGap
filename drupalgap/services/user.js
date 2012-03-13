// Define global variables to hold the latest resource call result json.
var drupalgap_services_user_access_result;
var drupalgap_services_user_roles_and_permissions_result;

// TODO - We need a user retrieve service resource implementation here.


var drupalgap_services_user_login = {
	
	"resource_path":"user/login.json",
	"resource_type":"post",
	
	/**
	 * Makes a call to Drupal's User Login Service Resource. 
	 *
	 * @param options.name
	 *   A string containing the drupal user name.
	 * @param options.pass
	 *   A string containing the drupal user password.
	 */
	"resource_call":function (caller_options) {
		try {
			if (!caller_options.name || !caller_options.pass) { return false; }
			
			// Build service call data string.
			data = 'username=' + encodeURIComponent(caller_options.name);
			data += '&password=' + encodeURIComponent(caller_options.pass);
			
			// Build service call options.
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
			console.log("drupalgap_services_user_login");
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
	},
};

var drupalgap_services_user_logout = {
	
	"resource_path":"user/logout.json",
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
	},
	
};

var drupalgap_services_user_update = {
		
	"resource_path":function(options) {
		// TODO - Need uid validation here.
		return "user/" + options.uid + ".json";
	},
	"resource_type":"put",
	
	/**
	 * Makes a synchronous call to Drupal's User Logout Service Resource. 
	 *   
	 * @return
	 *   TRUE if the logout was successful, false otherwise.
	 */
	"resource_call":function (caller_options) {
		try {
		
			drupalgap_services_user_update_result = null; // clear previous call
			
			if (!caller_options.user) {
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
			data += "name=" + encodeURIComponent(caller_options.user.name);
			data += "&mail=" + encodeURIComponent(caller_options.user.mail);
			
			if (caller_options.user.current_pass)
				data += "&current_pass=" + encodeURIComponent(caller_options.user.current_pass);
			// TODO - get change password working... (not sure this option is even provided by the services user update resouce)
			/*if (caller_options.user.pass1)
				data += "&account[pass1]=" + encodeURIComponent(caller_options.user.pass1);
			if (caller_options.user.pass2)
				data += "&account[pass2]=" + encodeURIComponent(caller_options.user.pass2);*/
			
			// Build the service resource call options.
			//, "save_to_local_storage":"0"
			options = {
				"resource_path":this.resource_path(caller_options.user),
				"data":data,
				"type":this.resource_type,
				"async":true,
				"error":this.error,
				"success":this.success,
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
			
			// make another call to system connect to refresh global variables if there wasn't any problems
			/*if (!drupalgap_services_user_update_result.errorThrown) {
				// Make another call to system connect to refresh global variables.
				// TODO - this is a nested service resource call, ideally we should
				// create a custom drupalgap user update resource that bundles up 
				// the drupalgap system connect in the results as well.
				//drupalgap_services_resource_system_connect.resource_call({});
			}
			
			//return drupalgap_services_user_update_result;
			*/
		}
		catch (error) {
			console.log("drupalgap_services_user_update");
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
	},
};


/*function drupalgap_services_user_update (user) {
	
	return false; // if it made it this fair, the user update call failed
}*/

var drupalgap_services_user_register = {
	"resource_path":"user/register.json",
	"resource_type":"post",
	"resource_call":function(caller_options) {
		try {
		
			// validate input
			if (!caller_options.name) {
				alert("drupalgap_services_user_register - name empty");
				return false;
			}
			if (!caller_options.mail) {
				alert("drupalgap_services_user_register - mail empty");
				return false;
			}
			if (!caller_options.pass) {
				alert("drupalgap_services_user_register - pass empty");
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
			console.log("drupalgap_services_user_register");
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
	},
};

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
				drupalgap_services_user_access_result = drupalgap_services.resource_call({"resource_path":resource_path,"data":data});
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
			options = {"resource_path":resource_path,"data":data};
			drupalgap_services_user_roles_and_permissions_result = drupalgap_services.resource_call(options);
		}
	}
	catch (error) {
		console.log("drupalgap_services_user_roles_and_permissions");
		console.log(error);	
	}
	return drupalgap_services_user_roles_and_permissions_result;
}