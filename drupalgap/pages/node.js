var drupalgap_page_node;
var drupalgap_page_node_nid; // other's set this nid so this page knows which node to load
$('#drupalgap_page_node').live('pageshow',function(){
	try {
		
		// load node
		drupalgap_page_node = drupalgap_services_node_retrieve(drupalgap_page_node_nid);
		if (!drupalgap_page_node) {
			alert("drupalgap_page_node - failed to load node (" + drupalgap_page_node_nid + ")");
			return false;
		}
		
		// Clear any previous node edit id reference.
		drupalgap_page_node_edit_nid = null;
		
		// Clear any previous node comment nid reference.
		drupalgap_page_comment_edit_nid = null;
		
		// Fill in placeholders.
		$('#drupalgap_page_node h1').html(drupalgap_page_node.title);
		$('#drupalgap_page_node .content').html(drupalgap_page_node.body.und[0].safe_value);
		
		// Set edit button visibility
		// If user is not user 1 and user is not node author, hide the edit button, otherwise show it.
		if (drupalgap_user.uid != 1 && drupalgap_user.uid != drupalgap_page_node.uid) {	
			$('#drupalgap_page_node_button_edit').hide();
		}
		else {
			$('#drupalgap_page_node_button_edit').show();
		}
		
		// Set comments and comment button visibility.
		switch (drupalgap_page_node.comment) {
			case "0": // comments hidden
				$('#drupalgap_page_node_comments').hide();
				$('#drupalgap_page_node_button_comment_edit').hide();
				$('#drupalgap_page_node_button_comments').hide();
				break;
			case "1": // comments closed
				$('#drupalgap_page_node_comments').show();
				$('#drupalgap_page_node_button_comment_edit').hide();
				$('#drupalgap_page_node_button_comments').show();
				break;
			case "2": // comments open
				// @todo - check user's permissions for comments before showing buttons
				$('#drupalgap_page_node_comments').show();
				$('#drupalgap_page_node_button_comment_edit').show();
				$('#drupalgap_page_node_button_comments').show();
				break;
		}
		
		// If there are any comments, show the comment count on the view comments button
		if (drupalgap_page_node.comment_count) {
			count = parseInt(drupalgap_page_node.comment_count);
			if (count > 0) {
				text = "View " + count + " Comments";
				if (count == 1) { text = "View " + count + " Comment" }
				$('#drupalgap_page_node_button_comments span').html(text);
			}
		}
		
		// As a last resort, check the user's access permissions for comments.
		// Check to make sure the user has permission view comments.
		if (!drupalgap_services_user_access("access comments")) {
			$('#drupalgap_page_node_button_comments').hide();
		}
		// Check to make sure the user has permission to post comments.
		if (!drupalgap_services_user_access("post comments")) {
			$('#drupalgap_page_node_button_comment_edit').hide();
		}
		
	}
	catch (error) {
		console.log("drupalgap_page_node");
		console.log(error);
	}
});

$('#drupalgap_page_node_button_edit').live("click",function(){
	// Set the node edit nid.
	drupalgap_page_node_edit_nid = drupalgap_page_node_nid;
});

$('#drupalgap_page_node_button_comments').live("click",function(){
	// Set the comment nid.
	drupalgap_page_comments_nid = drupalgap_page_node_nid;
});

$('#drupalgap_page_node_button_comment_edit').live("click",function(){
	// Set the comment nid.
	drupalgap_page_comment_edit_nid = drupalgap_page_node_nid;
});