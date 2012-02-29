// global variables used to hold the latest system resource call results
var drupalgap_services_node_create_result;
var drupalgap_services_node_retrieve_result;
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
		result = drupalgap_services_resource_call({"resource_path":"node.json","data":data});
		
		// If the node creation didn't have a problem, remove the default
		// views json content from local storage.
		if (!result.errorThrown) {
			window.localStorage.removeItem("views_datasource.views_datasource/drupalgap_content");
		}
		drupalgap_services_node_create_result = result;
	}
	catch (error) {
		console.log("drupalgap_services_node_create");
		console.log(error);
	}
	return drupalgap_services_node_create_result;
}

/** 
 * Retrieves a Drupal node.
 * 
 * options.nid
 * 		the node id you want to load
 * options.load_from_local_storage
 * 		load node from local storage
 * 		"0" = force reload from node retrieve resource
 * 		"1" = grab from local storage if possible (default)
 */
function drupalgap_services_node_retrieve (options) {
	try {
		
		// Validate incoming parameters.
		valid = true;
		if (!options.nid) {
			alert("drupalgap_services_node_retrieve - no node id provided");
			valid = false;
		}
		
		node = null;
		
		if (valid) {
			
			// If no load_from_local_storage option is set, set default.
			if (!options.load_from_local_storage) {
				options.load_from_local_storage = "1";
			}
			
			// Try to load the node from local storage if loading from cache.
			if (options.load_from_local_storage == "1") {
				node = window.localStorage.getItem("node." + options.nid);
			}
			
			// If we don't have the node in local storage, make a node retrieve
			// resource call, then save it in local storage. Otherwise, return
			// the local storage version of the node.
			if (!node) {
				resource_path = "node/" + encodeURIComponent(options.nid) + ".json";
				node = drupalgap_services_resource_call({"resource_path":resource_path,"type":"get"});
				window.localStorage.setItem("node." + options.nid, JSON.stringify(node));
			}
			else {
				node = JSON.parse(node);
			}
			
		}
		
		drupalgap_services_node_retrieve_result = node;
	}
	catch (error) {
		console.log("drupalgap_services_node_retrieve");
		console.log(error);
	}
	return drupalgap_services_node_retrieve_result;
}

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
		drupalgap_services_node_update_result = drupalgap_services_resource_call({"resource_path":resource_path,"type":"put","data":data});
		
		// If update didn't have any problems, clear the local storage node and
		// the default views json content.
		if (!drupalgap_services_node_update_result.errorThrown) {
			window.localStorage.removeItem("node." + node.nid);
			window.localStorage.removeItem("views_datasource.views_datasource/drupalgap_content");
	  	}
		
	}
	catch (error) {
		console.log("drupalgap_services_node_update");
		console.log(error);
	}
	return drupalgap_services_node_update_result;
}

// Returns true if delete was successful, otherwise returns standard services
// failed object.
function drupalgap_services_node_delete (nid) {
	try {
		// Make the service call to the node delete service.
		resource_path = "node/" + encodeURIComponent(nid) + ".json";
		result = drupalgap_services_resource_call({"resource_path":resource_path,"type":"delete"});
		
		// If the deletion was successful, remove the node from local storage
		// and the default views json content.
		if (result) {
			window.localStorage.removeItem("node." + nid);
			window.localStorage.removeItem("views_datasource.views_datasource/drupalgap_content");
		}
		
		drupalgap_services_node_delete_result = result;
	}
	catch (error) {
		console.log("drupalgap_services_node_delete");
		console.log(error);
	}
	return drupalgap_services_node_delete_result;
}