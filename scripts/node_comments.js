$('#drupalgap_node_comments').on('pagebeforeshow',function(){
	$('#node_comments_add').hide();
});

$('#drupalgap_node_comments').on('pageshow',function(){
	try {
		$("#node_comments_list").html("");
		drupalgap.services.node.retrieve.call({
			'nid':drupalgap.node.nid,
			'success':function(node){
				$('#drupalgap_node_comments h2').html(node.title);
				if (node.comment == 2) { $('#node_comments_add').show(); }
				drupalgap.views_datasource.call({
					'path':'drupalgap/views_datasource/drupalgap_comments/' + node.nid,
					'success':function(results){
						$.each(results.comments, function(index, object){
							$("#node_comments_list").append($("<li></li>",{"html":
								object.comment.created + "<br />" +
								'Author: ' + object.comment.name + "<br />" +
								'Subject: ' + object.comment.subject + "<br />" +
								'Comment:<br />' + object.comment.comment_body + "<hr />"
							}));
						});
						$("#node_comments_list").listview("destroy").listview();
					}
				});
			}
		});
	}
	catch (error) {
		alert('drupalgap_node_comments - pageshow - ' + error);
	}
});