$('#drupalgap_page_dashboard').live('pageshow',function(){
	try {
		
		// display site name
		site_name = drupalgap_services_system_get_variable("site_name");
		if (!site_name) { site_name = "DrupalGap"; }
		$('#drupalgap_page_dashboard h1').html(site_name);
		
		if (drupalgap_services_system_connect_result.user.uid == 0) { // user is not logged in...
			$('#drupalgap_page_dashboard_navbar_anonymous').show();
			$('#drupalgap_page_dashboard_navbar_authenticated').hide();
        }
        else { // user is logged in...
        	$('#drupalgap_page_dashboard_navbar_anonymous').hide();
        	$('#drupalgap_page_dashboard_navbar_authenticated').show();
        }
		
	}
	catch (error) {
		console.log("drupalgap_page_dashboard - " + error);
	}
});

$('#drupalgap_button_user_logout').live("click",function(){
	try {
		if (drupalgap_services_user_logout()) {
			$.mobile.changePage("dashboard.html",{reloadPage:true},{allowSamePageTranstion:true},{transition:'none'});
		}
		else { // logout failed...
			alert(drupalgap_services_user_logout_result.statusText);
		}
	}
	catch (error) {
		console.log("drupalgap_button_user_logout - " + error);	
	}
	return false;
});
