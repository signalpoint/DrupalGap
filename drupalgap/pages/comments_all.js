$('#drupalgap_page_comments_all').live('pageshow',function(){
	try {
		
		// Clear the list.
		$("#drupalgap_page_comments_all_list").html("");
		
		// Build options to retrieve comments.
		views_options = {
			"path":"views_datasource/drupalgap_comments",
			"error":function(jqXHR, textStatus, errorThrown) {
				// Refresh the list.
				$("#drupalgap_page_comments_all_list").listview("destroy").listview();
			},
			"success":function(comments_result) {
				
				// If there are any comments, add them to the list.
				if ($(comments_result.comments).length > 0) {
					$.each(comments_result.comments,function(index,obj){
						$("#drupalgap_page_comments_all_list").append($("<li></li>",{"html":"<a href='comment.html' cid='" + obj.comment.cid + "'>" + obj.comment.subject + "</a>"}));
					});
				}
				else {
					$("#drupalgap_page_comments_all_list").append($("<li></li>",{"html":"Sorry, there are no published comments."}));
				}
				
				// Refresh the list.
				$("#drupalgap_page_comments_all_list").listview("destroy").listview();
			},
		};
		
		// Retrieve comments
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		console.log("drupalgap_page_comments_all");
		console.log(error);
	}
});

//When a comment list item is clicked...
$('#drupalgap_page_comments_all_list a').live("click",function(){
	// Save a reference to the comment id.
	drupalgap_page_comment_cid = $(this).attr('cid');
});