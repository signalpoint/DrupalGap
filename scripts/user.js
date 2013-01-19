$('#drupalgap_page_user').on('pagebeforeshow',function(){
	try {
		$('#picture').hide();
		if (drupalgap_user_access({'permission':'administer users'}) || 
			drupalgap.user.uid == drupalgap.account.uid) {
			$('#user_edit').show();
		}
		if (drupalgap.user.uid == drupalgap.account.uid) {
			// TODO - only show if user can create at least one content type
			$('#user_node_add').show();
		}
    }
	catch (error) {
		alert("drupalgap_page_user - pagebeforeshow - " + error);
	}
});

$('#drupalgap_page_user').on('pageshow',function(){
	try {
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

$('#user_edit').on('click', function(){
	drupalgap.account_edit.uid = drupalgap.account.uid;
});
