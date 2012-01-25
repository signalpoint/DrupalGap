$('#drupalgap_page_user_edit').live('pageshow',function(){
	try {
		$('#drupalgap_user_edit_name').val(drupalgap_user.name);
		$('#drupalgap_user_edit_mail').val(drupalgap_user.mail);
    }
	catch (error) {
		console.log("drupalgap_page_user_edit - " + error);
		alert("drupalgap_page_user_edit - " + error);
	}
});

/**
 * Handles the submission of the user login form.
 *
 */
$('#drupalgap_user_edit_submit').live('click',function() {
	
	try {
		name = $('#drupalgap_user_edit_name').val();
		current_pass = $('#drupalgap_user_edit_current_pass').val();
		mail = $('#drupalgap_user_edit_mail').val();
		pass = $('#drupalgap_user_edit_pass').val();
		confirm_pass = $('#drupalgap_user_edit_confirm_pass').val();
		
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
		
		// changing password?
		if (pass) {
			if (pass != confirm_pass) {
				alert("New passwords do not match!");
				return false;
			}
			else if (!current_pass) {
				alert("Enter your current password to change your password.");
				return false;
			}
		}
		
		var temp_user = drupalgap_user;
		temp_user.name = name;
		temp_user.mail = mail;
		temp_user.pass = pass;
		
		if (drupalgap_services_user_update(temp_user)) {
			$.mobile.changePage("user.html", "slideup");
		}
		else {
			alert("account update failed, wah wah");
		}
	}
	catch (error) {
	  console.log("drupalgap_user_edit_submit - " + error);
	  alert("drupalgap_user_edit_submit - " + error);
	}
	
  return false; // stop the click from executing any further
  
});