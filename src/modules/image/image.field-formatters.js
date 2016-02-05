// Let DrupalGap know we have a FieldFormatter(s).
dg.modules.image.FieldFormatter = {};

// Image field formatter.
dg.modules.image.FieldFormatter.image = function() { dg.FieldFormatterPrepare(this, arguments); };
dg.modules.image.FieldFormatter.image.prototype = new dg.FieldFormatter;
dg.modules.image.FieldFormatter.image.prototype.constructor = dg.modules.image.FieldFormatter.image;
dg.modules.image.FieldFormatter.image.prototype.viewElements = function(FieldItemListInterface, langcode) {
  var items = FieldItemListInterface.getItems();
  var element = {};
  if (items.length == 0) { return element; }
  for (var delta = 0; delta < items.length; delta++) {
    var item = items[delta];
    element[delta] = {
      _theme: 'image',
      _path: item.url,
      _attributes: {
        alt: item.alt,
        title: item.title,
        width: item.width,
        height: item.height
      }
    };
  }
  return element;
};
