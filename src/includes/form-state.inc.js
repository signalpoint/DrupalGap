// @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Form!FormStateInterface.php/interface/FormStateInterface/8

/**
 *
 * @constructor
 */
dg.FormStateInterface = function(form) {
  this.form = form;
  this.values = {};
};

dg.FormStateInterface.prototype.get = function(property) {
  return typeof this[property] !== 'undefined' ? this[property] : null;
};
dg.FormStateInterface.prototype.set = function(property, value) {
  this[property] = value;
};
dg.FormStateInterface.prototype.setFormState = function() {
  var self = this;
  var form = self.get('form');
  var promises = [];
  for (var name in form.elements) {
    promises.push(form.elements[name].valueCallback());
  }
  return Promise.all(promises).then(function(values) {
    for (var i = 0; i < values.length; i++) {
      self.setValue(values[i].name, values[i].value);
    }
  });
};

//dg.FormStateInterface.prototype.setFormState = function() {
//  var promises = [];
//  var foo = {
//    bar: 123,
//    baz: 456
//  };
//  for (var name in foo) {
//    promises.push(new Promise(function(ok, err) {
//      form.elements[name].valueCallback().then(function(value) {
//        console.log('setting: ' + name);
//        self.setValue(name, value);
//        ok();
//      });
//    }));
//  }
//  return Promise.all(promises);
//};

dg.FormStateInterface.prototype.getValue = function(key, default_value) {
  return typeof this.get('values')[key] !== 'undefined' ?
    this.get('values')[key] : default_value;
};
dg.FormStateInterface.prototype.setValue = function(key, value) {
  this.values[key] = value;
};
dg.FormStateInterface.prototype.getValues = function() {
  return this.get('values');
};
dg.FormStateInterface.prototype.setValues = function(values) {
  this.values = values;
};