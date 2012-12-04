$('#drupalgap_page_node_add').live('pageshow',function(){
	try {
		options = drupalgap.services.drupalgap_content.content_types_user_permissions.call({
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
		if (drupalgap.settings.debug) {
			console.log("drupalgap_page_node_add - " + error);
		}
	}
});
