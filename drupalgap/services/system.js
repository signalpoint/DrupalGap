var drupalgap_services_system_connect_result; // global variable used to hold the latest system connect service resource call result

/**
 * Makes an synchronous call to Drupal's System Connect Service Resource.
 *
 * @return
 *   A JSON object containing information about the drupal user who made the service call, and NULL if the service call failed.
 */
function drupalgap_services_system_connect () {
	try {
		// build url path to service call
		var system_connect_url = drupalgap_settings.services_endpoint_default + "/system/connect.json";
		// force clear any previous system connect result
		drupalgap_services_system_connect_result = null;
		// make the service call...
		console.log(system_connect_url);
	    $.ajax({
	      url: system_connect_url,
	      type: 'post',
	      dataType: 'json',
	      async: false,
	      error: function (XMLHttpRequest, textStatus, errorThrown) {
	    	alert('drupalgap_services_system_connect - failed to connect');
	    	console.log("drupalgap_services_system_connect");
	        console.log(JSON.stringify(XMLHttpRequest));
	        console.log(JSON.stringify(textStatus));
	        console.log(JSON.stringify(errorThrown));
	      },
	      success: function (data) {
	    	  // save JSON result in global variable so others can access it
	    	  drupalgap_services_system_connect_result = data;
	    	  console.log(JSON.stringify(drupalgap_services_system_connect_result));
	      }
	    });
	}
	catch (error) { 
		alert("drupalgap_services_system_connect - " + error);
		consoloe.log("drupalgap_services_system_connect - " + error);
	}
	return drupalgap_services_system_connect_result;
}
