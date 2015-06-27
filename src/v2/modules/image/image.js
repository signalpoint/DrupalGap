/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {*} display
 * @return {Object}
 */
function image_field_formatter_view(entity_type, entity, field, instance,
  langcode, items, display) {
  try {
    var element = [];
    for (var delta in items) {
      if (!items.hasOwnProperty(delta)) { continue; }
      var item = items[delta];
      var theme = dg_empty(display.settings.image_style) ?
        'image' : 'image_style';
      var image = {
        theme: theme,
        alt: item.alt,
        title: item.title
      };
      if (!dg_empty(theme)) {
        image.style_name = display.settings.image_style;
        image.path = item.uri;
      }
      else { image.path = drupalgap_image_path(item.uri); }
      element.push(image);
    }
    return element;
  }
  catch (error) { console.log('image_field_formatter_view - ' + error); }
}

/**
 * Implementation of theme_image().
 * @param {Object} variables
 * @return {String}
 */
function theme_image(variables) {
  try {
    // Turn the path, alt and title into attributes if they are present.
    if (variables.path) { variables.attributes['ng-src'] = variables.path; }
    if (variables.alt) { variables.attributes.alt = variables.alt; }
    if (variables.title) { variables.attributes.title = variables.title; }
    // Render the image.
    return '<img ' + dg_attributes(variables.attributes) + ' />';
  }
  catch (error) { console.log('theme_image - ' + error); }
}

/**
 * Implementation of theme_image_style().
 * @param {Object} variables
 * @return {String}
 */
function theme_image_style(variables) {
  try {
    variables.path = image_style_url(variables.style_name, variables.path);
    return theme_image(variables);
  }
  catch (error) { console.log('theme_image - ' + error); }
}

/**
 * Given an image style name and image uri, this will return the absolute URL
 * that can be used as a src value for an img element.
 * @param {String} style_name
 * @param {String} path
 * @return {String}
 */
function image_style_url(style_name, path) {
  try {
    var drupalSettings = dg_ng_get('drupalSettings');
    var src =
      drupalSettings.site_path + drupalSettings.base_path + path;
    if (src.indexOf('public://') != -1) {
      src = src.replace(
        'public://',
        drupalSettings.file_public_path +
          '/styles/' +
          style_name +
          '/public'
      );
    }
    else if (src.indexOf('private://') != -1) {
      src = src.replace(
        'private://',
        drupalSettings.file_private_path +
          '/styles/' +
          style_name +
          '/private'
      );
    }
    return src;
  }
  catch (error) { console.log('image_style_url - ' + error); }
}

