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
	  	
	  	// Perform system connect to see if DrupalGap is setup properly on Drupal site.
	  	options = {
	  		"error":function(jqXHR, textStatus, errorThrown){
	  			// Clear the site path and re-save the settings to start over.
		  		settings.site_path = "";
			  	drupalgap_settings_save(settings);
			  	if (errorThrown) {
			  		alert(errorThrown);
			  	}
			  	else {
			  		alert("Error connecting. Please check that the URL is typed correctly, with no trailing slashes.");
			  	}
	  		},
	  		"success":function(inner_data){
	  			// Session id came back, everything is ok...
		  		alert("Setup Complete!");
		  		
		  		// Make a call to the DrupalGap bundled system connect resource.
		  		inner_options = {
		  			"load_from_local_storage":"0",
		  			"error":function (jqXHR, textStatus, errorThrown) {
			  			if (errorThrown) {
					  		alert(errorThrown);
					  	}
					  	else {
					  		alert("Error connecting. Please check that the URL is typed correctly, with no trailing slashes.");
					  	}
		  			},
		  			"success":function () {
		  				// Go to the dashboard.
		  				$.mobile.changePage("dashboard.html", "slideup");
		  			}
		  		};
		  		drupalgap_services_resource_system_connect.resource_call(inner_options);
	  		},
	  	};
	  	drupalgap_services_system_connect.resource_call(options);
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
