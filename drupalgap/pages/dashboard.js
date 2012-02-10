$('#drupalgap_page_dashboard').live('pageshow',function(){
	try {
		
		// display site name
		site_name = drupalgap_site_settings.variable.site_name;
		if (!site_name) { site_name = "DrupalGap"; }
		$('#drupalgap_page_dashboard h1').html(site_name);
		
		if (drupalgap_user.uid == 0) { // user is not logged in...
			$('#drupalgap_page_dashboard_navbar_anonymous').show();
			$('#drupalgap_page_dashboard_navbar_authenticated').hide();
			$('#drupalgap_page_dashboard_header_user h2').hide();
			
			// determine what to do with the user registration button based on the site settings
			switch (drupalgap_site_settings.variable.user_register) {
				case 0: // Administrators only
				case "0":
					$('#drupalgap_button_user_register').hide();
					break;
				case 1: // Visitors
				case "1":
					break;
				case 2: // Visitors, but administrator approval is required
				case "2":
					break;
			}
        }
        else { // user is logged in...
        	$('#drupalgap_page_dashboard_navbar_anonymous').hide();
        	$('#drupalgap_page_dashboard_navbar_authenticated').show();
        	$('#drupalgap_page_dashboard_header_user h2').html("Hi, " + drupalgap_user.name);
        }
		
		// Load user access permissions.
		access_content = drupalgap_services_user_access("access content");
		access_comments = drupalgap_services_user_access("access comments");
		
		// Set visibility on other buttons.
		if (access_content) { $('#drupalgap_button_content').show(); }
		if (access_comments) { $('#drupalgap_button_comments').show(); }
		
	}
	catch (error) {
		console.log("drupalgap_page_dashboard");
		console.log(error);
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
