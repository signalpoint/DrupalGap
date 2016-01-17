dg.modules.core = new dg.Module();

// Let DrupalGap know we have a FieldFormatter(s).
dg.modules.core.FieldFormatter = {};

// Number integer field formatter.
// Extend the FieldFormatter prototype for the number_integer field.
dg.modules.core.FieldFormatter.entity_reference_label = function() { dg.FieldFormatterPrepare(this, arguments); };
dg.modules.core.FieldFormatter.entity_reference_label.prototype = new dg.FieldFormatter;
dg.modules.core.FieldFormatter.entity_reference_label.prototype.constructor = dg.modules.core.FieldFormatter.entity_reference_label;
dg.modules.core.FieldFormatter.entity_reference_label.prototype.viewElements = function(FieldItemListInterface, langcode) {
  var items = FieldItemListInterface.getItems();
  var element = {};
  if (items.length == 0) { return element; }
  for (var delta = 0; delta < items.length; delta++) {
    element[delta] = {
      _theme: 'entity_reference_label',
      _item: items[delta]
    };
  }
  return element;
};

// Number integer field formatter.
// Extend the FieldFormatter prototype for the number_integer field.
dg.modules.core.FieldFormatter.number_integer = function() { dg.FieldFormatterPrepare(this, arguments); };
dg.modules.core.FieldFormatter.number_integer.prototype = new dg.FieldFormatter;
dg.modules.core.FieldFormatter.number_integer.prototype.constructor = dg.modules.core.FieldFormatter.number_integer;
dg.modules.core.FieldFormatter.number_integer.prototype.viewElements = function(FieldItemListInterface, langcode) {
  var items = FieldItemListInterface.getItems();
  var element = {};
  if (items.length == 0) { return element; }
  for (var delta = 0; delta < items.length; delta++) {
    element[delta] = {
      _theme: 'number_integer',
      _item: items[delta]
    };
  }
  return element;
};

// String field formatter.
// Extend the FieldFormatter prototype for the number_integer field.
dg.modules.core.FieldFormatter.string = function() { dg.FieldFormatterPrepare(this, arguments); };
dg.modules.core.FieldFormatter.string.prototype = new dg.FieldFormatter;
dg.modules.core.FieldFormatter.string.prototype.constructor = dg.modules.core.FieldFormatter.string;
dg.modules.core.FieldFormatter.string.prototype.viewElements = function(FieldItemListInterface, langcode) {
  var items = FieldItemListInterface.getItems();
  var element = {};
  if (items.length == 0) { return element; }
  for (var delta = 0; delta < items.length; delta++) {
    element[delta] = {
      _theme: 'string',
      _item: items[delta]
    };
  }
  return element;
};