$('#drupalgap_page_user_edit').live('pageshow',function(){
	try {
		// TODO - Once the user retrieve service resource is implemented,
		// we will probably want to use it here instead of relying on
		// drupalgap_user which is populated by system connect.
		$('#drupalgap_user_edit_name').val(drupalgap_user.name);
		$('#drupalgap_user_edit_mail').val(drupalgap_user.mail);
    }
	catch (error) {
		console.log("drupalgap_page_user_edit - " + error);
		alert("drupalgap_page_user_edit - " + error);
	}
});

/**
 * Handles the submission of the user edit form.
 *
 */
$('#drupalgap_user_edit_submit').live('click',function() {
	
	try {
		
		// stop demo user from editing account
		if (drupalgap_settings.demo && drupalgap_user.name == "demo") {
			alert("Sorry, the demo account can't be changed.");
			return false;
	    }
		
		// grab form input...
		
		name = $('#drupalgap_user_edit_name').val();
		current_pass = $('#drupalgap_user_edit_current_pass').val();
		mail = $('#drupalgap_user_edit_mail').val();
		pass1 = $('#drupalgap_user_edit_pass1').val();
		pass2 = $('#drupalgap_user_edit_pass2').val();
		
		// validate user name
		if (!name) {
			alert("Enter Username");
			return false;
		}
		
		// validate e-mail
		if (!mail) {
			alert("Enter E-mail Address");
			return false;
		}
		// if user changed e-mail address, make sure password was provided
		if (drupalgap_user.mail != mail && !current_pass) {
			if (!current_pass) {
				alert("Enter current password to change e-mail.");
				return false;
			}
		}
		
		// if user is changing passwords, make sure the new passwords match 
		// and their current password was provided
		if (pass1 && pass2) {
			if (pass1 != pass2) {
				alert("New passwords do not match!");
				return false;
			}
			else if (!current_pass) {
				alert("Enter your current password to change your password.");
				return false;
			}
		}
		
		// Build a temp user object to send to the update service resource.
		var temp_user = drupalgap_user;
		temp_user.name = name;
		temp_user.mail = mail;
		temp_user.current_pass = current_pass;
		temp_user.pass1 = pass1;
		temp_user.pass2 = pass2;
		
		// Build the service resource call options.
		options = {
			"user":temp_user,
			"error":function (jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
			},
			"success":function (data) {
				if (data.uid) { // user update successful...
					$.mobile.changePage("user.html", "slideup");
				}
				else { // update failed...
					$('#drupalgap_page_user_edit_messages').html(""); // clear any existing messages
					$('#drupalgap_page_user_edit_messages').append("<li>" + data.errorThrown + "</li>");
					$('#drupalgap_page_user_edit_messages').show();
				}
			}
		};
		
		// Make the service resource call.
		drupalgap_services_user_update.resource_call(options);
		
	}
	catch (error) {
	  console.log("drupalgap_user_edit_submit");
	  console.log(error);
	}
	
  return false; // stop the click from executing any further
  
});