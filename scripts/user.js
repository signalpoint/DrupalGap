$('#drupalgap_page_user').on('pageshow',function(){
	try {
		drupalgap.services.user.retrieve.call({
			'uid':drupalgap.user.uid,
			'success':function(data){
				$('#drupalgap_page_user h1').html(data.name);
				created = new Date(parseInt(data.created)*1000);
				$('#created').html(created.toDateString());
			},
		});
    }
	catch (error) {
		alert("drupalgap_page_user - " + error);
	}
});
