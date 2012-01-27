$('#drupalgap_page_install').live('pageshow',function(){
	try {
	}
	catch (error) {
		console.log("drupalgap_page_install");
		console.log(error);
	}
});

$('#drupalgap_page_install_connect').live('click',function(){
	try {
		var url = $('#drupalgap_page_install_site_url').val();
	  	if (!url) { alert("Enter your Drupal site's URL."); return false; }
	  	
	  	// update settings with new site url path
	  	settings = drupalgap_settings_load();
	  	settings.site_path = url;
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
	  		alert("Setup Complete!");
	  		$.mobile.changePage("dashboard.html", "slideup");
	  	}
	}
	catch (error) {
		console.log("drupalgap_page_install_connect");
		console.log(error);
	}
	return false;
});

$('#drupalgap_page_install_help').live('click',function(){
	alert("Please visit the DrupalGap project page for help topics.");
	return false;
});
