var drupalgap_page_node_edit_nid;
var drupalgap_page_node_edit_type;
$('#drupalgap_page_node_edit').live('pageshow',function(){
	try {
		
		// Clear form fields.
		$('#drupalgap_page_node_edit_title').val("");
		$('#drupalgap_page_node_edit_body').val("");
		
		if (!drupalgap_page_node_edit_nid) { // new node...
			content_type = drupalgap_services_content_type_load(drupalgap_page_node_edit_type);
			if (!content_type) {
				alert("drupalgap_page_node_edit - failed to load content type (" + drupalgap_page_node_edit_type + ")");
				return false;
			}
			$('#drupalgap_page_node_edit h1').html("Create " + content_type.name);
			$('#drupalgap_page_node_edit_delete').hide();
		}
		else { // existing node...
			
			
			// Build the options to retrieve the node.
			options = {
				"nid":drupalgap_page_node_edit_nid,
				"error":function(jqXHR, textStatus, errorThrown) {
					alert("drupalgap_page_node_edit - failed to load node (" + drupalgap_page_node_edit_nid + ")");
				},
				"success":function(node) {
					// Grab the node's content type.
					content_type = drupalgap_services_content_type_load(node.type);
					
					// Fill in page place holders.
					$('#drupalgap_page_node_edit h1').html("Edit " + content_type.name);
					$('#drupalgap_page_node_edit_title').val(node.title);
					// TODO - the body should really be filled in by the node retrieve
					// resource, that way the body can be accessed through node.body here
					// regardless of which Drupal (6 or 7) version is on the back end.
					var body;
					if (drupalgap_site_settings.variable.drupal_core == "6") {
						body = node.body;
					}
					else if (drupalgap_site_settings.variable.drupal_core == "7") {
						body = node.body.und[0].safe_value;
					}
					$('#drupalgap_page_node_edit_body').val(body);
				},
			}
			
			// Retrieve the node.
			drupalgap_services_node_retrieve.resource_call(options);
		}
	}
	catch (error) {
		console.log("drupalgap_page_node_edit");
		console.log(error);
	}
});

$('#drupalgap_page_node_edit_submit').live('click',function(){
	try {
		
		// Grab input and validate.
		var title = $('#drupalgap_page_node_edit_title').val();
	  	if (!title) { alert('Please enter a title.'); return false; }
	  	var body = $('#drupalgap_page_node_edit_body').val();
	  	if (!body) { alert('Please enter some body content.'); return false; }
	  
	  	if (!drupalgap_page_node_edit_nid) { // new nodes...
	  		options = {
	  			"node":{
	  				"type":drupalgap_page_node_edit_type,
	  				"title":title,
	  				"body":body,
	  			},
	  			"error":function(jqXHR, textStatus, errorThrown) {
	  				alert("drupalgap_page_node_edit_submit - Failed to create " + drupalgap_page_node_edit_type + ", review the debug console log for more information.");
		  		},
		  		"success":function(node) {
		  			// Created node successfully, view the node.
		  			drupalgap_page_node_nid = node.nid;
				  	$.mobile.changePage("node.html");
		  		},
	  		};
		  	drupalgap_services_node_create.resource_call(options);
	  	}
	  	else { // existing nodes...
		  	// Retrieve the node, update the values.
	  		options = {
	  			"nid":drupalgap_page_node_edit_nid,
	  			"error":function(jqXHR, textStatus, errorThrown) {
	  				alert("drupalgap_page_node_edit_submit - failed to load node (" + drupalgap_page_node_edit_nid + ")");
		  		},
		  		"success":function(node) {
		  			// Node was retrieved, update its values.
		  			node.title = title;
		  			node.body = body;
		  			node_update_options = {
		  				"node":node,
		  				"error":function(jqXHR, textStatus, errorThrown) {
		  					alert(result.errorThrown);
		  				},
		  				"success":function(data) {
		  					// Node was updated properly.
						  	$.mobile.changePage("node.html");
		  				},
		  			};
				  	drupalgap_services_node_update.resource_call(node_update_options);
		  		},
	  		};
		  	drupalgap_services_node_retrieve.resource_call(options);
	  	}
	}
	catch (error) {
		console.log("drupalgap_page_node_edit_submit");
		console.log(error);
	}
	return false;
});

// cancel button clicked...
$('#drupalgap_page_node_edit_cancel').live('click',function(){
	try {
		// if it's a new node, send back to content add, otherwise send back to node
		if (!drupalgap_page_node_edit_nid)
			$.mobile.changePage("content_add.html");
		else
			$.mobile.changePage("node.html");
	}
	catch (error) {
		console.log("drupalgap_page_node_edit_cancel");
		console.log(error);
	}
	return false;
});

$('#drupalgap_page_node_edit_delete').live('click',function(){
	try {
		// Retrieve the node, then delete it.
		options = {
			"nid":drupalgap_page_node_edit_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert("drupalgap_page_node_edit_delete - failed to load node (" + drupalgap_page_node_edit_nid + ")");
			},
			"success":function(node) {
				if (confirm("Are you sure you want to delete \"" + node.title + "\"? This cannot be undone.")) {
					node_delete_options = {
						"nid":node.nid,
						"error":function(jqXHR, textStatus, errorThrown) {
							alert(errorThrown);
						},
						"success":function(data) {
							$.mobile.changePage("content.html");
						},
					};
					drupalgap_services_node_delete.resource_call(node_delete_options);
				}
			},
		};
		drupalgap_services_node_retrieve.resource_call(options);
	}
	catch (error) {
		console.log("drupalgap_page_node_edit_delete");
		console.log(error);
	}
	return false;
});
