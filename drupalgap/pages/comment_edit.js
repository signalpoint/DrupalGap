var drupalgap_page_comment_edit_nid; // other's set this nid so this page knows which node to load
var drupalgap_page_comment_edit_content_type;
var drupalgap_page_comment_edit_cid; // other's set this cid so this page knows which comment to load (if any)
$('#drupalgap_page_comment_edit').live('pageshow',function(){
	try {

		if (drupalgap_page_comment_edit_cid) {
			// Existing comment.
			alert("existing comment");
			return false;
		}
		else {
			// New comment.
			alert("new comment");
		}
		
		// Load node.
		drupalgap_page_comment_edit_node = drupalgap_services_node_retrieve(drupalgap_page_comment_edit_nid);
		if (!drupalgap_page_comment_edit_node) {
			alert("drupalgap_page_comment_edit - failed to load node (" + drupalgap_page_comment_edit_nid + ")");
			return false;
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
		
		// Set header text.
		$('#drupalgap_page_comment_edit h1').html("Add Comment");
		
		// Set node title header text.
		$('#drupalgap_page_comment_edit h3').html(drupalgap_page_comment_edit_node.title);
		
		// Set the visibility on the subject field
		if (drupalgap_page_comment_edit_content_type.comment_subject_field != "1") {
			$('#drupalgap_page_comment_edit_subject_container').hide();
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
	  	
	  	comment_create_result = drupalgap_services_comment_create({"nid":drupalgap_page_comment_edit_nid,"body":body});
	  	
	  	if (comment_create_result.errorThrown) {
	  		alert(comment_create_result.errorThrown);
	  	}
	  	else {
	  		//comment_create_result.cid
	  		alert("Comment posted!");
	  		$.mobile.changePage("node.html");
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
	}
	catch (error) {
		console.log("drupalgap_page_comment_edit_delete");
		console.log(error);
	}
	return false;
});
