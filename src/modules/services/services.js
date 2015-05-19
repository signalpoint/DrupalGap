/**
 * Given an entity type, this will return its corresponding service resource, or
 * null if the resource doesn't exist.
 * @param {String} entity_type
 * @return {?Type|Object|null}
 */
function drupalgap_services_get_entity_resource(entity_type) {
  try {
    console.log(
      'WARNING: drupalgap_services_get_entity_resource() is deprecated! ' +
      'Use services_get_resource_function_for_entity() instead.'
    );
    // @todo - deprecate this function, it is no longer needed now that entity
    // c.r.u.d. is built into jDrupal.
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
 * Returns the name of the jDrupal function to be used when in need of an entity
 * C.R.U.D. operation.
 * @param {String} entity_type
 * @param {String} crud
 * @return {String}
 */
function services_get_resource_function_for_entity(entity_type, crud) {
    var name = entity_type + '_';
    switch (crud) {
      case 'create': name += 'save'; break;
      case 'retrieve': name += 'load'; break;
      case 'update': name += 'save'; break;
      case 'delete': name += 'delete'; break;
      default: name += 'load'; break;
    }
    return name;
}


/**
 * Given a json drupalgap options array from a service resource results call,
 * this extracts data based on the resource and populates necessary global vars.
 * @param {Object} options
 */
function drupalgap_service_resource_extract_results(options) {
  try {
    if (options.service == 'system' && options.resource == 'connect') {
      // The system connect resource's success function places what is in
      // options.data.user to overwrite Drupal.user, so anything we want in
      // the Drupal.user object must be added to options.data.user isntead.
      // Extract and build the user's permissions.
      options.data.user.permissions = [];
      var permissions = options.data.user_permissions;
      for (var permission in permissions) {
        options.data.user.permissions.push(permissions[permission]);
      }
      // Pull out the content types, and set them by their type.
      var content_types_list = options.data.content_types_list;
      for (var index in content_types_list) {
          if (!content_types_list.hasOwnProperty(index)) { continue; }
          var object = content_types_list[index];
          drupalgap.content_types_list[object.type] = object;
      }
      // Pull out the content types user permissions.
      options.data.user.content_types_user_permissions =
        options.data.content_types_user_permissions;
      // Pull out the site settings.
      drupalgap.site_settings = options.data.site_settings;
      // Pull out the date formats and types.
      if (typeof options.data.date_formats !== 'undefined') {
        drupalgap.date_formats = options.data.date_formats;
      }
      if (typeof options.data.date_types !== 'undefined') {
        drupalgap.date_types = options.data.date_types;
      }
    }
  }
  catch (error) {
    console.log('drupalgap_service_resource_extract_results - ' + error);
  }
}

/**
 * Given the result of a drupalgap.services.rss.retrieve.call, this will iterate
 * over the RSS items and assemble them into a nice array of JSON objects and
 * return them. Returns null if it fails.
 * @param {Object} data
 * @return {?Type|Array|null}
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

