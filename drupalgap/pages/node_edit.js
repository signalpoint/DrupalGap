var drupalgap_page_node_edit_nid;
var drupalgap_page_node_edit_type;
$('#drupalgap_page_node_edit').live('pageshow',function(){
	try {
		
		content_type = drupalgap_services_content_type_load(drupalgap_page_node_edit_type);
		
		if (!content_type) {
			alert("drupalgap_page_node_edit - failed to load content type (" + drupalgap_page_node_edit_type + ")");
			return false;
		}
		
		if (!drupalgap_page_node_edit_nid) {
			// new node...
			$('#drupalgap_page_node_edit h1').html("Create " + content_type.name);
			$('#drupalgap_page_node_edit_delete').hide();
		}
		else {
			// existing node...
			$('#drupalgap_page_node_edit h1').html("Edit " + content_type.name);
			node = drupalgap_services_node_retrieve(drupalgap_page_node_edit_nid);
			if (!node) {
				alert("drupalgap_page_node_edit - failed to load node (" + drupalgap_page_node_edit_nid + ")");
				return false;
			}
			$('#drupalgap_page_node_edit_title').val(node.title);
		}
	}
	catch (error) {
		console.log("drupalgap_page_node_edit");
		console.log(error);
	}
});

$('#drupalgap_page_node_edit_submit').live('click',function(){
	try {
		var title = $('#drupalgap_page_node_edit_title').val();
	  	if (!title) { alert('Please enter a title.'); return false; }
	  
	  	if (!drupalgap_page_node_edit_nid) { // new nodes...
		  	node = drupalgap_services_node_create({"type":drupalgap_page_node_edit_type,"title":title});
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
		  	node = drupalgap_services_node_retrieve(drupalgap_page_node_edit_nid);
		  	if (!node) {
				alert("drupalgap_page_node_edit_submit - failed to load node (" + drupalgap_page_node_edit_nid + ")");
				return false;
			}
		  	node.title = title;
		  	drupalgap_services_node_update(node);
		  	$.mobile.changePage("node.html");
	  	}
	}
	catch (error) {
		console.log("drupalgap_page_node_edit_submit");
		console.log(error);
	}
	return false;
});

$('#drupalgap_page_node_edit_delete').live('click',function(){
	try {
		node = drupalgap_services_node_retrieve(drupalgap_page_node_edit_nid);
	  	if (!node) {
			alert("drupalgap_page_node_edit_delete - failed to load node (" + drupalgap_page_node_edit_nid + ")");
			return false;
		}
		if (confirm("Are you sure you want to delete \"" + node.title + "\"? This cannot be undone.")) {
			if (drupalgap_services_node_delete(node.nid))
				$.mobile.changePage("dashboard.html");
			else
				alert("drupalgap_page_node_edit_delete - failed to delete node, check console log for more information");
		}
	}
	catch (error) {
		console.log("drupalgap_page_node_edit_delete");
		console.log(error);
	}
	return false;
});
