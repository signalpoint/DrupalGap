$('#drupalgap_page_dashboard').live('pageshow',function(){
	try {
		if (drupalgap_services_system_connect_result.user.uid == 0) { // user is not logged in...
			$('#drupalgap_button_user_account').hide();
			$('#drupalgap_button_user_login').show();
			$('#drupalgap_button_user_logout').hide();
			$('#drupalgap_button_user_register').show();
        }
        else { // user is logged in...
        	$('#drupalgap_button_user_account').show();
        	$('#drupalgap_button_user_login').hide();
        	$('#drupalgap_button_user_logout').show();
        	$('#drupalgap_button_user_register').hide();
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
