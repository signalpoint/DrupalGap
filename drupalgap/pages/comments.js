var drupalgap_page_comments_nid; // others set this node id so this page knows which comments to load
$('#drupalgap_page_comments').live('pageshow',function(){
	try {
		
		// Clear any previous comment edit id.
		drupalgap_page_comment_edit_cid = null;
		
		// Load node.
		drupalgap_page_comments_node = drupalgap_services_node_retrieve(drupalgap_page_comments_nid);
		if (!drupalgap_page_comments_node) {
			alert("drupalgap_page_comments - failed to load node (" + drupalgap_page_comments_nid + ")");
			return false;
		}
		
		// Set the comment edit node id.
		drupalgap_page_comment_edit_nid = drupalgap_page_comments_node.nid;
		
		// Set node title header text.
		$('#drupalgap_page_comments h3').html(drupalgap_page_comments_node.title);
		
		// Retrieve comments.
		comments = drupalgap_services_comment_node_comments(drupalgap_page_comments_node.nid);
		
		// Clear the list.
		$("#drupalgap_page_comments_list").html("");
		
		// If the comments are open, check to see if user has permission to post comments.
		// If they do, show the add comment button
		if (drupalgap_page_comments_node.comment == "2") {
			post_comments = drupalgap_services_user_access("post comments");
			if (post_comments) {
				$('#drupalgap_page_comments_button_comment_add').show();
			}
		}
		
		// If there are any comments, add each to the container, otherwise show an empty message.
		$.each(comments,function(index,obj){
			
			// Build comment html.
			html = drupalgap_services_comment_render(obj.comment);
			
			// Add comment html to comment container.
			$("#drupalgap_page_comments_list").append(html);
		});
	}
	catch (error) {
		console.log("drupalgap_page_comments");
		console.log(error);
	}
});