// global variables used to hold the latest system resource call results
var drupalgap_services_node_create_result;
var drupalgap_services_node_update_result;
var drupalgap_services_node_delete_result;

function drupalgap_services_node_create (node) {
	try {
		
		// Build the body parameter.
		var body;
		if (drupalgap_site_settings.variable.drupal_core == "6") {
			body = "node[body]=" + encodeURIComponent(node.body);
		}
		else if (drupalgap_site_settings.variable.drupal_core == "7") {
			body = "node[language]=und&node[body][und][0][value]=" + encodeURIComponent(node.body);
		}
		
		// Make the service call to the node create resource.
		data = "node[type]=" + encodeURIComponent(node.type) + "&node[title]=" + encodeURIComponent(node.title) + "&" + body;
		// "save_to_local_storage":"0"
		options = {"resource_path":"node.json","data":data,};
		result = drupalgap_services_resource_call(options);
		drupalgap_services_node_create_result = result;
	}
	catch (error) {
		console.log("drupalgap_services_node_create");
		console.log(error);
	}
	return drupalgap_services_node_create_result;
}

var drupalgap_services_node_retrieve = {
	
	"resource_path":function(options) {
		// TODO - Need nid validation here.
		return "node/" + encodeURIComponent(options.nid) + ".json";
	},
	"resource_type":"get",
	"resource_result":"",
	
	/** 
	 * Retrieves a Drupal node.
	 * 
	 * options.nid
	 * 		the node id you want to load
	 */
	"resource_call":function(options) {
		try {
		
			this.resource_result = null;
			node = null;
			
			// Validate incoming parameters.
			// TODO - Do a better job validating.
			valid = true;
			if (!options.nid) {
				alert("drupalgap_services_node_retrieve - no node id provided");
				valid = false;
			}
			
			if (valid) {
				// Build the options for the service call.
				resource_path = this.resource_path(options);
				options.resource_path = resource_path;
				options.type = "get";
				// Retrieve the node.
				node = drupalgap_services_resource_call(options);
			}
			
			this.resource_result = node;
		}
		catch (error) {
			console.log("drupalgap_services_node_retrieve");
			console.log(error);
		}
		return this.resource_result;
	},
	
	/**
	 * Removes a node from local storage.
	 * 
	 * options.nid
	 * 		The node id of the node to remove.
	 */
	"local_storage_remove":function(options) {
		type = this.resource_type;
		resource_path = this.resource_path(options);
		key = drupalgap_services_default_local_storage_key(type,resource_path);
		window.localStorage.removeItem(key);
		console.log("Removed from local storage (" + key + ")");
	},
};

function drupalgap_services_node_update (node) {
	try {
		
		// Build body argument according to Drupal version.
		var body;
		if (drupalgap_site_settings.variable.drupal_core == "6") {
			body = "node[body]=" + encodeURIComponent(node.body);
		}
		else if (drupalgap_site_settings.variable.drupal_core == "7") {
			body = "node[language]=und&node[body][und][0][value]=" + encodeURIComponent(node.body);
		}
		
		// Make the service call to node update resource.
		resource_path = "node/" + encodeURIComponent(node.nid) + ".json";
		data = "node[type]=" + node.type + "&node[title]=" + encodeURIComponent(node.title)+ "&" + body;
		options = {
			"resource_path":resource_path,
			"type":"put",
			"data":data,
			"nid":node.nid,
		};
		drupalgap_services_node_update_result = drupalgap_services_resource_call(options);
		
	}
	catch (error) {
		console.log("drupalgap_services_node_update");
		console.log(error);
	}
	
	// Clear node edit values.
	drupalgap_page_node_edit_nid = null;
  	drupalgap_page_node_edit_type = null;
  	
	return drupalgap_services_node_update_result;
}

// Returns true if delete was successful, otherwise returns standard services
// failed object.
function drupalgap_services_node_delete (nid) {
	try {
		// Make the service call to the node delete service.
		resource_path = "node/" + encodeURIComponent(nid) + ".json";
		options = {"resource_path":resource_path,"type":"delete", "nid":nid};
		result = drupalgap_services_resource_call(options);
		drupalgap_services_node_delete_result = result;
	}
	catch (error) {
		console.log("drupalgap_services_node_delete");
		console.log(error);
	}
	
	// Clear node edit values.
	drupalgap_page_node_edit_nid = null;
  	drupalgap_page_node_edit_type = null;
  	
	return drupalgap_services_node_delete_result;
}