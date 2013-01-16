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
  }
  catch (error) {
	  if (drupalgap.settings.debug) {
		  console.log("drupalgap_page_user_login - " + error);
	  }  
  }
});

$('#user_login_submit').on('click',function() {
	try {
	  // Get name and password, validate them.
	  var name = $('#name').val();
	  var pass = $('#pass').val();
	  if (!name) { alert('Please enter your user name.'); return false; }
	  if (!pass) { alert('Please enter your password.'); return false; }
	  drupalgap.services.drupalgap_user.login.call({
		  'name':name,
		  'pass':pass,
		  'success':function(result){
			  $.mobile.changePage("dashboard.html");
		  },
	  });
	}
	catch (error) {
		alert('user_login_submit - ' + error);
	}
	return false;
});
