// @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Field!FormatterBase.php/class/FormatterBase/8
// @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Field!Annotation!FieldFormatter.php/class/FieldFormatter/8

dg.FieldFormatter = function() { };

/**
 * Used to prepare a field formatter default constructor.
 * @param FieldFormatter
 * @param args
 * @constructor
 */
dg.FieldFormatterPrepare = function(FieldFormatter, args) { };

// Builds a renderable array for a field value.
dg.FieldFormatter.prototype.viewElements = function(items, langcode) {
  var element = {};
  if (items.length == 0) { return element; }
  for (var delta = 0; delta < items.length; delta++) {
    element[delta] = items[delta];
  }
  return element;
};

