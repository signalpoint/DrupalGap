$('#drupalgap_dashboard').on('pagebeforeshow',function(){
	try {
		// Hide both nav bars, then figure out which one to show.
		$('#navbar_anonymous').hide();
    	$('#navbar_authenticated').hide();
		if (drupalgap.user.uid == 0) {
			$('#navbar_anonymous').show();
			$('#user_navbar h2').hide();
        }
        else {
        	$('#navbar_authenticated').show();
        	$('#user_navbar h2').show().html("Hi, " + drupalgap.user.name);
        }
		// If the user is allowed to view user profiles, show them the users
		// button.
		if (drupalgap_user_access({'permission':'access user profiles'})) {
			$('#dashboard_users').show();
		}
		// If the user is allowed to get vocabularies, show them the
		// vocabularies button.
		if (drupalgap_user_access({'permission':'drupalgap get vocabularies'})) {
			$('#dashboard_vocabularies').show();
		}
	}
	catch (error) {
		alert("drupalgap_dashboard - " + error);
	}
});

$('#drupalgap_dashboard').on('pageshow', function(){
	// Get the site name, and set the header to it for authenticated users.
	// TODO - this should utilize the site name that is available via a
	// drupalgap service resource.
	/*if (drupalgap.user.uid != 0) {
		drupalgap.services.system.get_variable.call({
			'name':'site_name',
			'success':function(value){
				$('#drupalgap_dashboard h1').html(value);
			}
		});
	}*/
	// Grab some recent content and display it.
	drupalgap.views_datasource.call({
		'path':'drupalgap/views_datasource/drupalgap_content',
		'success':function(data) {
			$("#dashboard_content_list").html("");
			$.each(data.nodes, function(index, object){	
				$("#dashboard_content_list").append($("<li></li>",{"html":"<a href='node.html' id='" + object.node.nid + "'>" + object.node.title + "</a>"}));
			});
			$("#dashboard_content_list").listview("destroy").listview();
		},
	});
});

$('#dashboard_content_list a').live('click',function(){
	drupalgap.node = {'nid':$(this).attr('id')};
});

$('#my_account').on('click', function(){
	drupalgap.account.uid = drupalgap.user.uid;
});

$('#logout').on('click', function(){
	drupalgap.services.user.logout.call({
		'success':function(data){
			drupalgap.services.system.connect.call({
				'success':function(result){
					$.mobile.changePage(drupalgap.settings.front, {reloadPage:true});
				},
			});
		}
	});
});
