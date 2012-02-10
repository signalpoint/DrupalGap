$('#drupalgap_page_comments_all').live('pageshow',function(){
	try {
		// retrieve comments
		comments_result = drupalgap_views_datasource_retrieve({"path":"views_datasource/drupalgap_comments"});
		
		// clear the list
		$("#drupalgap_page_comments_all_list").html("");
		
		// if there are any content, add each to the list, otherwise show an empty message
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