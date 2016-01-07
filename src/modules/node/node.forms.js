var NodeEdit = function(bundle) {

  this.bundle = bundle;
  var self = this;

  this.buildForm = function(form, formState) {
    return new Promise(function(ok, err) {
      var entityType = 'node';
      var bundle = self.bundle;
      var entityFormMode = dg.entity_form_mode[entityType][bundle];
      // Place each field from the entity form mode's display onto the form.
      for (var fieldName in entityFormMode) {
        if (!entityFormMode.hasOwnProperty(fieldName)) { continue; }

        // Grab the field storage config and the module in charge of the field.
        var fieldStorageConfig = dg.fieldStorageConfig[entityType][fieldName];
        if (!fieldStorageConfig) { continue; }
        var module = fieldStorageConfig.module;

        // Make sure the module and the corresponding field widget implementation is available.
        if (!module) { continue; }
        if (!jDrupal.moduleExists(module)) {
          var msg = 'WARNING - buildForm - The "' + module + '" module is not present for the widget on the "' + fieldName + '" field.';
          console.log(msg);
          continue;
        }
        if (!dg.modules[module].FieldWidget || !dg.modules[module].FieldWidget[fieldStorageConfig.type]) {
          var msg = 'WARNING - buildForm - There is no "' + fieldStorageConfig.type + '" widget in the "' + module + '" module to handle the "' + fieldName + '" field.';
          console.log(msg);
          continue;
        }
        //console.log(fieldStorageConfig);

        // Create a new field widget and then attach its form element to the form.
        var FieldWidget = new dg.modules[module].FieldWidget[fieldStorageConfig.type](entityType, bundle, fieldName);
        form[fieldName] = FieldWidget.form(null, form, formState);
      }
      form.actions = {
        _type: 'actions',
        submit: {
          _type: 'submit',
          _value: 'Save',
          _button_type: 'primary'
        }
      };
      ok(form);
    });
  };

  this.submitForm = function(form, formState) {
    var self = this;
    return new Promise(function(ok, err) {
      console.log(formState.getValue());
      ok();
    });

  };

};
NodeEdit.prototype = new dg.Form('NodeEdit');
NodeEdit.constructor = NodeEdit;