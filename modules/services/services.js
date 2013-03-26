drupalgap.services = {};

/**
 *
 */
function services_install() {
  try {
    if (drupalgap.settings.debug) {
      console.log('services_install()');
    }
    // Let's build a CRUD controller for each entity. Note, we use the string
    // 'del' here to avoid collisions with JS's delete function.
    var entity_types = ['comment', 'node', 'taxonomy_term', 'taxonomy_vocabulary', 'user'];
    var crud = ['create', 'retrieve', 'update', 'del'];
    for (var i = 0; i < entity_types.length; i++) {
      var entity_type = entity_types[i];
      eval('drupalgap.services.' + entity_type + ' = {};');
      for (var j = 0; j < crud.length; j++) {
        // Grab the crud action.
        var action = crud[j];
        // What HTTP type are we going to use?
        var type = '';
        var path = '';
        switch (action) {
          case 'create': type = 'POST'; break;
          case 'retrieve': type = 'GET'; break;
          case 'update': type = 'PUT'; break;
          case 'del': type = 'DELETE'; break;
          default: break;
        }
        // Build the resource.
        var resource = {
          'options':{
            'type':type,
            'path':entity_type + '.json',
          },
          'call':function(options){
            try {
              var api_options = drupalgap_chain_callbacks(this.options, options);
              api_options.data = drupalgap_node_assemble_data(options);
              // PREPROCESS HOOK
              drupalgap.api.call(api_options);
            }
            catch (error) {
              alert('drupalgap.services - ' + error);
            }
          },
        };
        // Attach the resource to drupalgap.services.
        eval('drupalgap.services.' + entity_type + '.' + action + ' = resource;');
      }
    }
    console.log(JSON.stringify(drupalgap.services));
    alert('installed services');
  }
  catch (error) {
    alert('services_install - ' + error);
  }
}

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
					permissions = options.data.user_permissions; 
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

