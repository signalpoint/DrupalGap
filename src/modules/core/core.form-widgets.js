// Let DrupalGap know we have a FormWidget(s).
dg.modules.core.FormWidget = {};

// String textfield widget.
// Extend the FormWidget prototype for the string_textfield widget.
dg.modules.core.FormWidget.string_textfield = function(entityType, bundle, fieldName, element) {
  dg.FormWidgetPrepare(this, arguments);
};
dg.modules.core.FormWidget.string_textfield.prototype = new dg.FormWidget;
dg.modules.core.FormWidget.string_textfield.prototype.constructor = dg.modules.core.FormWidget.string_textfield;

dg.modules.core.FormWidget.string_textfield.prototype.form = function(items, form, formState) {
  return {
    _type: 'textfield',
    _title: this.fieldName,
    _title_placeholder: true,
    _widgetType: 'FormWidget',
    _module: 'core'
  };
};

// Bundle widget.
// Extend the FormWidget prototype for the bundle widget.
dg.modules.core.FormWidget.bundle = function(entityType, bundle, fieldName, element) {
  dg.FormWidgetPrepare(this, arguments);
};
dg.modules.core.FormWidget.bundle.prototype = new dg.FormWidget;
dg.modules.core.FormWidget.bundle.prototype.constructor = dg.modules.core.FormWidget.bundle;

dg.modules.core.FormWidget.bundle.prototype.form = function(items, form, formState) {
  return {
    _type: 'hidden'
  };
};
dg.modules.core.FormWidget.bundle.prototype.valueCallback = function(items, form, formState) {
  var fakeEntity = new dg[jDrupal.ucfirst(this.get('entityType'))](null);
  return {
    name: fakeEntity.getEntityKey('bundle'),
    value: [ { target_id: this.get('bundle') } ]
  };
};
