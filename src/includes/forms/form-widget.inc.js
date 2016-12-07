dg.FormWidget = function(entityType, bundle, fieldName, element, items, delta) {
  // Any default constructor behavior lives in FormWidgetPrepare
};
// Extend the FormElement prototype.
dg.FormWidget.prototype = new dg.FormElement;
dg.FormWidget.prototype.constructor = dg.FormWidget;

/**
 * Used to prepare a Form Widget default constructor.
 * @param FormWidget
 * @param args
 * @constructor
 */
dg.FormWidgetPrepare = function(FormWidget, args) {
  FormWidget.widgetType = 'FormWidget';
  FormWidget.entityType = args[0];
  FormWidget.bundle = args[1];
  FormWidget.fieldName = args[2];
  FormWidget.name = FormWidget.fieldName;
  FormWidget.element = args[3];
  FormWidget.items = args[4];
  FormWidget.delta = args[5];
  FormWidget.fieldFormMode = FormWidget.element._fieldFormMode;
};

dg.FormWidget.prototype.valueCallback = function() {
  var self = this;
  return new Promise(function(ok, err) {
    var value = null;
    var el = document.getElementById(self.id());
    if (el) { value = el.value; }
    ok({
      name: self.get('name'),
      value: [ { value: value }  ]
    });
  });
};
