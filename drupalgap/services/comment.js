// global variables used to hold the latest system resource call results
var drupalgap_services_comment_node_comments_result;

var drupalgap_services_comment_create  = {
	"resource_path":"comment.json",
	"resource_type":"post",
	
	"resource_call":function(caller_options) {
		try {
			
			// Extract comment from caller options.
			comment = caller_options.comment;
			
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
				options = {
					"resource_path":this.resource_path,
					"type":this.resource_type,
					"async":true,
					"data":data,
					"nid":comment.nid,
					"error":function(jqXHR, textStatus, errorThrown) {
					},
					"success":function(data) {
					},
				};
				
				// Attach error/success hooks if provided.
				if (caller_options.error) {
					options.hook_error = caller_options.error;
				}
				if (caller_options.success) {
					options.hook_success = caller_options.success;
				}
				
				drupalgap_services.resource_call(options);
			}
		}
		catch (error) {
			console.log("drupalgap_services_comment_create");
			console.log(error);
		}
	}
};

var drupalgap_services_comment_retrieve = {
	
	"resource_path":function(options) {
		// TODO - Need cid validation here.
		return "comment/" + encodeURIComponent(options.cid) + ".json";
	},
	"resource_type":"get",
	
	/** 
	 * Retrieves a Drupal comment.
	 * 
	 * options.cid
	 * 		the comment id you want to load
	 */
	"resource_call":function(caller_options) {
		try {
			
			// Validate incoming parameters.
			valid = true;
			if (!caller_options.cid) {
				alert("drupalgap_services_comment_retrieve - no comment id provided");
				valid = false;
			}
			
			// If everything is valid, retrieve the comment.
			if (valid) {
				
				// Build the options for the service call.
				options = {
					"resource_path":this.resource_path({"cid":caller_options.cid}),
					"type":this.resource_type,
					"async":true,
					"error":function(jqXHR, textStatus, errorThrown) {
					},
					"success":function(data) {
						
					},
				};
				
				// Attach error/success hooks if provided.
				if (caller_options.error) {
					options.hook_error = caller_options.error;
				}
				if (caller_options.success) {
					options.hook_success = caller_options.success;
				}
				
				// Make the service call.
				drupalgap_services.resource_call(options);
			}
		}
		catch (error) {
			console.log("drupalgap_services_comment_retrieve");
			console.log(error);
		}
	},
	
	/**
	 * Removes a comment from local storage.
	 * 
	 * options.cid
	 * 		The comment id of the comment to remove.
	 */
	"local_storage_remove":function(options) {
		type = this.resource_type;
		resource_path = this.resource_path(options);
		key = drupalgap_services_default_local_storage_key(type,resource_path);
		window.localStorage.removeItem(key);
		console.log("Removed from local storage (" + key + ")");
	},
};

var drupalgap_services_comment_update = {
	
	"resource_path":function(options) {
		// TODO - Need cid validation here.
		return "comment/" + encodeURIComponent(options.cid) + ".json";
	},
	"resource_type":"put",
	
	"resource_call":function(caller_options) {
		try {
			// Extract the comment from the caller options.
			comment = caller_options.comment;
			
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
			
			// Build the options for the service call.
			options = {
				"resource_path":this.resource_path({"cid":comment.cid}),
				"type":this.resource_type,
				"data":data,
				"cid":comment.cid,
				"nid":comment.nid,
				"async":true,
				"error":function(jqXHR, textStatus, errorThrown) {
				},
				"success":function(data) {
					// Clear the comment edit cid.
					drupalgap_page_comment_edit_cid = null;
				},
			};
			
			// Attach error/success hooks if provided.
			if (caller_options.error) {
				options.hook_error = caller_options.error;
			}
			if (caller_options.success) {
				options.hook_success = caller_options.success;
			}
			
			// Make the service call.
			drupalgap_services.resource_call(options);
		}
		catch (error) {
			console.log("drupalgap_services_comment_update");
			console.log(error);
		}
	}
};

var drupalgap_services_comment_delete = {
	
	"resource_path":function(options) {
		// TODO - Need cid validation here.
		return "comment/" + encodeURIComponent(options.cid) + ".json";
	},
	"resource_type":"delete",
	
	"resource_call":function(caller_options) {
		try {
			
			// Build the options to retrieve the comment.
			options = {
				"cid":caller_options.cid,
				"error":function(jqXHR, textStatus, errorThrown) {
				},
				"success":function(comment) {
					
					// Build the service call options to delete the comment.
					resource_path = "comment/" + encodeURIComponent(comment.cid) + ".json";
					comment_delete_options = {
						"resource_path":resource_path,
						"type":"delete",
						"async":true,
						"cid":comment.cid,
						"nid":comment.nid,
						"error":function(jqXHR, textStatus, errorThrown) {
						},
						"success":function(data) {
							// Clear the comment edit cid.
							drupalgap_page_comment_edit_cid = null;
						},
					};
					
					// Attach error/success hooks if provided.
					if (caller_options.error) {
						comment_delete_options.hook_error = caller_options.error;
					}
					if (caller_options.success) {
						comment_delete_options.hook_success = caller_options.success;
					}
					
					// Make the service call to delete the comment.
					drupalgap_services.resource_call(comment_delete_options);
				},
			};
			
			// Make the service call to retrieve the comment.
			drupalgap_services_comment_retrieve.resource_call(options);
		}
		catch (error) {
			console.log("drupalgap_services_comment_delete");
			console.log(error);
		}
	}
};

var drupalgap_services_comment_node_comments = {
	"resource_path":function(options){
		return "views_datasource/drupalgap_comments/" + options.nid;
	},
	"resource_call":function(caller_options) {
		try {
			
			// Validate incoming parameters.
			valid = true;
			if (!caller_options) {
				alert("drupalgap_services_comment_node_comments - no node id provided");
				valid = false;
			}
			
			// If everything is valid, make the service resource call.
			if (valid) {
				
				views_options = {
					"path":this.resource_path({"nid":caller_options.nid}),
				};
				
				// Override error/success hooks if provided.
				// (this is a views datasource special case)
				if (caller_options.error) {
					views_options.error = caller_options.error;
				}
				if (caller_options.success) {
					views_options.success = caller_options.success;
				}
				
				drupalgap_views_datasource_retrieve.resource_call(views_options);
			}
		}
		catch (error) {
			console.log("drupalgap_services_comment_node_comments");
			console.log(error);
		}
	}
};

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