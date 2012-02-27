// global variables used to hold the latest system resource call results
var drupalgap_services_comment_create_result;
var drupalgap_services_comment_retrieve_result;
var drupalgap_services_comment_update_result;
var drupalgap_services_comment_delete_result;
var drupalgap_services_comment_node_comments_result;

function drupalgap_services_comment_create (comment) {
	try {
		
		// Clear last result.
		drupalgap_services_comment_create_result = null;
		
		// Validate incoming parameters.
		valid = true;
		if (!comment.nid) {
			alert("drupalgap_services_comment_create - no node id provided");
			valid = false;
		}
		if (!comment.body) {
			alert("drupalgap_services_comment_create - no comment body provided");
			valid = false;
		}
		
		// If everything is valid, make the service resource call.
		if (valid) {
			
			// Build the data string.
			
			var body;
			if (drupalgap_site_settings.variable.drupal_core == "6") {
				body = "comment=" + encodeURIComponent(comment.body);
			}
			else if (drupalgap_site_settings.variable.drupal_core == "7") {
				body = "comment_body[und][0][value]=" + encodeURIComponent(comment.body);
			}
			data = "nid=" + encodeURIComponent(comment.nid) + "&" + body;
			
			// If they provided a subject, add it to the data string.
			if (comment.subject) {
				data += "&subject=" + encodeURIComponent(comment.subject);
			}
			
			// Make the call.
			drupalgap_services_comment_create_result = drupalgap_services_resource_call({"resource_path":"comment.json","data":data});
		}
	}
	catch (error) {
		console.log("drupalgap_services_comment_create");
		console.log(error);
	}
	return drupalgap_services_comment_create_result;
}

function drupalgap_services_comment_retrieve (cid) {
	try {
		// Clear last result.
		drupalgap_services_comment_retrieve_result = null;
		
		// Validate incoming parameters.
		valid = true;
		if (!cid) {
			alert("drupalgap_services_comment_retrieve - no comment id provided");
			valid = false;
		}
		
		// If everything is valid, make the service resource call.
		if (valid) {
			resource_path = "comment/" + encodeURIComponent(cid) + ".json";
			drupalgap_services_comment_retrieve_result = drupalgap_services_resource_call({"resource_path":resource_path,"type":"get"});
		}
	}
	catch (error) {
		console.log("drupalgap_services_comment_retrieve");
		console.log(error);
	}
	return drupalgap_services_comment_retrieve_result;
}

function drupalgap_services_comment_update(comment) {
	try {
		// Clear last result.
		drupalgap_services_comment_update_result = null;
		
		// Build the data string.
		data = "";
		if (drupalgap_site_settings.variable.drupal_core == "6") {
			data = "comment=" + encodeURIComponent(comment.body);
		}
		else if (drupalgap_site_settings.variable.drupal_core == "7") {
			data = "comment_body[und][0][value]=" + encodeURIComponent(comment.body);
		}
		
		// If they provided a subject, add it to the data string.
		if (comment.subject) {
			data += "&subject=" + encodeURIComponent(comment.subject);
		}
		
		// Make the call.
		resource_path = "comment/" + comment.cid + ".json";
		drupalgap_services_comment_update_result = drupalgap_services_resource_call({"resource_path":resource_path,"data":data,"type":"put"});
		
	}
	catch (error) {
		console.log("drupalgap_services_comment_update");
		console.log(error);
	}
	return drupalgap_services_comment_update_result;
}

function drupalgap_services_comment_delete(cid) {
	try {
		resource_path = "comment/" + encodeURIComponent(cid) + ".json";
		drupalgap_services_comment_delete_result = drupalgap_services_resource_call({"resource_path":resource_path,"type":"delete"});
	}
	catch (error) {
		console.log("drupalgap_services_comment_delete");
		console.log(error);
	}
	return drupalgap_services_comment_delete_result;
}

function drupalgap_services_comment_node_comments(nid) {
	try {
		// Clear last result.
		drupalgap_services_comment_node_comments_result = null;
		
		// Validate incoming parameters.
		valid = true;
		if (!nid) {
			alert("drupalgap_services_comment_node_comments - no node id provided");
			valid = false;
		}
		
		// If everything is valid, make the service resource call.
		if (valid) {
			// retrieve comments
			path = "views_datasource/drupalgap_comments/" + nid;
			drupalgap_services_comment_node_comments_result = drupalgap_views_datasource_retrieve({"path":path});
			drupalgap_services_comment_node_comments_result = drupalgap_services_comment_node_comments_result.comments;
		}
	}
	catch (error) {
		console.log("drupalgap_services_comment_node_comments");
		console.log(error);
	}
	return drupalgap_services_comment_node_comments_result;
}

function drupalgap_services_comment_render (comment) {
	try {
		
		// Can the user administer comments?
		administer_comments = drupalgap_services_user_access({"permission":"administer comments"});
		
		// Can the user edit their own comments?
		edit_own_comments = drupalgap_services_user_access({"permission":"edit own comments"});
		
		// Determine if edit link should be shown.
		show_edit_link = false;
		if (administer_comments || (edit_own_comments && comment.uid == drupalgap_user.uid)) {
			show_edit_link = true;
		}
		
		// Extract comment creation date depending on where it came from.
		if (drupalgap_site_settings.variable.drupal_core == "6") {
			if (comment.timestamp % 1 != 0) {
				// Views JSON.
				created = comment.timestamp;
			}
			else {
				// Comment Retrieve.
				created = new Date(parseInt(comment.timestamp)*1000);
				created = created.toDateString();
			}
		}
		else if (drupalgap_site_settings.variable.drupal_core == "7") {
			if (comment.created % 1 != 0) {
				// Views JSON.
				created = comment.created;
			}
			else {
				// Comment Retrieve.
				created = new Date(parseInt(comment.created)*1000);
				created = created.toDateString();
			}
		}
		
		// Extract body depending on where it came from.
		var body;
		if (typeof(comment.comment_body) == 'object') {
			// The comment retrieve service resource returns the body stuffed into an object.
			if (drupalgap_site_settings.variable.drupal_core == "6") {
				body = comment.comment;
			}
			else if (drupalgap_site_settings.variable.drupal_core == "7") {
				body = comment.comment_body.und[0].value;
			}
		}
		else {
			// Views datasource returns the body as a field.
			if (drupalgap_site_settings.variable.drupal_core == "6") {
				body = comment.comment;
			}
			else if (drupalgap_site_settings.variable.drupal_core == "7") {
				body = comment.comment_body;
			}
		}
		
		// Build comment html.
		html = "<div><strong>" + comment.subject + "</strong></div>";
		html += "<div><p>" + comment.name + "</p></div>";
		html += "<div><p>" + created + "</p></div>";
		html += "<div><p>" + body + "</p></div>";
		
		if (show_edit_link) {
			html += "<div><a href='comment_edit.html' cid='" + comment.cid + "' nid='" + comment.nid + "' class='drupalgap_comment_edit'>edit</a></div>";
		}
		html += "<div><hr /></div>";
		return html;
	}
	catch (error) {
		console.log("drupalgap_services_comment_render");
		console.log(error);
	}
}

// When a comment list item is clicked...
$('a.drupalgap_comment_edit').live("click",function(){
	drupalgap_page_comment_edit_cid = $(this).attr('cid');
	drupalgap_page_comment_edit_nid = $(this).attr('nid');
});