var drupalgap_views_datasource_retrieve_result;

/** 
 * Retrieves a Drupal Views JSON result.
 * 
 * options.path
 * 		the path to the views json display
 * options.load_from_local_storage
 * 		load node from local storage
 * 		"0" = force reload from views datasource
 * 		"1" = grab from local storage if possible (default)
 */
function drupalgap_views_datasource_retrieve (options) {
	try {
		
		// If no load_from_local_storage option is set, set default.
		if (!options.load_from_local_storage) {
			options.load_from_local_storage = "1";
		}
		
		// Try to load the views json from local storage, if necessary.
		if (options.load_from_local_storage == "1") {
			views_json = window.localStorage.getItem("views_datasource." + options.path);
		}
		
		// If we don't have the views json in local storage, make a views json
		// call, then save it in local storage. Otherwise, return
		// the local storage version of the views json.
		if (!views_json) {
			views_json = drupalgap_services_resource_call({"resource_path":options.path,"type":"get"});
			window.localStorage.setItem("views_datasource." + options.path, JSON.stringify(views_json));
			console.log("saving views json to local storage (" + options.path +")");
		}
		else {
			console.log("loaded views json from local storage (" + options.path +")");
			views_json = JSON.parse(views_json);
		}
		
		drupalgap_views_datasource_retrieve_result = views_json;
	}
	catch (error) {
		console.log("drupalgap_views_datasource_retrieve");
		console.log(error);
	}
	return drupalgap_views_datasource_retrieve_result;
}
