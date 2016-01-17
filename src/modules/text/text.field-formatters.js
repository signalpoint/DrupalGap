dg.modules.text = new dg.Module();

// Let DrupalGap know we have a FieldFormatter(s).
dg.modules.text.FieldFormatter = {};

// Text default field formatter.
// Extend the FieldFormatter prototype for the text_default field.
dg.modules.text.FieldFormatter.text_default = function() { dg.FieldFormatterPrepare(this, arguments); };
dg.modules.text.FieldFormatter.text_default.prototype = new dg.FieldFormatter;
dg.modules.text.FieldFormatter.text_default.prototype.constructor = dg.modules.text.FieldFormatter.text_default;
dg.modules.text.FieldFormatter.text_default.prototype.viewElements = function(FieldItemListInterface, langcode) {
  var items = FieldItemListInterface.getItems();
  var element = {};
  if (items.length == 0) { return element; }
  for (var delta = 0; delta < items.length; delta++) {
    element[delta] = { _markup: items[delta].value };
  }
  return element;
};