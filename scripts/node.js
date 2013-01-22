$('#drupalgap_node').on('pagebeforeshow', function(){
	$('#node_comments').hide();
	$('#comment_add').hide();
});

$('#drupalgap_node').on('pageshow', function(){
	drupalgap.services.node.retrieve.call({
		'nid':drupalgap.node.nid,
		'success':function(node){
			$('#node_type').html(node.type);
			$('#node_title').html(node.title);
			$('#node_content').html(node.content);
			if (node.uid == drupalgap.user.uid) {
				$('#node_edit').show();
			}
			
			// Depending on the node's comment settings, set the appropriate
			// visibility on the comment button.
			// 1 = Closed, 2 = Open
			switch (node.comment) {
				case '1':
					if (node.comment_count > 0) { $('#node_comments').show(); }
					break;
				case '2':
					if (node.comment_count > 0) { $('#node_comments').show(); }
					$('#comment_add').show();
					break;
			}
			if ((node.comment == 1 || node.comment == 2) && node.comment_count > 0) {
				var view_comment_text = 'View ' + node.comment_count + ' ' + drupalgap_format_plural(node.comment_count, 'Comment', 'Comments');
				$('#node_comments span').html(view_comment_text);
			}
		},
	});
});

$('#node_edit').on('click', function(){
	drupalgap.node_edit.nid = drupalgap.node.nid;
	drupalgap.node_edit.type = drupalgap.node.type;
});

$('#node_comments').on('click', function(){
});

$('#comment_add').on('click', function(){
});
