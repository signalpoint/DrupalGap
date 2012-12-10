$('#drupalgap_page_user_edit').live('pagebeforeshow',function(){
	try {
    }
	catch (error) {
		alert("drupalgap_page_user_edit - pagebeforeshow " + error);
	}
});

$('#drupalgap_page_user_edit').live('pageshow',function(){
	try {
		drupalgap.services.user.retrieve.call({
			'uid':drupalgap.account.uid,
			'success':function(account){
				$('#name').val(account.name);
				$('#mail').val(account.mail);
			}
		});
    }
	catch (error) {
		alert("drupalgap_page_user_edit - pageshow " + error);
	}
});

$('#submit').on('click',function() {
	try {
		drupalgap.services.user.update.call({
			'account':{
				'uid':drupalgap.account.uid,
				'name':$('#name').val(),
				'current_pass':$('#current_pass').val(),
				'mail':$('#mail').val(),
			},
			'success':function(result) {
				$.mobile.changePage('user.html');
			}
		});
	}
	catch (error) {
	  alert("drupalgap_user_edit - submit - " + error);
	}
});
