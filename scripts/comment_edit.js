$('#drupalgap_comment_edit').on('pagebeforeshow',function(){
	try {
		if (drupalgap.comment_edit.cid) {
			$('#drupalgap_comment_edit h1').html('Edit Comment');
		}
		else {
			$('#drupalgap_comment_edit h1').html('Add Comment');
			$('#comment_delete').hide();
		}
		$('#drupalgap_comment_edit h2').html(drupalgap.node.title);
	}
	catch (error) {
		alert('comment_edit - pagebeforeshow - ' + error);
	}
});

$('#drupalgap_comment_edit').on('pageshow',function(){
	try {
		if (drupalgap.comment_edit.cid) {
		}
		else {
		}
	}
	catch (error) {
		alert('comment_edit - pageshow - ' + error);
	}
});

$('#comment_submit').on('click',function(){
	try {
		var subject = $('#comment_subject').val();
	  	var comment_body = $('#comment_body').val();
	  	if (drupalgap.comment_edit.cid) {
			// Existing comment.
		}
		else {
			// New comment.
			drupalgap.services.comment.create.call({
				'nid':drupalgap.node.nid,
				'subject':subject,
				'comment_body':comment_body,
				'success':function(comment){
					$.mobile.changePage('node.html');
				},
			});
		}
	}
	catch (error) {
		alert('comment_submit - ' + error);
	}
	
	return false;
});

$('#comment_cancel').on('click',function(){
	$.mobile.changePage("node.html");
	return false;
});

$('#comment_delete').on('click',function(){
	try {
		
	}
	catch (error) {
		alert('comment_delete - ' + error);
	}
	return false;
});