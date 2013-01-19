$('#drupalgap_users').on('pagebeforeshow', function(){
	try {
		// If the user can administer users, show them the add user button.
		if (drupalgap_user_access({'permission':'administer users'})) {
			$('#users_add').show();
		}
	}
	catch (error) {
		alert('drupalgap_users - pagebeforeshow - ' + error);
	}
});

$('#drupalgap_users').on('pageshow', function(){
	try {
		// Grab some users and display them.
		drupalgap.views_datasource.call({
			'path':'drupalgap/views_datasource/drupalgap_users',
			'success':function(data) {
				$("#users_list").html("");
				$.each(data.users, function(index, object){	
					$("#users_list").append($("<li></li>",{"html":"<a href='user.html' uid='" + object.user.uid + "' class='user_list_item'>" + object.user.name + "</a>"}));
				});
				$("#users_list").listview("destroy").listview();
			},
		});
	}
	catch (error) {
		alert('drupalgap_users - pageshow - ' + error);
	}
});

$('.user_list_item').live('click', function(){
	drupalgap.account.uid = $(this).attr('uid');
});
