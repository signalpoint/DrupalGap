dg.CheckboxesElement = function(name, element, form) {
  dg.FormElementPrepare(this, arguments);
};

// Extend the FormElement prototype.
dg.CheckboxesElement.prototype = new dg.FormElement;
dg.CheckboxesElement.prototype.constructor = dg.CheckboxesElement;

dg.CheckboxesElement.prototype.valueCallback = function() {
  var self = this;
  return new Promise(function(ok, err) {
    var value = null;
    var checkboxes = document.querySelectorAll('#' + self.id() + ' input[type="checkbox"]');
    if (checkboxes.length) {
      value = {};
      for (var i = 0; i < checkboxes.length; i++) {
        var _value = checkboxes[i].value;
        if (_value !== null) { value[_value] = checkboxes[i].checked ? _value : null; }
      }
    }
    ok({
      name: self.get('name'),
      value: value
    });
  });
};
