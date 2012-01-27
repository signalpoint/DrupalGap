var drupalgap_settings = { }
drupalgap_settings.site_path = "http://10.0.2.2/drupal-7.10";
drupalgap_settings.base_path = drupalgap_settings.site_path + "/?q=";
drupalgap_settings.services_endpoint_default = drupalgap_settings.base_path + "drupalgap";

var drupalgap_user;

$(document).ready(function() {
	drupalgap_services_system_connect();
	//$.mobile.changePage("drupalgap/pages/dashboard.html", "slideup");
	//$.mobile.changePage("drupalgap/pages/content_add.html", "slideup");
	$.mobile.changePage("drupalgap/pages/content.html", "slideup");
});
