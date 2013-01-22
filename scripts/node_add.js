$('#drupalgap_page_node_add').on('pageshow',function(){
	try {
		drupalgap.node_edit = {};
		drupalgap.services.drupalgap_content.content_types_user_permissions.call({
			'success':function(data){
				$("#node_add_list").html("");
				$.each(data,function(type,permissions){
					if (permissions.create) {
						$("#node_add_list").append($("<li></li>",{"html":"<a href='node_edit.html' id='" + type + "'>" + type + "</a>"}));
					}
				});
				$("#node_add_list").listview("destroy").listview();
			},
		});
    }
	catch (error) {
		alert("drupalgap_page_node_add - " + error);
	}
});

/**
 * When a content type is clicked, set the drupalgap node_edit type
 * and send the user to the node_edit.html page.
 */
$('#node_add_list a').live('click', function(){
	drupalgap.node_edit = {'type':$(this).attr('id')};
});

