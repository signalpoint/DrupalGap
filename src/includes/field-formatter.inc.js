// @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Field!FormatterBase.php/class/FormatterBase/8
// @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Field!Annotation!FieldFormatter.php/class/FieldFormatter/8

dg.FieldFormatter = function() {
  this._fieldDefinition = null;
  this._settings = null;
  this._label = null;
  this._viewMode = null;
  this._thirdPartySettings = null;
};

/**
 * Used to prepare a field formatter default constructor.
 * @param FieldFormatter
 * @param args
 * @constructor
 */
dg.FieldFormatterPrepare = function(FieldFormatter, args) {
  this._fieldDefinition = args[0];
  this._settings = args[1];
  this._label = args[2];
  this._viewMode = args[3];
  this._thirdPartySettings = args[4];
};

// Builds a renderable array for a field value.
dg.FieldFormatter.prototype.viewElements = function(FieldItemListInterface, langcode) {
  var items = FieldItemListInterface.getItems();
  var element = {};
  if (items.length == 0) { return element; }
  for (var delta = 0; delta < items.length; delta++) {
    element[delta] = { _markup: items[delta].value };
  }
  return element;
};
