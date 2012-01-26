$('#drupalgap_page_content_add').live('pageshow',function(){
	try {
		// grab list of content type permissions for this user
		content_types_list = drupalgap_services_content_types_list();
		content_types_user_permissions = drupalgap_services_content_types_user_permissions();
		$("#drupalgap_page_content_add_list").html(""); // clear the content type list
		$.each(content_types_user_permissions,function(type,permissions){ // for each content type...
			// if they have create permissions, show add button for this content type
			if (permissions.create) {
				content_type = drupalgap_services_content_type_load(type);
				if (content_type) { $("#drupalgap_page_content_add_list").append($("<li></li>",{"html":"<a href='#'>" + content_type.name + "</a>"})); }
			}
		});
		$("#drupalgap_page_content_add_list").listview("destroy").listview(); // refresh the content type list
	}
	catch (error) {
		console.log("drupalgap_page_content_add - " + error);
	}
});
