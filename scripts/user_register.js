$('#drupalgap_page_user_register').on('pageshow',function(){
  try {
	    if (drupalgap.user.uid != 0) {
	    	navigator.notification.alert(
				  'Already logged in!',
				  function(){},
				  'Error',
				  'OK'
			);
	    	$.mobile.changePage("dashboard.html");
        }
  }
  catch (error) {
	  alert("drupalgap_page_user_register - " + error);
  }
});

$('#user_register_submit').live('click',function() {
	try {
	  drupalgap.services.user.register.call({
		  'name':$('#name').val(),
		  'mail':$('#mail').val(),
		  'success':function(data){
			  $.mobile.changePage("dashboard.html");
		  },
	  });
	}
	catch (error) {
		alert('user_register_submit - ' + error);
	}
	return false;
});
