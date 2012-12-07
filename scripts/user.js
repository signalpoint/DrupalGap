//$('#drupalgap_page_user').live('pageshow',function(){
//die
$('#drupalgap_page_user').on('pageshow',function(){
	try {
		//console.log(drupalgap.services.user.retrieve.options.success);
		//alert('pageshow');
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
		if (drupalgap.settings.debug) {
			console.log("drupalgap_page_user - " + error);
		}
	}
});
