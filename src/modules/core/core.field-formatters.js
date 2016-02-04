dg.modules.core = new dg.Module();

// Let DrupalGap know we have a FieldFormatter(s).
dg.modules.core.FieldFormatter = {};

// Entity reference field formatter.
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

// Number decimal field formatter.
// Extend the FieldFormatter prototype for the number_decimal field.
dg.modules.core.FieldFormatter.number_decimal = function() { dg.FieldFormatterPrepare(this, arguments); };
dg.modules.core.FieldFormatter.number_decimal.prototype = new dg.FieldFormatter;
dg.modules.core.FieldFormatter.number_decimal.prototype.constructor = dg.modules.core.FieldFormatter.number_decimal;
dg.modules.core.FieldFormatter.number_decimal.prototype.viewElements = function(FieldItemListInterface, langcode) {
  var items = FieldItemListInterface.getItems();
  var element = {};
  if (items.length == 0) { return element; }
  for (var delta = 0; delta < items.length; delta++) {
    element[delta] = {
      _theme: 'number_decimal',
      _item: items[delta]
    };
  }
  return element;
};

// Number float field formatter.
// Extend the FieldFormatter prototype for the number_float field.
dg.modules.core.FieldFormatter.number_float = function() { dg.FieldFormatterPrepare(this, arguments); };
dg.modules.core.FieldFormatter.number_float.prototype = new dg.FieldFormatter;
dg.modules.core.FieldFormatter.number_float.prototype.constructor = dg.modules.core.FieldFormatter.number_float;
dg.modules.core.FieldFormatter.number_float.prototype.viewElements = function(FieldItemListInterface, langcode) {
  var items = FieldItemListInterface.getItems();
  var element = {};
  if (items.length == 0) { return element; }
  for (var delta = 0; delta < items.length; delta++) {
    element[delta] = {
      _theme: 'number_float',
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