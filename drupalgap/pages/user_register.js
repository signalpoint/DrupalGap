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
	  
	  // grab mail and validate it
	  var mail = $('#drupalgap_user_register_mail').val();
	  if (!mail) { alert('Please enter your e-mail address.'); return false; }
	  
	  // grab passwords, compare and validate 
	  var pass = $('#drupalgap_user_register_pass').val();
	  if (!pass) { alert('Please enter your password.'); return false; }
	  var pass2 = $('#drupalgap_user_register_confirm_pass').val();
	  if (!pass2) { alert('Please confirm your password.'); return false; }
	  if (pass != pass2) { alert("Passwords do not match."); return false; }
	  
	  // make call to the user register service resource
	  user_registration = drupalgap_services_user_register(name,mail,pass);
	  if (user_registration.uid) { // user registration successful...
		  
		  // show message depending on site's user registration settings
		  site_name = drupalgap_site_settings.variable.site_name;
		  
		  // who can create accounts?
		  // @todo - take into account the 'require e-mail verification when a visitor creates an account' checkbox on the drupal site
		  switch (drupalgap_site_settings.variable.user_register) {
			case 1: // Visitors
			case "1":
				alert("Registration complete! Please check your e-mail to verify your new account at " + site_name + ".");
				break;
			case 2: // Visitors, but administrator approval is required
			case "2":
				alert("Registration complete! An administrator from " + site_name  + " must now approve your new account.");
				break;
			default:
				alert("Registration complete!"); // @todo - this should be more informative, instruct user what's next.
				break;
		  }
		  
		  $.mobile.changePage("dashboard.html", "slideup");
	  }
	  else { // registration failed...
		  $('#drupalgap_page_user_register_messages').html(""); // clear any existing messages
		  $.each(user_registration.form_errors,function(field,message){
			  $('#drupalgap_page_user_register_messages').append("<li>" + message + "</li>"); 
		  });
		  $('#drupalgap_page_user_register_messages').show();
	  }
	  
	}
	catch (error) {
	  console.log("drupalgap_user_register_submit - " + error);
	  alert("drupalgap_user_register_submit - " + error);
	}
	
  return false; // stop the click from executing any further
  
});