dg.RadiosElement = function(name, element, form) {
  dg.FormElementPrepare(this, arguments);
};

// Extend the FormElement prototype.
dg.RadiosElement.prototype = new dg.FormElement;
dg.RadiosElement.prototype.constructor = dg.RadiosElement;

dg.RadiosElement.prototype.valueCallback = function() {
  // @TODO this is a total copy of dg.RadiosElement.prototype.valueCallback, maybe both
  // need to run through dg.OptionsElement.prototype.valueCallback or something. The
  // same for the RadioElement and CheckboxElement, exact copies. Exact for the "type"
  // attribute of course.
  var self = this;
  return new Promise(function(ok, err) {
    var value = null;
    var radios = document.querySelectorAll('#' + self.id() + ' input[type="radio"]');
    if (radios.length) {
      value = {};
      for (var i = 0; i < radios.length; i++) {
        var _value = radios[i].value;
        if (_value !== null) { value[_value] = radios[i].checked ? 1 : 0; }
      }
    }
    ok({
      name: self.get('name'),
      value: value
    });
  });
};
