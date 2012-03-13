/**
 * Makes a call to DrupalGap's Content Types List Resource.
 *
 * @return
 *  A JSON object containing a list of {node_types} table data.
 *
 */
function drupalgap_services_content_types_list () {
	// If we have a copy of the content types list use it, otherwise make the
	// service call.
	if (!drupalgap_content_types_list) {
		resource_path = "drupalgap_content/content_types_list.json";
		drupalgap_content_types_list = drupalgap_services.resource_call({"resource_path":resource_path});
	}
	return drupalgap_content_types_list;
}

function drupalgap_services_content_type_load (type) {
	if (!type) { return null; }
	content_type = null;
	content_types = drupalgap_services_content_types_list();
	$.each(content_types,function(index,value){
		if (value.type == type) { content_type = value; return; }
	});
	return content_type;
}

/**
 * Makes a call to DrupalGap's Content Types User Permissions Resource.
 *
 * @return
 *  A JSON object containing a list of Drupal Content Types and their associative People->Permissions for the current user.
 */
function drupalgap_services_content_types_user_permissions () {
	// If we have a copy of the content type's user permissions use it,
	// otherwise make the service call.
	if (!drupalgap_content_types_user_permissions) {
		resource_path = "drupalgap_content/content_types_user_permissions.json";
		drupalgap_content_types_user_permissions = drupalgap_services.resource_call({"resource_path":resource_path});
	}
	return drupalgap_content_types_user_permissions;
}