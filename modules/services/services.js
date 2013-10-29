/**
 * Given an entity type, this will return its corresponding service resource, or
 * null if the resource doesn't exist.
 */
function drupalgap_services_get_entity_resource(entity_type) {
  try {
    if (drupalgap.services[entity_type]) {
      return drupalgap.services[entity_type];
    }
    else { return null; }
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Given a json drupalgap options array from a service resource results call,
 * this extracts data based on the resource and populates necessary global vars.
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

