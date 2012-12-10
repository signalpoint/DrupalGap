$('#drupalgap_page_user').on('pagebeforeshow',function(){
	try {
		//$('#user_node_add').hide();
		$('#user_edit').hide();
    }
	catch (error) {
		alert("drupalgap_page_user - pagebeforeshow - " + error);
	}
});

$('#drupalgap_page_user').on('pageshow',function(){
	try {
		if (drupalgap.user.uid = drupalgap.account.uid) {
			$('#user_edit').show();
		}
		drupalgap.services.user.retrieve.call({
			'uid':drupalgap.account.uid,
			'success':function(data){
				$('#drupalgap_page_user h2').html(data.name);
				created = new Date(parseInt(data.created)*1000);
				$('#created').html(created.toDateString());
			},
		});
    }
	catch (error) {
		alert("drupalgap_page_user - pageshow - " + error);
	}
});
