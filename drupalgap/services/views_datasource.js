//var drupalgap_views_datasource_retrieve_result;

var drupalgap_views_datasource_retrieve = {
		
	"resource_path":"",
	"resource_type":"get",
	"resource_result":"",
	
	/** 
	 * Retrieves a Drupal Views JSON result.
	 * 
	 * views_options.path
	 * 		The path to the views json display.
	 */
	"resource_call":function(views_options){
		try {
			// TODO - Validate views json display path.
			this.resource_result = null;
			this.resource_path = views_options.path;
			options = {"resource_path":this.resource_path, "type":this.resource_type};
			this.resource_result = drupalgap_services_resource_call(options);
			return this.resource_result; 
		}
		catch (error) {
			console.log("drupalgap_views_datasource_retrieve");
			console.log(error);
		}
	},
	/**
	 * Removes a views datasource JSON from local storage.
	 * 
	 * views_options.path
	 * 		The path to the views json display.
	 */
	"local_storage_remove":function(views_options){
		type = this.resource_type;
		resource_path = views_options.path;
		key = drupalgap_services_default_local_storage_key(type,resource_path);
		window.localStorage.removeItem(key);
		console.log("Removed from local storage (" + key + ")");
	},
};


/*function drupalgap_views_datasource_retrieve (options) {
	try {
		drupalgap_views_datasource_retrieve_result = null;
		views_json = drupalgap_services_resource_call({"resource_path":options.path,"type":"get"});
		drupalgap_views_datasource_retrieve_result = views_json;
	}
	catch (error) {
		console.log("drupalgap_views_datasource_retrieve");
		console.log(error);
	}
	return drupalgap_views_datasource_retrieve_result;
}
*/