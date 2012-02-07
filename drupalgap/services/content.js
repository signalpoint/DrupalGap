/**
 * Makes a synchronous call to DrupalGap's Content Types List Resource.
 *
 * @return
 *  A JSON object containing a list of {node_types} table data.
 *   
 *  An example response:
 *
 *  
 [
	{
        "type": "article",
        "name": "Article",
        "base": "node_content",
        "module": "node",
        "description": "Use <em>articles</em> for time-sensitive content like news, press releases or blog posts.",
        "help": "",
        "has_title": "1",
        "title_label": "Title",
        "custom": "1",
        "modified": "1",
        "locked": "0",
        "disabled": "0",
        "orig_type": "article",
        "comment_anonymous": 0,
        "comment": "2",
        "comment_default_mode": 1,
        "comment_default_per_page": "50",
        "comment_form_location": 1,
        "comment_preview": "1",
        "comment_subject_field": 1
    },
    {
        "type": "page",
        "name": "Basic page",
        "base": "node_content",
        "module": "node",
        "description": "Use <em>basic pages</em> for your static content, such as an 'About us' page.",
        "help": "",
        "has_title": "1",
        "title_label": "Title",
        "custom": "1",
        "modified": "1",
        "locked": "0",
        "disabled": "0",
        "orig_type": "page",
        "comment_anonymous": 0,
        "comment_default_mode": 1,
        "comment_default_per_page": "50",
        "comment_form_location": 1,
        "comment": "0",
        "comment_preview": "1",
        "comment_subject_field": 1
    },
]
 *
 */
function drupalgap_services_content_types_list () {
	return drupalgap_services_resource_call({"resource_path":"drupalgap_content/content_types_list.json"});
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
 * Makes a synchronous call to DrupalGap's Content Types User Permissions Resource.
 *
 * @return
 *  A JSON object containing a list of Drupal Content Types and their associative People->Permissions for the current user.
 *   
 *  An example response:
 *   
 *  {
 *  	"article":{
 *      	"create":false,
 *       	"delete any":false,
 *       	"delete own":false,
 *       	"edit any":false,
 *       	"edit own":false
 *      },
 *      "page":{
 *      	"create":false,
 *      	"delete any":false,
 *      	"delete own":false,
 *      	"edit any":false,
 *      	"edit own":false
 *      }
 *	}
 *
 */
function drupalgap_services_content_types_user_permissions () {
	return drupalgap_services_resource_call({"resource_path":"drupalgap_content/content_types_user_permissions.json"});
}