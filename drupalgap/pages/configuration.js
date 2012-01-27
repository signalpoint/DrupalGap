$('#drupalgap_page_configuration').live('pageshow',function(){
	try {
	}
	catch (error) {
		console.log("drupalgap_page_configuration");
		console.log(error);
	}
});

$('#drupalgap_page_configuration_button_reset').live('click',function(){
	try {
		if (confirm("Are you sure you want to reset DrupalGap?")) {
			window.localStorage.clear(); // clear all local storage
			$.mobile.changePage("install.html", "slideup");
		}
	}
	catch (error) {
		console.log("drupalgap_page_configuration_button_reset");
		console.log(error);
	}
	return false;
});
