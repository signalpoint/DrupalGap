dg.CheckboxElement = function(name, element, form) {
  dg.FormElementPrepare(this, arguments);
};

// Extend the FormElement prototype.
dg.CheckboxElement.prototype = new dg.FormElement;
dg.CheckboxElement.prototype.constructor = dg.CheckboxElement;

dg.CheckboxElement.prototype.valueCallback = function() {
  var self = this;
  return new Promise(function(ok, err) {
    var value = null;
    var el = document.getElementById(self.id());
    if (el) { value = el.checked; }
    ok({
      name: self.get('name'),
      value: value ? 1 : 0
    });
  });
};
