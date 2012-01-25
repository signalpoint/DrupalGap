var drupalgap_settings = {
		"services_endpoint_default":"http://10.0.2.2/drupal-7.10/?q=drupalgap"
}
var drupalgap_user;

$(document).ready(function() {
	drupalgap_services_system_connect();
	$.mobile.changePage("drupalgap/pages/dashboard.html", "slideup");
});
