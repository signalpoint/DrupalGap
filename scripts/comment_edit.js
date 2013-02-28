$('#drupalgap_comment_edit').on('pagebeforeshow',function(){
	try {
	  drupalgap_form_render('comment_edit', '#drupalgap_comment_edit .content');
	}
	catch (error) {
		alert('comment_edit - pagebeforeshow - ' + error);
	}
});

$('#drupalgap_comment_edit').on('pageshow',function(){
	try {
	}
	catch (error) {
		alert('comment_edit - pageshow - ' + error);
	}
});

$('#edit-comment-edit-cancel').on('click',function(){
    $.mobile.changePage('node.html');
});

$('#edit-comment-edit-delete').on('click',function(){
	try {
		if (confirm('Are you sure you want to delete "' + drupalgap.comment_edit.subject + '"? This cannot be undone.')) {
			drupalgap.services.comment.del.call({
				'cid':drupalgap.comment_edit.cid,
				'success':function(result){
					if (result[0]) {
						alert('Comment deleted!');
					}
					$.mobile.changePage(drupalgap.settings.front);
				},
			});
		}
	}
	catch (error) {
		alert('comment_delete - ' + error);
	}
	return false;
});

