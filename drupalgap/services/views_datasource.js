var drupalgap_views_datasource_retrieve_result;

function drupalgap_views_datasource_retrieve (options) {
	try {
		drupalgap_views_datasource_retrieve_result = drupalgap_services_resource_call({"resource_path":options.path,"type":"get"});
	}
	catch (error) {
		console.log("drupalgap_services_node_retrieve");
		console.log(error);
	}
	return drupalgap_views_datasource_retrieve_result;
}
