dg.FormWidget = function(entityType, bundle, fieldName) {
  // Any default constructor behavior lives in FormWidgetPrepare
};
/**
 * Used to prepare a Form Widget default constructor.
 * @param FormWidget
 * @param args
 * @constructor
 */
dg.FormWidgetPrepare = function(FormWidget, args) {
  FormWidget.entityType = args[0];
  FormWidget.bundle = args[1];
  FormWidget.fieldName = args[2];
  FormWidget.fieldFormMode = args[3];
};