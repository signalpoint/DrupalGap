var drupalgap_page_comment_edit_nid; // other's set this nid so this page knows which node to load
var drupalgap_page_comment_edit_content_type;
var drupalgap_page_comment_edit_cid; // other's set this cid so this page knows which comment to load (if any)
$('#drupalgap_page_comment_edit').live('pageshow',function(){
	try {
		
		// Load node.
		nid = drupalgap_page_comment_edit_nid;
		drupalgap_page_comment_edit_node = drupalgap_services_node_retrieve.resource_call({"nid":nid});
		if (!drupalgap_page_comment_edit_node) {
			alert("drupalgap_page_comment_edit - failed to load node (" + nid + ")");
			return false;
		}
		else {
			// Set the page nid in case it wasn't set.
			drupalgap_page_node_nid = nid;
		}
		
		// Check the status of this node's comments.
		switch (drupalgap_page_comment_edit_node.comment) {
			case "0": // Comments hidden.
				alert("Comments are hidden for this node.");
				$.mobile.changePage("node.html");
				return false;
				break;
			case "1": // Comments closed.
				alert("Comments are closed for this node.");
				$.mobile.changePage("node.html");
				return false;
				break;
			case "2": // Comments open.
				break;
		}
		
		// Clear and load this node's content type.
		drupalgap_page_comment_edit_content_type = null;
		drupalgap_page_comment_edit_content_type = drupalgap_services_content_type_load(drupalgap_page_comment_edit_node.type);
		
		// Set node title header text.
		$('#drupalgap_page_comment_edit h3').html(drupalgap_page_comment_edit_node.title);
		
		// Set the visibility on the subject field
		if (drupalgap_page_comment_edit_content_type.comment_subject_field != "1") {
			$('#drupalgap_page_comment_edit_subject_container').hide();
		}
		
		if (drupalgap_page_comment_edit_cid) {
			// Existing comment.
			
			// Load the comment.
			comment = drupalgap_services_comment_retrieve({"cid":drupalgap_page_comment_edit_cid});
			
			if (!comment) {
				alert("drupalgap_page_comment_edit - Failed to load comment! (" + drupalgap_page_comment_edit_cid + ")");
				return false;
			}
			
			// Set header text.
			$('#drupalgap_page_comment_edit h1').html("Edit Comment");
			
			// Add comment details to form fields.
			$('#drupalgap_page_comment_edit_subject').val(comment.subject);
			
			// Comment body.
			var body;
			if (drupalgap_site_settings.variable.drupal_core == "6") {
				body = comment.comment;
			}
			else if (drupalgap_site_settings.variable.drupal_core == "7") {
				body = comment.comment_body.und[0].value;
			}
			$('#drupalgap_page_comment_edit_body').val(body);
			
			// If the user can administer the comment, show the delete button.
			if (drupalgap_services_user_access({"permission":"administer comments"})) {
				$('#drupalgap_page_comment_edit_delete').show();
			}
		}
		else {
			// New comment.
			
			// Set header text.
			$('#drupalgap_page_comment_edit h1').html("Add Comment");
		}
		
	}
	catch (error) {
		console.log("drupalgap_page_comment_edit");
		console.log(error);
	}
});

$('#drupalgap_page_comment_edit_submit').live('click',function(){
	try {
		
		// Grab input.
		var subject = $('#drupalgap_page_comment_edit_subject').val();
	  	var body = $('#drupalgap_page_comment_edit_body').val();
	  	
	  	// Validate input.
	  	
	  	// Check this comment's node content type comment settings.
	  	if (drupalgap_page_comment_edit_content_type.comment_subject_field == "1" && !subject) {
	  		alert("The subject field is required.");
	  		return false;
	  	}
	  	
	  	if (!body) {
	  		alert('No comment entered.'); 
	  		return false; 
	  	}
	  	
	  	if (drupalgap_page_comment_edit_cid) {
			// Existing comment.
	  		
	  		// retrieve the comment, update the values
		  	comment = drupalgap_services_comment_retrieve({"cid":drupalgap_page_comment_edit_cid,"load_from_local_storage":"0"});
		  	if (!comment) {
				alert("drupalgap_page_comment_edit_submit - failed to load comment (" + drupalgap_page_comment_edit_cid + ")");
			}
		  	else {
		  		// comment was retrieved, update its values
			  	comment.subject = subject;
			  	comment.body = body;
			  	result = drupalgap_services_comment_update(comment);
			  	if (result.errorThrown) {
			  		alert(result.errorThrown);
			  	}
			  	else {
			  		// comment was updated properly
			  		drupalgap_page_comment_edit_cid = null; // clear value before redirecting
				  	$.mobile.changePage("node.html");
			  	}
		  	}
		}
		else {
			// New comment.
			
			// Create the comment.
			comment_create_result = drupalgap_services_comment_create({"nid":drupalgap_page_comment_edit_nid,"body":body,"subject":subject});
		  	
		  	if (comment_create_result.errorThrown) {
		  		alert(comment_create_result.errorThrown);
		  	}
		  	else {
		  		alert("Comment posted!");
		  		$.mobile.changePage("node.html");
		  	}
		}
	}
	catch (error) {
		console.log("drupalgap_page_comment_edit_submit");
		console.log(error);
	}
	
	return false;
});

// cancel button clicked...
$('#drupalgap_page_comment_edit_cancel').live('click',function(){
	try {
		// Go back to the node.
		$.mobile.changePage("node.html");
	}
	catch (error) {
		console.log("drupalgap_page_comment_edit_cancel");
		console.log(error);
	}
	return false;
});

$('#drupalgap_page_comment_edit_delete').live('click',function(){
	try {
		comment = drupalgap_services_comment_retrieve({"cid":drupalgap_page_comment_edit_cid});
	  	if (!comment) {
			alert("drupalgap_page_comment_edit_delete - failed to comment (" + drupalgap_page_comment_edit_cid + ")");
			return false;
		}
		if (confirm("Are you sure you want to delete \"" + comment.subject + "\"? This cannot be undone.")) {
			result = drupalgap_services_comment_delete(comment.cid); 
			if (result == true) {
				$.mobile.changePage("node.html");
			}
			else {
				alert(result.errorThrown);
			}
		}
	}
	catch (error) {
		console.log("drupalgap_page_comment_edit_delete");
		console.log(error);
	}
	return false;
});
