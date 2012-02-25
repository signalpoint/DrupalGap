$('#drupalgap_page_welcome').live('pageshow',function(){
  try {
  }
  catch (error) {
	  console.log("drupalgap_page_welcome");
	  console.log(error);
  }
});

$('#drupalgap_page_welcome_button_demo').live('click',function(){
	try {
	  	// update settings with new site url path
	  	settings = drupalgap_settings_load();
	  	settings.site_path = "http://www.drupalgap.org";
	  	drupalgap_settings.demo = true;
	  	drupalgap_settings_save(settings);
	  	
	  	// perform system connect to see if drupalgap is setup properly on drupal site
	  	result = drupalgap_services_system_connect();
	  	
	  	if (result.errorThrown) { // something went wrong...
	  		// clear the site path and re-save the settings to start over
	  		settings.site_path = "";
		  	drupalgap_settings_save(settings);
		  	alert(result.errorThrown);
	  	}
	  	else { // session id came back, everything is ok...
	  		alert("Connected to DrupalGap.org, the demo is ready, enjoy!");
	  		$.mobile.changePage("dashboard.html", "slideup");
	  	}
	}
	catch (error) {
		console.log("drupalgap_page_welcome_button_demo");
		console.log(error);
	}
	return false;
});
