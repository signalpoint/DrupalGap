$('#drupalgap_page_user').live('pageshow',function(){
	try {
		$('#drupalgap_page_user h1').html(drupalgap_user.name);
    }
	catch (error) {
		console.log("drupalgap_page_user - " + error);
		alert("drupalgap_page_user - " + error);
	}
});