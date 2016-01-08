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

        var FieldWidget = null;

        // Grab the field storage config, if any.
        var fieldStorageConfig = dg.fieldStorageConfig[entityType][fieldName];
        if (!fieldStorageConfig) {

          // There was no config, so this is probably an "extra" field, e.g. node title, uid, etc...

          var type = entityFormMode[fieldName].type;
          if (!dg.modules.core.FormWidget[type]) {
            console.log('WARNING - buildForm - There is no "' + type + '" widget in the core module to handle the "' + fieldName + '" element.');
            continue;
          }
          var FormWidget = new dg.modules.core.FormWidget[type](
              entityType,
              bundle,
              fieldName,
              new dg.FieldFormMode(entityFormMode[fieldName])
          );
          form[fieldName] = FormWidget.form(null, form, formState);

        }
        else {

          // There was a field config, therefore we're dealing with a field...

          // Pull out the module in charge of the field.
          var module = fieldStorageConfig.module;

          // Make sure the module and the corresponding field widget implementation is available.
          if (!module) { continue; }
          if (!jDrupal.moduleExists(module)) {
            console.log('WARNING - buildForm - The "' + module + '" module is not present for the widget on the "' + fieldName + '" field.');
            continue;
          }
          if (!dg.modules[module].FieldWidget || !dg.modules[module].FieldWidget[fieldStorageConfig.type]) {
            console.log('WARNING - buildForm - There is no "' + fieldStorageConfig.type + '" widget in the "' + module + '" module to handle the "' + fieldName + '" field.');
            continue;
          }

          // Create a new field widget and attach its element to the form.
          FieldWidget = new dg.modules[module].FieldWidget[fieldStorageConfig.type](
              entityType,
              bundle,
              fieldName,
              new dg.FieldFormMode(entityFormMode[fieldName])
          );
          form[fieldName] = FieldWidget.form(null, form, formState);

        }
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
      console.log(formState.getValues());
      ok();
    });

  };

};
NodeEdit.prototype = new dg.Form('NodeEdit');
NodeEdit.constructor = NodeEdit;