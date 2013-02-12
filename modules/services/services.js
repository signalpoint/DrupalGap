/**
 * 
 */
function drupalgap_service_resource_extract_results(options) {
	try {
		if (options.service == 'drupalgap_system' || options.service == 'drupalgap_user') {
			if (options.resource == 'connect' || options.resource == 'login') {
				// Depending on the service resource, extract the permissions
				// from the options data.
				permissions = {};
				if (options.service == 'drupalgap_system' && options.resource == 'connect') {
					permissions = options.data.user_roles_and_permissions; 
				}
				else if (options.service == 'drupalgap_user' && options.resource == 'login') {
					permissions = options.data.drupalgap_system_connect.user_permissions; 
				}
				// Now iterate over the extracted user_permissions and attach to
				// the drupalgap.user.permissions variable.
				drupalgap.user.permissions = [];
				$.each(permissions, function(index, object){
					drupalgap.user.permissions.push(object.permission)
				});
			}
		}
	}
	catch (error) {
		alert('drupalgap_service_resource_extract_results - ' + error);
		return null;
	}
}
