angular.module('dgText', ['drupalgap']);

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
function text_field_formatter_view(entity_type, entity, field, instance,
  langcode, items, display) {
  try {
    var element = [];
    for (var delta in items) {
      if (!items.hasOwnProperty(delta)) { continue; }
      var item = items[delta];
      // Grab the field value, but use the safe_value if we have it.
      var value = item.value;
      if (typeof item.safe_value !== 'undefined') {
        value = item.safe_value;
      }
      element.push({ markup: value });
    }
    return element;
  }
  catch (error) { console.log('text_field_formatter_view - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function text_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    dpm('text_field_widget_form');
    //console.log(arguments);
    console.log(instance);
    var type = null;
    switch (instance.widget.type) {
      case 'search': type = 'search'; break;
      case 'text': type = 'textfield'; break;
      case 'textarea':
      case 'text_long':
      case 'text_with_summary':
      case 'text_textarea':
      case 'text_textarea_with_summary':
        type = 'textarea';
    }
    element.type = type;
    return element;
  }
  catch (error) { console.log('text_field_widget_form - ' + error); }
}
