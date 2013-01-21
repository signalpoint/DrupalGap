$('#drupalgap_page_user_login').on('pageshow',function(){
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
	  drupalgap_form_render('user_login', '#drupalgap_page_user_login .content');
  }
  catch (error) {
		alert("drupalgap_page_user_login - " + error);
  }
});

