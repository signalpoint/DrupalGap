function drupalgap_services_system_connect () {
	var system_connect_url = drupalgap_settings.services_endpoint_default + "/system/connect.json";
	console.log(system_connect_url);
	try {
	    $.ajax({
	      url: system_connect_url,
	      type: 'post',
	      dataType: 'json',
	      error: function (XMLHttpRequest, textStatus, errorThrown) {
	    	alert('drupalgap_services_system_connect - failed to connect');
	    	console.log("drupalgap_services_system_connect");
	        console.log(JSON.stringify(XMLHttpRequest));
	        console.log(JSON.stringify(textStatus));
	        console.log(JSON.stringify(errorThrown));
	      },
	      success: function (data) {
	        var drupal_user = data.user;
	        if (drupal_user.uid == 0) { // user is not logged in, show the login button, hide the logout button
	          $('#drupalgap_button_user_login').show();
	          $('#drupalgap_button_user_logout').hide();
	        }
	        else { // user is logged in, hide the login button, show the logout button
	          $('#drupalgap_button_user_login').hide();
	          $('#drupalgap_button_user_logout').show();
	        }
	      }
	    });
	}
	catch (error) { 
		alert("drupalgap_services_system_connect - " + error);
		consoloe.log("drupalgap_services_system_connect - " + error);
	}
}
