$('#drupalgap_page_setup').live('pageshow',function(){
	try {
		// @todo - perform system connect test to drupalgap.org
	  	// @todo - implement a service resource that performs an initial system connect handshake
	}
	catch (error) {
		console.log("drupalgap_page_setup");
		console.log(error);
	}
});

// when the site url text field is clicked...
$('#drupalgap_page_setup_site_url').live('click',function(){
	
	// remove 'drupalgap.org' from the text field for quick-n-easy user experience
	if ($('#drupalgap_page_setup_site_url').val() == "http://www.drupalgap.org")
		$('#drupalgap_page_setup_site_url').val("http://www.");
		
});

$('#drupalgap_page_setup_connect').live('click',function(){
	try {
		
		// grab input url and validate
		// @todo - better validation here
		var url = $('#drupalgap_page_setup_site_url').val();
	  	if (!url) { alert("Enter your Drupal site's URL."); return false; }
	  	
	  	// warn user if they are trying to connect to localhost
	  	if (url.indexOf("localhost") != -1) {
	  		warning_msg = "Warning: Entering localhost has known problems with Android devices and emulators. ";
	  		warning_msg += 	"You may have to use 10.0.2.2 instead. Do you want to continue?";
	  		if (!confirm(warning_msg))
	  			return false;
	  	}
	  	
	  	// update settings with new site url path
	  	settings = drupalgap_settings_load();
	  	settings.site_path = url;
	  	drupalgap_settings_save(settings);
	  	
	  	// perform system connect to see if drupalgap is setup properly on drupal site
	  	//result = drupalgap_services_system_connect();
	  	result = drupalgap_services_system_connect.resource_call();
	  	
	  	if (result.errorThrown || result.textStatus == "error") { // something went wrong...
	  		// Clear the site path and re-save the settings to start over.
	  		settings.site_path = "";
		  	drupalgap_settings_save(settings);
		  	if (result.errorThrown) {
		  		alert(result.errorThrown);
		  	}
		  	else {
		  		alert("Error connecting. Please check that the URL is typed correctly, with no trailing slashes.");
		  	}
	  	}
	  	else { 
	  		
	  		// Session id came back, everything is ok...
	  		alert("Setup Complete!");
	  		
	  		// Make a call to the DrupalGap bundled system connect resource.
			//drupalgap_services_resource_system_connect();
	  		drupalgap_services_resource_system_connect.resource_call();
			
			// Go to the dashboard.
	  		$.mobile.changePage("dashboard.html", "slideup");
	  	}
	}
	catch (error) {
		console.log("drupalgap_page_setup_connect");
		console.log(error);
	}
	return false;
});

$('#drupalgap_page_setup_help').live('click',function(){
	alert("Please visit the DrupalGap project page for help topics.");
	return false;
});
