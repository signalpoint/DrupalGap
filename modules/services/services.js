/**
 * Implements hook_install().
 */
/*function services_install() {
  try {
    if (drupalgap.settings.debug) {
      console.log('services_install()');
    }
    // Let's build a CRUD controller for each entity. Note, we use the string
    // 'del' here to avoid collisions with JS's delete function.
    var entity_types = ['comment', 'file', 'node', 'taxonomy_term', 'taxonomy_vocabulary', 'user'];
    var crud = ['create', 'retrieve', 'update', 'del'];
    for (var i = 0; i < entity_types.length; i++) {
      var entity_type = entity_types[i];
      eval('drupalgap.services.' + entity_type + ' = {};');
      for (var j = 0; j < crud.length; j++) {

        // Grab the crud action.
        var action = crud[j];

        // What HTTP type are we going to use?
        var type = '';
        switch (action) {
          case 'create': type = 'POST'; break;
          case 'retrieve': type = 'GET'; break;
          case 'update': type = 'PUT'; break;
          case 'del': type = 'DELETE'; break;
          default: break;
        }

        // What is our path going to be? If it is a retrieve we'll go to
        // [entity-type].json, otherwise we'll go to
        // [entity-type]/[entity-id].json.
        var path = entity_type + '.json';
        if (action != 'retrieve') {
          path = entity_type + '/%' +
            drupalgap_entity_get_primary_key(entity_type) + '.json';
        }

        // Build the resource.
        var resource = {
          'options':{
            'type':type,
            'path':path,
            'success':function(result){},
            'error':function(jqXHR, textStatus, errorThrown, url){},
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
        console.log(JSON.stringify(resource.options));
        eval('drupalgap.services.' + entity_type + '.' + action + ' = resource;');
      }
    }
    console.log(JSON.stringify(drupalgap.services));
    alert('installed services');
  }
  catch (error) {
    alert('services_install - ' + error);
  }
}*/

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

/**
 * RSS Services
 */
drupalgap.services.rss = {
  'retrieve':{
    'options':{
      'type':'get',
      'dataType':'xml',
    },
    'call':function(options){
      try {
        if (!options.url) {
          alert('drupalgap.services.rss.retrieve.call - missing url');
          return false;
        }
        var api_options = drupalgap_chain_callbacks(drupalgap.services.rss.retrieve.options, options);
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'RSS Retrieve Error',
          'OK'
        );
      }
    },
  }, // <!-- get_variable -->
};

/**
 * Given the result of a drupalgap.services.rss.retrieve.call, this will iterate
 * over the RSS items and assemble them into a nice array of JSON objects and
 * return them. Returns null if it fails.
 */
function drupalgap_services_rss_extract_items(data) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_services_rss_extract_items()');
    }
    var items = null;
    var $xml = $(data);
    if ($xml) {
      // Extract the feeds items, then drop them in the list.
      var items = [];
      $xml.find("item").each(function() {
          var $this = $(this), item = {
            title: $this.find("title").text(),
            link: $this.find("link").text(),
            description: $this.find("description").text(),
            pubDate: $this.find("pubDate").text(),
            author: $this.find("author").text()
          }
          items.push(item);
      });
    }
    return items;
  }
  catch (error) {
    alert('drupalgap_services_rss_extract_items - ' + error);
  }
}

