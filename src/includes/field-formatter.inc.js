/**
 * The FieldFormatter constructor stub.
 * @constructor
 */
dg.FieldFormatter = function() {

  // This is a constructor stub, all FieldFormatter implementations should call dg.FieldFormatterPrepare in their
  // constructors.

  //this._fieldDefinition = null;
  //this._settings = null;
  //this._label = null;
  //this._viewMode = null;
  //this._thirdPartySettings = null;
};

/**
 * Used to prepare a field formatter default constructor.
 * @param {Object} FieldFormatter
 * @param {Array} args
 * @constructor
 */
dg.FieldFormatterPrepare = function(FieldFormatter, args) {
  FieldFormatter._fieldDefinition = args[0];
  FieldFormatter._settings = args[1];
  FieldFormatter._label = args[2];
  FieldFormatter._viewMode = args[3];
  FieldFormatter._thirdPartySettings = args[4];
};

/**
 * Builds a renderable array for a field value.
 * @param {Object} FieldItemListInterface
 * @param {String} langcode
 * @returns {Object}
 */
dg.FieldFormatter.prototype.viewElements = function(FieldItemListInterface, langcode) {
  var items = FieldItemListInterface.getItems();
  var element = {};
  if (items.length == 0) { return element; }
  for (var delta = 0; delta < items.length; delta++) {
    element[delta] = { _markup: items[delta].value };
  }
  return element;
};
