/**
 * Given an entity type, this will return its corresponding service resource, or
 * null if the resource doesn't exist.
 * @param {String} entity_type
 * @return {Object,null}
 */
function drupalgap_services_get_entity_resource(entity_type) {
  try {
    if (drupalgap.services[entity_type]) {
      return drupalgap.services[entity_type];
    }
    else { return null; }
  }
  catch (error) {
    console.log('drupalgap_services_get_entity_resource - ' + error);
  }
}

/**
 * Given a json drupalgap options array from a service resource results call,
 * this extracts data based on the resource and populates necessary global vars.
 * @param {Object} options
 */
function drupalgap_service_resource_extract_results(options) {
  try {
    if (options.service == 'system' && options.resource == 'connect') {
      var permissions = options.data.user_permissions;
      for (var permission in permissions) {
        Drupal.user.permissions.push(permissions[permission]);
      }
    }
  }
  catch (error) {
    console.log('drupalgap_service_resource_extract_results - ' + error);
  }
}

/**
 * RSS Services
 */
drupalgap.services.rss = {
  'retrieve': {
    'options': {
      'type': 'get',
      'dataType': 'xml'
    },
    'call': function(options) {
      try {
        if (!options.url) {
          alert('drupalgap.services.rss.retrieve.call - missing url');
          return false;
        }
        var api_options =
          drupalgap_chain_callbacks(
            drupalgap.services.rss.retrieve.options,
            options
          );
        drupalgap.api.call(api_options);
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function() {},
          'RSS Retrieve Error',
          'OK'
        );
      }
    }
  } // <!-- get_variable -->
};

/**
 * Given the result of a drupalgap.services.rss.retrieve.call, this will iterate
 * over the RSS items and assemble them into a nice array of JSON objects and
 * return them. Returns null if it fails.
 * @param {Object} data
 * @return {Array,null}
 */
function drupalgap_services_rss_extract_items(data) {
  try {
    var items = null;
    var $xml = $(data);
    if ($xml) {
      // Extract the feeds items, then drop them in the list.
      var items = [];
      $xml.find('item').each(function() {
          var $this = $(this), item = {
            title: $this.find('title').text(),
            link: $this.find('link').text(),
            description: $this.find('description').text(),
            pubDate: $this.find('pubDate').text(),
            author: $this.find('author').text()
          };
          items.push(item);
      });
    }
    return items;
  }
  catch (error) {
    console.log('drupalgap_services_rss_extract_items - ' + error);
  }
}

