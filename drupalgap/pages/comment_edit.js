var drupalgap_page_comment_edit_nid; // other's set this nid so this page knows which node to load
var drupalgap_page_comment_edit_content_type;
var drupalgap_page_comment_edit_cid; // other's set this cid so this page knows which comment to load (if any)
$('#drupalgap_page_comment_edit').live('pageshow',function(){
	try {
		
		// Load node.
		nid = drupalgap_page_comment_edit_nid;
		options = {
			"nid":nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert("drupalgap_page_comment_edit - failed to load node (" + nid + ")");
			},
			"success":function(drupalgap_page_comment_edit_node) {
				
				// Set the page nid in case it wasn't set.
				drupalgap_page_node_nid = nid;
				
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
					options = {
						"cid":drupalgap_page_comment_edit_cid,
						"error":function(jqXHR, textStatus, errorThrown) {
							alert("drupalgap_page_comment_edit - Failed to load comment! (" + drupalgap_page_comment_edit_cid + ")");
						},
						"success":function(comment) {
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
						},
					};
					drupalgap_services_comment_retrieve.resource_call(options);
				}
				else {
					// New comment.
					
					// Set header text.
					$('#drupalgap_page_comment_edit h1').html("Add Comment");
				}
			},
		};
		drupalgap_services_node_retrieve.resource_call(options);
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
	  		
	  		// Retrieve the comment, update the values.
	  		options = {
	  			"cid":drupalgap_page_comment_edit_cid,
	  			"error":function(jqXHR, textStatus, errorThrown) {
	  				alert("drupalgap_page_comment_edit_submit - failed to load comment (" + drupalgap_page_comment_edit_cid + ")");
		  		},
		  		"success":function(comment) {
		  			// Comment was retrieved, update its values.
				  	comment.subject = subject;
				  	comment.body = body;
				  	comment_update_options = {
				  		"comment":comment,
				  		"error":function(jqXHR, textStatus, errorThrown) {
				  		alert(result.errorThrown);
					  	},
					  	"success":function(data) {
					  		// Comment was updated properly.
						  	$.mobile.changePage("node.html");
					  	},
				  	};
				  	drupalgap_services_comment_update.resource_call(comment_update_options);
		  		},
	  		};
		  	drupalgap_services_comment_retrieve.resource_call(options);
		}
		else {
			// New comment.
			
			// Create the comment.
			options = {
				"comment":{
					"nid":drupalgap_page_comment_edit_nid,
					"body":body,
					"subject":subject,
				},
				"error":function(jqXHR, textStatus, errorThrown) {
					alert(errorThrown);
				},
				"success":function(comment_create_result) {
					alert("Comment posted!");
			  		$.mobile.changePage("node.html");
				},
			};
			drupalgap_services_comment_create.resource_call(options);
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
		options = {
			"cid":drupalgap_page_comment_edit_cid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert("drupalgap_page_comment_edit_delete - failed to comment (" + drupalgap_page_comment_edit_cid + ")");
			},
			"success":function(comment) {
				if (confirm("Are you sure you want to delete \"" + comment.subject + "\"? This cannot be undone.")) {
					comment_delete_options = {
						"cid":comment.cid,
						"error":function(jqXHR, textStatus, errorThrown) {
							alert(result.errorThrown);
						},
						"success":function(data) {
							$.mobile.changePage("node.html");
						},
					};
					drupalgap_services_comment_delete.resource_call(comment_delete_options);
				}
			},
		};
		drupalgap_services_comment_retrieve.resource_call(options);
	}
	catch (error) {
		console.log("drupalgap_page_comment_edit_delete");
		console.log(error);
	}
	return false;
});