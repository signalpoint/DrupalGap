// @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Field!FieldItemListInterface.php/interface/FieldItemListInterface/8

dg.FieldItemListInterface = function(items) {
  this._items = items;
};

dg.FieldItemListInterface.prototype.getItems = function() { return this._items; };
