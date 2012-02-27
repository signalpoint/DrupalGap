// global variables used to hold the latest system resource call results
var drupalgap_services_node_create_result;
var drupalgap_services_node_retrieve_result;
var drupalgap_services_node_update_result;
var drupalgap_services_node_delete_result;

function drupalgap_services_node_create (node) {
	try {
		var body;
		if (drupalgap_site_settings.variable.drupal_core == "6") {
			body = "node[body]=" + encodeURIComponent(node.body);
		}
		else if (drupalgap_site_settings.variable.drupal_core == "7") {
			body = "node[language]=und&node[body][und][0][value]=" + encodeURIComponent(node.body);
		}
		data = "node[type]=" + encodeURIComponent(node.type) + "&node[title]=" + encodeURIComponent(node.title) + "&" + body;
		drupalgap_services_node_create_result = drupalgap_services_resource_call({"resource_path":"node.json","data":data});
	}
	catch (error) {
		console.log("drupalgap_services_node_create");
		console.log(error);
	}
	return drupalgap_services_node_create_result;
}

/** 
 * Retrieves a drupal node.
 * 
 * options.nid
 * 		the node id you want to load
 * options.from_local_storage
 * 		load node from local storage
 * 		"0" = force reload from node retrieve resource
 * 		"1" = grab from local storage if possible (default)
 */
function drupalgap_services_node_retrieve (options) {
	try {
		
		// If no from_cache option is set, set default.
		if (!options.from_local_storage) {
			options.from_local_storage = "1";
		}
		
		// Try to load the node from local storage if loading from cache.
		node = null;
		if (options.from_local_storage == "1") {
			node = window.localStorage.getItem("node." + options.nid);
		}
		
		// If we don't have the node in local storage, make a node retrieve
		// resource call, then save it in local storage. Otherwise, return
		// the local storage version of the node.
		if (!node) {
			resource_path = "node/" + encodeURIComponent(options.nid) + ".json";
			node = drupalgap_services_resource_call({"resource_path":resource_path,"type":"get"});
			window.localStorage.setItem("node." + options.nid, JSON.stringify(node));
			console.log("saving node to local storage (" + options.nid +")");
		}
		else {
			console.log("loaded node from local storage (" + options.nid +")");
			node = JSON.parse(node);
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
		var body;
		if (drupalgap_site_settings.variable.drupal_core == "6") {
			body = "node[body]=" + encodeURIComponent(node.body);
		}
		else if (drupalgap_site_settings.variable.drupal_core == "7") {
			body = "node[language]=und&node[body][und][0][value]=" + encodeURIComponent(node.body);
		}
		drupalgap_services_node_update_result = drupalgap_services_resource_call({"resource_path":"node/" + encodeURIComponent(node.nid) + ".json","type":"put","data":"node[type]=" + node.type + "&node[title]=" + encodeURIComponent(node.title)+ "&" + body});
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
		resource_path = "node/" + encodeURIComponent(nid) + ".json";
		result = drupalgap_services_resource_call({"resource_path":resource_path,"type":"delete"});
		if (result) {
			window.localStorage.removeItem("node." + nid);
		}
		drupalgap_services_node_delete_result = result;
	}
	catch (error) {
		console.log("drupalgap_services_node_delete");
		console.log(error);
	}
	return drupalgap_services_node_delete_result;
}