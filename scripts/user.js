$('#drupalgap_page_user').live('pageshow',function(){
	try {
		options = drupalgap.services.user.retrieve.call({
			'uid':drupalgap.user.uid,
			'success':function(data){
				$('#drupalgap_page_user h1').html(data.name);
				created = new Date(parseInt(data.created)*1000);
				$('#created').html(created.toDateString());
			},
		});
    }
	catch (error) {
		if (drupalgap.settings.debug) {
			console.log("drupalgap_page_user - " + error);
		}
	}
});
