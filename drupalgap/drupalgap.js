var drupalgap_settings;
var drupalgap_user;
var drupalgap_site_settings;

$(document).ready(function() {
	drupalgap_settings_load();
	if (!drupalgap_settings.site_path) { // app doesn't have a default site path...
		// send user to welcome page
		$.mobile.changePage("drupalgap/pages/welcome.html", "slideup");
		//$.mobile.changePage("drupalgap/pages/content.html", "slideup");
	}
	else { // app does have a default site path... begin initialization...
		
		// make a call to the system connect service resource
		drupalgap_services_system_connect(); // @todo - do something if system connect fails...
		
		// go to the dashboard
		$.mobile.changePage("drupalgap/pages/dashboard.html", "slideup");
		//$.mobile.changePage("drupalgap/pages/content.html", "slideup");
	}
});

function drupalgap_settings_load () {
	drupalgap_settings = window.localStorage.getItem("drupalgap_settings");
	if (!drupalgap_settings) { // no settings found in local storage, setup defaults...
		drupalgap_settings = {};
		drupalgap_settings.site_path = ""; // examples: http://my-drupal-site.com, http://10.0.2.2/my-localhost-drupal
		drupalgap_settings.base_path = "/?q=";
		drupalgap_settings.services_endpoint_default = "drupalgap";
		drupalgap_settings.demo = false;
		drupalgap_settings_save(drupalgap_settings);
	}
	else {
		console.log("drupalgap_settings_load - loaded from local storage");
		drupalgap_settings = JSON.parse(drupalgap_settings);
		console.log(JSON.stringify(drupalgap_settings));
	}
	return drupalgap_settings;
}

function drupalgap_settings_save (settings) {
	console.log("drupalgap_settings_save - saving to local storage");
	console.log(JSON.stringify(settings));
	window.localStorage.setItem("drupalgap_settings",JSON.stringify(settings));
	drupalgap_settings = settings;
	return drupalgap_settings;
}
