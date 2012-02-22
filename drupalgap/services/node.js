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

function drupalgap_services_node_retrieve (nid) {
	try {
		drupalgap_services_node_retrieve_result = drupalgap_services_resource_call({"resource_path":"node/" + encodeURIComponent(nid) + ".json","type":"get"});
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

/* returns true if delete was successful, otherwise returns standard services failed object, for example:
 * {
    	"jqXHR": {
        	"readyState": 4,
        	"responseText": "null",
        	"status": 401,
        	"statusText": "Unauthorized: Access denied for user anonymous"
    	},
    	"textStatus": "error",
    	"errorThrown": "Unauthorized: Access denied for user anonymous"
	}
 */
function drupalgap_services_node_delete (nid) {
	try {
		drupalgap_services_node_delete_result = drupalgap_services_resource_call({"resource_path":"node/" + encodeURIComponent(nid) + ".json","type":"delete"});
	}
	catch (error) {
		console.log("drupalgap_services_node_delete");
		console.log(error);
	}
	return drupalgap_services_node_delete_result;
}
