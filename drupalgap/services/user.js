// define global variables to hold the latest service resource call result json
var drupalgap_services_user_login_result;
var drupalgap_services_user_logout_result;
var drupalgap_services_user_update_result;
var drupalgap_services_user_register_result;
var drupalgap_services_user_access_result;
var drupalgap_services_user_roles_and_permissions_result;

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
	/* if the login is successful, the json result will be something like this:
	 * {
	 *   "sessid":"random-session-id-here",
	 *   "session_name":"random-session-name-here",
	 *   "user":{
	 *     "uid":"1",
	 *     "name":"admin",
	 *     "mail":"admin@example.com",
	 *     "theme":"",
	 *     "signature":"",
	 *     "signature_format":null,
	 *     "created":"1327346051",
	 *     "access":"1327429006",
	 *     "login":1327429219,
	 *     "status":"1",
	 *     "timezone":"America/New_York",
	 *     "language":"",
	 *     "picture":null,
	 *     "init":"admin@example.com",
	 *     "data":false,
	 *     "roles":{
	 *       "2":"authenticated user",
	 *       "3":"administrator"
	 *     },
	 *     "rdf_mapping":{
	 *       "rdftype":["sioc:UserAccount"],
	 *       "name":{
	 *         "predicates":["foaf:name"]
	 *       },
	 *       "homepage":{
	 *         "predicates":["foaf:page"],
	 *         "type":"rel"
	 *       }
	 *     }
	 *   }
	 * } 
	 */ 
	try {
		if (!name || !pass) { return false; }
		
		// make the service call
		drupalgap_services_user_login_result = drupalgap_services_resource_call({"resource_path":"user/login.json","data":'username=' + encodeURIComponent(name) + '&password=' + encodeURIComponent(pass)});
		
		if (drupalgap_services_user_login_result.errorThrown) { return false; }
		else {
			drupalgap_services_system_connect(); // make another call to system connect to refresh global variables
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
	/* example json result if logout failed: 
	{
		"readyState":4,
		"responseText":"null",
		"status":406,
		"statusText":"Not Acceptable: User is not logged in."
	} */

	try {
		
		// make the service call
		drupalgap_services_user_logout_result = drupalgap_services_resource_call({"resource_path":"user/logout.json"});
		
		if (drupalgap_services_user_logout_result.errorThrown) { return false; }
		else {
			drupalgap_services_system_connect(); // make another call to system connect to refresh global variables
			return true;
		}
	
	}
	catch (error) {
		console.log("drupalgap_services_user_logout - " + error);
		alert("drupalgap_services_user_logout - " + error);	
	}
	return false; // if it made it this fair, the user logout call failed
}

/*
 * example failed responses:
 * 
 * {
    	"form_errors": {
        	"current_pass": "Your current password is missing or incorrect; it's required to change the <em class=\"placeholder\">E-mail address</em>.",
        	"mail": ""
    	}
	}
	
	
	{
    	"jqXHR": {
        	"readyState": 4,
        	"responseText": "{\"form_errors\":{\"current_pass\":\"Your current password is missing or incorrect; it's required to change the <em class=\\\"placeholder\\\">E-mail address</em>.\",\"mail\":\"\"}}",
        	"status": 406,
        	"statusText": "Not Acceptable: Your current password is missing or incorrect; it's required to change the <em class=\"placeholder\">E-mail address</em>."
    	},
    	"textStatus": "error",
    	"errorThrown": "Not Acceptable: Your current password is missing or incorrect; it's required to change the <em class=\"placeholder\">E-mail address</em>."
	}
	
	example success responses:
	
	{
		"name":"chooch",
		"uid":"11",
		"roles":{
			"2":"authenticated user"
		}
	}
 */
function drupalgap_services_user_update (user) {
	try {
		
		drupalgap_services_user_update_result = null; // clear previous call
		
		if (!user) { // @todo, do a better job validating incoming user...
			console.log("drupalgap_services_user_update - user empty");
			return false;
		}
		
		// @todo - implement user name change (if they have permission) and password changing
		
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
		
		drupalgap_services_user_update_result = drupalgap_services_resource_call({"resource_path":"user/" + user.uid + ".json","data":data,"type":"put"});
		
		// make another call to system connect to refresh global variables if there wasn't any problems
		if (!drupalgap_services_user_update_result.errorThrown)
			drupalgap_services_system_connect(); 
		
		return drupalgap_services_user_update_result;
	}
	catch (error) {
		console.log("drupalgap_services_user_update");
		console.log(error);
	}
	return false; // if it made it this fair, the user update call failed
}

function drupalgap_services_user_register (name,mail,pass) {
	
	// example success json
	/* {
	 *   "uid":"2",
	 *   "uri":"http://localhost/drupal-7.10/?q=drupalgap/user/2"
	 * }*/
	
	// example failure json
	/* {
	 *   "form_errors":{
	 *     "name":"Username field is required.",
	 *     "mail":"E-mail address field is required."
	 *   }
	 * }
	 */
	
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
		drupalgap_services_user_register_result = drupalgap_services_resource_call({"resource_path":"user/register.json","data":'name=' + encodeURIComponent(name) + '&mail=' + encodeURIComponent(mail) + '&pass=' + encodeURIComponent(pass)});
		
		drupalgap_services_system_connect(); // make another call to system connect to refresh global variables
		
		return drupalgap_services_user_register_result;
	}
	catch (error) {
		console.log("drupalgap_services_user_register");
		console.log(error);	
	}
	return false; // if it made it this fair, the user register call failed
}

function drupalgap_services_user_access(permission) {
	try {
		// Clear the previous call.
		drupalgap_services_user_access_result = null;
		
		// Validate the input.
		valid = true;
		if (!permission) {
			alert("drupalgap_services_user_access - no permission provided");
		}
		
		// Make the service call.
		if (valid) {
			resource_path = "drupalgap_user/access.json";
			data = 'permission=' + encodeURIComponent(permission);
			drupalgap_services_user_access_result = drupalgap_services_resource_call({"resource_path":resource_path,"data":data});
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