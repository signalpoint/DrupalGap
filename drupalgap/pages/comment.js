var drupalgap_page_comment_cid; // other's set this cid so this page knows which comment to load

$('#drupalgap_page_comment').live('pageshow',function(){
	try {
		// load comment
		options = {
			"cid":drupalgap_page_comment_cid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert("drupalgap_page_comment - failed to load comment (" + drupalgap_page_comment_cid + ")");
			},
			"success":function(comment) {
				$('#drupalgap_page_comment .content').html(drupalgap_services_comment_render(comment));
			},
		};
		drupalgap_services_comment_retrieve.resource_call(options);
	}
	catch (error) {
		console.log("drupalgap_page_comment");
		console.log(error);
	}
});