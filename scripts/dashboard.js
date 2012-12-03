$('#dashboard').live('pagebeforeshow',function(){
	try {
		// Hide both nav bars, then figure out which one to show.
		$('#navbar_anonymous').hide();
    	$('#navbar_authenticated').hide();
		if (drupalgap.user.uid == 0) {
			$('#navbar_anonymous').show();
			$('#user_navbar h2').hide();
        }
        else {
        	$('#navbar_authenticated').show();
        	$('#user_navbar h2').show().html("Hi, " + drupalgap.user.name);
        }
	}
	catch (error) {
		if (drupalgap.settings.debug) {
			console.log("dashboard - " + error);
		}
	}
});

$('#logout').live('click', function(){
	drupalgap.services.user.logout.call({
		'success':function(data){
			$.mobile.changePage("user_login.html");
		}
	});
});