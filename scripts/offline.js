$('#drupalgap_offline').on('pagebeforeshow',function(){
	try {
		// Show the site path to the user.
		$('#offline_site_path').html(drupalgap.settings.site_path);
	}
	catch (error) {
		alert("drupalgap_offline - pagebeforeshow - " + error);
	}
});

$('#drupalgap_offline').on('pageshow',function(){
	try {
	}
	catch (error) {
		alert("drupalgap_offline - pageshow - " + error);
	}
});

/**
 * When the 'try again' button is clicked, check for a connection and if it has
 * one make a call to system connect then go to the front page, otherwise just
 * inform user the device is still offline.
 */
$('#offline_try_again').on('click', function(){
	connection = drupalgap_check_connection();
	if (drupalgap.online) {
		drupalgap.services.drupalgap_system.connect.call({
			'success':function(){
				$.mobile.changePage(drupalgap.settings.front, {reloadPage:true});
			}
		});
	}
	else {
		navigator.notification.alert(
		    'Sorry, no connection found! (' + connection + ')',
		    function(){ },
		    'Offline',
		    'OK'
		);
		return false;
	}
});
