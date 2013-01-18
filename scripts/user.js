$('#drupalgap_page_user').on('pagebeforeshow',function(){
	try {
		$('#picture').hide();
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
			'success':function(account){
				$('#user_name').html(account.name);
				created = new Date(parseInt(account.created)*1000);
				$('#created').html(created.toDateString());
				if (account.picture) {
					$('#picture').html(drupalgap_theme('image', {'path':account.picture.uri})).show();
				}
			},
		});
    }
	catch (error) {
		alert("drupalgap_page_user - pageshow - " + error);
	}
});
