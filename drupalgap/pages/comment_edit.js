$('#drupalgap_page_comment').live('pageshow',function(){
	try {
		
	}
	catch (error) {
		console.log("drupalgap_page_comment");
		console.log(error);
	}
});

$('#drupalgap_page_comment_submit').live('click',function(){
	try {
		
		// grab input and validate
		var subject = $('#drupalgap_page_comment_subject').val();
	  	var comment = $('#drupalgap_page_comment_comment').val();
	  	if (!comment) { alert('No comment entered.'); return false; }
	  	
	    // disable the submit button to prevent double submit
		$('#drupalgap_page_comment_submit').attr("disabled","disabled");
	}
	catch (error) {
		console.log("drupalgap_page_comment_submit");
		console.log(error);
	}
	
	return false;
});

// cancel button clicked...
$('#drupalgap_page_comment_cancel').live('click',function(){
	try {
	}
	catch (error) {
		console.log("drupalgap_page_comment_cancel");
		console.log(error);
	}
	return false;
});

$('#drupalgap_page_comment_delete').live('click',function(){
	try {
	}
	catch (error) {
		console.log("drupalgap_page_comment_delete");
		console.log(error);
	}
	return false;
});
