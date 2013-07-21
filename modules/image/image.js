/**
 * Implements hook_field_formatter_view().
 */
function image_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    if (!drupalgap_empty(items)) {
      $.each(items, function(delta, item){
          // TODO - add support for image_style
          element[delta] = {
            theme:'image',
            alt:item.alt,
            title:item.title,
            path:drupalgap_image_path(item.uri)
            /*image_style:display.settings.image_style*/
          };
      });
    }
    return element;
  }
  catch (error) { drupalgap_error(error); }
}

