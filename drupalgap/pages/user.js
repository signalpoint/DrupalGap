$('#drupalgap_page_user').live('pageshow',function(){
	try {
		
		if (drupalgap_user.uid == 0) { 
			$.mobile.changePage("dashboard.html", "slideup");
			return false;
		}
		
		// populate user account template place holders
		
		// user name
		$('#drupalgap_page_user h1').html(drupalgap_user.name);
		
		// user created date (Drupal's time value(s) must be multiplied by 1000 since JavaScript deals in milliseconds for the Unix Epoch????)
		created = new Date(parseInt(drupalgap_user.created)*1000);
		$('#drupalgap_page_user_created').html(created.toDateString());
		
    }
	catch (error) {
		console.log("drupalgap_page_user - " + error);
		alert("drupalgap_page_user - " + error);
	}
});
