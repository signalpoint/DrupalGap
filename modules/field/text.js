/**
 * Implements hook_field_formatter_view().
 */
function text_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    if (!drupalgap_empty(items)) {
      $.each(items, function(delta, item){
          element[delta] = {
            markup:item.value
          };
      });
    }
    return element;
  }
  catch (error) { drupalgap_error(error); }
}

