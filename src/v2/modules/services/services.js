/**
 * Given a json drupalgap options array from a service resource results call,
 * this extracts data based on the resource and populates necessary global vars.
 * @param {Object} options
 */
function drupalgap_service_resource_extract_results(options) {
  try {
    if (options.service == 'system' && options.resource == 'connect') {
      drupalgap.remote_addr = options.data.remote_addr;
      drupalgap.entity_info = options.data.entity_info;
      drupalgap.field_info_instances = options.data.field_info_instances;
      drupalgap.field_info_fields = options.data.field_info_fields;
      drupalgap.field_info_extra_fields = options.data.field_info_extra_fields;
      // @TODO uncomment once 7.x-2.x is more stable
      /*drupalgap.taxonomy_vocabularies =
        drupalgap_taxonomy_vocabularies_extract(
          result.taxonomy_vocabularies
        );*/

      // The system connect resource's success function places what is in
      // options.data.user to overwrite Drupal.user, so anything we want in
      // the Drupal.user object must be added to options.data.user isntead.
      // Extract and build the user's permissions.
      /*options.data.user.permissions = [];
      var permissions = options.data.user_permissions;
      for (var permission in permissions) {
        options.data.user.permissions.push(permissions[permission]);
      }*/
      // Pull out the content types, and set them by their type.
      var content_types_list = options.data.content_types_list;
      for (var index in content_types_list) {
          if (!content_types_list.hasOwnProperty(index)) { continue; }
          var object = content_types_list[index];
          drupalgap.content_types_list[object.type] = object;
      }
      // Pull out the content types user permissions.
      /*options.data.user.content_types_user_permissions =
        options.data.content_types_user_permissions;*/
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

