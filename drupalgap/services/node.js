// global variables used to hold the latest system resource call results
var drupalgap_services_node_create_result;
var drupalgap_services_node_retrieve_result;
var drupalgap_services_node_update_result;
var drupalgap_services_node_delete_result;

function drupalgap_services_node_create (node) {
	try {
		data = "node[type]=" + encodeURIComponent(node.type) + "&node[title]=" + encodeURIComponent(node.title) + "&node[language]=und";
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
		drupalgap_services_node_update_result = drupalgap_services_resource_call({"resource_path":"node/" + encodeURIComponent(node.nid) + ".json","type":"put","data":"node[type]=" + node.type + "&node[title]=" + encodeURIComponent(node.title) + "&node[language]=und"});
	}
	catch (error) {
		console.log("drupalgap_services_node_update");
		console.log(error);
	}
	return drupalgap_services_node_update_result;
}

// returns true if delete successfull, otherwise????
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
