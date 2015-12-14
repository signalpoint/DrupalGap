dg.Form = function(id) {
  this.id = id;
  this.form = {};
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
        if (!self.form.hasOwnProperty(element)) { continue; }
        console.log(self.form[element]);
      }
      options.success(dg.render(self.form));
    }
  });
};

dg.Form.prototype.buildForm = function(form, form_state, options) {
  options.success();
};