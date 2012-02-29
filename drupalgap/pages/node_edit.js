var drupalgap_page_node_edit_nid;
var drupalgap_page_node_edit_type;
$('#drupalgap_page_node_edit').live('pageshow',function(){
	try {
		
		// clear form fields
		$('#drupalgap_page_node_edit_title').val("");
		$('#drupalgap_page_node_edit_body').val("");
		
		// re-enable the submit button (in case it was disabled)
		$('#drupalgap_page_node_edit_submit').removeAttr("disabled");
		
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
			node = drupalgap_services_node_retrieve({"nid":drupalgap_page_node_edit_nid,"load_from_local_storage":"0"});
			content_type = drupalgap_services_content_type_load(node.type);
			$('#drupalgap_page_node_edit h1').html("Edit " + content_type.name);
			if (!node) {
				alert("drupalgap_page_node_edit - failed to load node (" + drupalgap_page_node_edit_nid + ")");
				return false;
			}
			$('#drupalgap_page_node_edit_title').val(node.title);
			var body;
			if (drupalgap_site_settings.variable.drupal_core == "6") {
				body = node.body;
			}
			else if (drupalgap_site_settings.variable.drupal_core == "7") {
				body = node.body.und[0].safe_value;
			}
			$('#drupalgap_page_node_edit_body').val(body);
		}
	}
	catch (error) {
		console.log("drupalgap_page_node_edit");
		console.log(error);
	}
});

$('#drupalgap_page_node_edit_submit').live('click',function(){
	try {
		
		// grab input and validate
		var title = $('#drupalgap_page_node_edit_title').val();
	  	if (!title) { alert('Please enter a title.'); return false; }
	  	var body = $('#drupalgap_page_node_edit_body').val();
	  	if (!body) { alert('Please enter some body content.'); return false; }
	  	
	    // disable the submit button to prevent double submit
		$('#drupalgap_page_node_edit_submit').attr("disabled","disabled");
	  
	  	if (!drupalgap_page_node_edit_nid) { // new nodes...
		  	node = drupalgap_services_node_create({"type":drupalgap_page_node_edit_type,"title":title,"body":body});
		  	if (!node.nid) {
			  	alert("drupalgap_page_node_edit_submit - Failed to create " + drupalgap_page_node_edit_type + ", review the debug console log for more information.");
		  	}
		  	else { // created node successfully, view the node...
			  	drupalgap_page_node_nid = node.nid;
			  	$.mobile.changePage("node.html");
		  	}
	  	}
	  	else { // existing nodes...
		  	// retrieve the node, update the values
		  	node = drupalgap_services_node_retrieve({"nid":drupalgap_page_node_edit_nid,"load_from_local_storage":"0"});
		  	if (!node) {
				alert("drupalgap_page_node_edit_submit - failed to load node (" + drupalgap_page_node_edit_nid + ")");
			}
		  	else {
		  		// node was retrieved, update its values
			  	node.title = title;
			  	node.body = body;
			  	result = drupalgap_services_node_update(node);
			  	if (result.errorThrown) {
			  		alert(result.errorThrown);
			  	}
			  	else {
			  		// Node was updated properly, clear node editing variables.
				  	drupalgap_page_node_edit_nid = null; // clear value before redirecting
				  	drupalgap_page_node_edit_type = null; // clear value before redirecting
				  	$.mobile.changePage("node.html");
			  	}
		  	}
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
		node = drupalgap_services_node_retrieve({"nid":drupalgap_page_node_edit_nid});
	  	if (!node) {
			alert("drupalgap_page_node_edit_delete - failed to load node (" + drupalgap_page_node_edit_nid + ")");
			return false;
		}
		if (confirm("Are you sure you want to delete \"" + node.title + "\"? This cannot be undone.")) {
			result = drupalgap_services_node_delete(node.nid); 
			if (result == true) {
				$.mobile.changePage("content.html");
			}
			else {
				alert(result.errorThrown);
			}
		}
	}
	catch (error) {
		console.log("drupalgap_page_node_edit_delete");
		console.log(error);
	}
	return false;
});
