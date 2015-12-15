dg.Form = function(id) {
  this.id = id;
  this.form = {
    _attributes: {
      id: dg.killCamelCase(id, '-').toLowerCase()
    }
  };
  this.form_state = {};
};

dg.Form.prototype.getFormId = function() {
  return this.id;
};

dg.Form.prototype.getForm = function(options) {
  var self = this;
  self.buildForm(self.form, self.form_state, {
    success: function() {
      for (var element in self.form) {
        if (!dg.isFormElement(element, self.form)) { continue; }
        var attrs = self.form[element]._attributes ? self.form[element]._attributes : {};
        if (!attrs.id) { attrs.id = 'edit-' + element; }
        if (!attrs.name) { attrs.name = element; }
        self.form[element]._attributes = attrs;
      }
      options.success('<form ' + dg.attributes(self.form._attributes) + '>' +
        dg.render(self.form) +
      '</form>');
    }
  });
};

dg.Form.prototype.buildForm = function(form, form_state, options) {
  options.success();
};

dg.isFormElement = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) != '_';
};
dg.isFormProperty = function(prop, obj) {
  return obj.hasOwnProperty(prop) && prop.charAt(0) == '_';
};