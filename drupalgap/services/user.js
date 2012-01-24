var drupalgap_services_user_login_result; // global variable used to hold the latest user login service resource call result json
var drupalgap_services_user_logout_result; // global variable used to hold the latest user logout service resource call result json

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
		// build url path to user login service resource call
		var user_login_url = drupalgap_settings.services_endpoint_default + "/user/login.json";
		console.log(user_login_url);  
		// make the service call...
		var successful = false;
		$.ajax({
		    url: user_login_url,
		    type: 'post',
		    data: 'username=' + encodeURIComponent(name) + '&password=' + encodeURIComponent(pass),
		    dataType: 'json',
		    async: false,
		    error: function(XMLHttpRequest, textStatus, errorThrown) {
		      drupalgap_services_user_login_result = XMLHttpRequest; // hold on to a copy of the json that came back
		      console.log(JSON.stringify(XMLHttpRequest));
		      console.log(JSON.stringify(textStatus));
		      console.log(JSON.stringify(errorThrown));
		    },
		    success: function (data) {
		      drupalgap_services_user_login_result = data; // hold on to a copy of the json that came back
		      console.log(JSON.stringify(drupalgap_services_user_login_result));
		      successful = true;
		      drupalgap_services_system_connect(); // make another call to system connect to refresh global variables
		    }
		});
		return successful;
	}
	catch (error) {
		consoloe.log("drupalgap_services_user_login - " + error);
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
	  // build url path to user login service resource call
	  var user_logout_url = drupalgap_settings.services_endpoint_default + "/user/logout.json";
	  console.log(user_logout_url);
	  
	  // make the service call...
	  var successful = false;
	  $.ajax({
		    url: user_logout_url,
		    type: 'post',
		    dataType: 'json',
		    async: false,
		    error: function(XMLHttpRequest, textStatus, errorThrown) {
		      drupalgap_services_user_logout_result = XMLHttpRequest; // hold on to a copy of the json that came back
		      console.log(JSON.stringify(XMLHttpRequest));
		      console.log(JSON.stringify(textStatus));
		      console.log(JSON.stringify(errorThrown));
		    },
		    success: function (data) {
		      drupalgap_services_user_logout_result = data; // hold on to a copy of the json that came back
		      console.log(JSON.stringify(drupalgap_services_user_logout_result));
		      successful = true;
		      drupalgap_services_system_connect(); // make another call to system connect to refresh global variables
		    }
		});
	  return successful;
	}
	catch (error) {
		consoloe.log("drupalgap_services_user_logout - " + error);
		alert("drupalgap_services_user_logout - " + error);	
	}
	return false; // if it made it this fair, the user logout call failed
}
