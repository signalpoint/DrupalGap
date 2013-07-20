/**
 * Implements hook_field_formatter_view().
 */
function text_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    return entity.title;
  }
  catch (error) { drupalgap_error(error); }
}

