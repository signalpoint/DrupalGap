var drupalgap_settings;
var drupalgap_user;
var drupalgap_site_settings;
var drupalgap_user_roles_and_permissions;
var drupalgap_content_types_list;
var drupalgap_content_types_user_permissions;

$(document).ready(function() {
	
	// Clear all local storage, used for testing.
	window.localStorage.clear();
	
	drupalgap_settings_load();
	
	if (!drupalgap_settings.site_path) {
		// The app doesn't have a default site path, send user to welcome page.
		$.mobile.changePage("drupalgap/pages/welcome.html", { transition: "fade"});
	}
	else {
		
		// App has a default site path.
		
		// Make a call to the DrupalGap bundled system connect resource.
		// TODO - do something if the system connect fails.
		// TODO - if app is online, we should probably force a reload on this,
		// otherwise fall back to the local storage session.
		options = {
			"load_from_local_storage":"0",
			"error":function(jqXHR, textStatus, errorThrown){
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
			},
			"success":function(){
				// Go to the dashboard.
				$.mobile.changePage("drupalgap/pages/dashboard.html", { transition: "fade"});
			}
		};
		drupalgap_services_resource_system_connect.resource_call(options);
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
		drupalgap_settings = JSON.parse(drupalgap_settings);
	}
	return drupalgap_settings;
}

function drupalgap_settings_save (settings) {
	window.localStorage.setItem("drupalgap_settings",JSON.stringify(settings));
	drupalgap_settings = settings;
	return drupalgap_settings;
}
