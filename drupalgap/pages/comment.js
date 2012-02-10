var drupalgap_page_comment_cid; // other's set this cid so this page knows which comment to load

$('#drupalgap_page_comment').live('pageshow',function(){
	try {
		// load comment
		comment = drupalgap_services_comment_retrieve(drupalgap_page_comment_cid);
		if (!comment) {
			alert("drupalgap_page_comment - failed to load comment (" + drupalgap_page_comment_cid + ")");
			return false;
		}
		$('#drupalgap_page_comment .content').html(drupalgap_services_comment_render(comment));
	}
	catch (error) {
		console.log("drupalgap_page_comment");
		console.log(error);
	}
});