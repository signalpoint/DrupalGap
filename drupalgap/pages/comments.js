var drupalgap_page_comments_nid; // others set this node id so this page knows which comments to load
$('#drupalgap_page_comments').live('pageshow',function(){
	try {
		
		// Load node.
		drupalgap_page_comments_node = drupalgap_services_node_retrieve(drupalgap_page_comments_nid);
		if (!drupalgap_page_comments_node) {
			alert("drupalgap_page_comments - failed to load node (" + drupalgap_page_comments_nid + ")");
			return false;
		}
		
		// Set node title header text.
		$('#drupalgap_page_comments h3').html(drupalgap_page_comments_node.title);
		
		// Retrieve comments.
		comments = drupalgap_services_comment_node_comments(drupalgap_page_comments_node.nid);
		
		// Clear the list.
		$("#drupalgap_page_comments_list").html("");
		
		// Can the user administer comments?
		administer_comments = drupalgap_services_user_access("administer comments");
		
		// Can the user edit their own comments?
		edit_own_comments = drupalgap_services_user_access("edit own comments");
		
		// If there are any comments, add each to the container, otherwise show an empty message.
		$.each(comments,function(index,comment){
			
			// Extract comment creation date.
			created = new Date(parseInt(comment.created)*1000);
			
			// Determine if edit link should be shown.
			show_edit_link = false;
			if (administer_comments || (edit_own_comments && comment.uid == drupalgap_user.uid)) {
				show_edit_link = true;
			}
			
			// Build comment html.
			html = "<div><strong>" + comment.subject + "</strong></div>";
			html += "<div><p>" + comment.name + " | " + created.toDateString() + "</p></div>";
			html += "<div><p>" + comment.comment_body_value + "</p></div>";
			if (show_edit_link) {
				html += "<div><a href='comment_edit.html' cid='" + comment.cid + "' nid='" + comment.nid + "'>edit</a></div>";
			}
			html += "<div><hr /></div>";
			
			// Add comment html to comment container.
			$("#drupalgap_page_comments_list").append(html);
		});
	}
	catch (error) {
		console.log("drupalgap_page_comments");
		console.log(error);
	}
});

// When a comment list item is clicked...
$('#drupalgap_page_comments a').live("click",function(){
	drupalgap_page_comment_edit_cid = $(this).attr('cid');
	drupalgap_page_comment_edit_nid = $(this).attr('nid');
});