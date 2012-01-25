/**
 * Handles the register page show event.
 *
 */
$('#drupalgap_page_user_register').live('pageshow',function(){
  try {
	    if (drupalgap_services_system_connect_result.user.uid != 0) {
          alert("Already logged in!");
          $.mobile.changePage("dashboard.html", "slideup");
        }
  }
  catch (error) {
	  console.log("drupalgap_page_user_register - " + error);
  }
});

/**
 * Handles the submission of the user registration form.
 *
 */
$('#drupalgap_user_register_submit').live('click',function() {
	
	try {
	  
	  // grab name and validate it
	  var name = $('#drupalgap_user_register_name').val();
	  if (!name) { alert('Please enter your user name.'); return false; }
	  
	  // grab pass and validate it
	  var mail = $('#drupalgap_user_register_mail').val();
	  if (!mail) { alert('Please enter your e-mail address.'); return false; }
	  
	  // make call to the user register service resource
	  if (drupalgap_services_user_register(name,mail)) {
		 $.mobile.changePage("user.html", "slideup");
	  }
	  else { // register failed...
		  $('#drupalgap_page_user_register_messages').html(drupalgap_services_user_register_result.statusText).show();
	  }
	  
	}
	catch (error) {
	  console.log("drupalgap_user_register_submit - " + error);
	  alert("drupalgap_user_register_submit - " + error);
	}
	
  return false; // stop the click from executing any further
  
});