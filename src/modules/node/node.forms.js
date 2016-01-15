var NodeEdit = function() {

  this.entity = null;
  this.entityType = 'node';
  this.bundle = null;
  this.entityID = null;

  // Handle new and existing entities.
  if (arguments[0]) {
    if (jDrupal.isInt(arguments[0])) { this.entityID = arguments[0]; }
    else {
      this.entity = new dg[jDrupal.ucfirst(this.entityType)](null);
      this.bundle = arguments[0];
    }
  }

  var self = this;

  this.buildForm = function(form, formState) {
    return new Promise(function(ok, err) {

      var buildEntityForm = function() {

        var entityType = self.entityType;
        var bundle = self.bundle;
        var entity = self.entity;
        var entityFormMode = dg.entity_form_mode[entityType][bundle];

        form._entity = entity;
        form._entityType = entityType;
        form._bundle = bundle;

        // Place the bundle name and value as a hidden element on the form.
        form[entity.getEntityKey('bundle')] = {
          _type: 'bundle',
          _widgetType: 'FormWidget',
          _module: 'core',
          _entityType: entityType,
          _bundle: bundle,
          _value: bundle
        };

        // Place each field from the entity form mode's display onto the form.
        for (var fieldName in entityFormMode) {
          if (!entityFormMode.hasOwnProperty(fieldName)) { continue; }

          // Grab the field storage config, if any.
          var fieldStorageConfig = dg.fieldStorageConfig[entityType][fieldName];
          if (!fieldStorageConfig) {

            // There was no config, so this is probably an "extra" field, e.g. node title, uid, etc...

            var type = entityFormMode[fieldName].type;
            if (!dg.modules.core.FormWidget[type]) {
              console.log('WARNING - buildForm - There is no "' + type + '" widget in the core module to handle the "' + fieldName + '" element.');
              continue;
            }

            form[fieldName] = {
              _type: type,
              _widgetType: 'FormWidget',
              _module: 'core',
              _entityType: entityType,
              _bundle: bundle,
              _fieldName: fieldName,
              _fieldFormMode: new dg.FieldFormMode(entityFormMode[fieldName])
            };

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

            form[fieldName] = {
              _type: fieldStorageConfig.type,
              _widgetType: 'FieldWidget',
              _module: module,
              _entityType: entityType,
              _bundle: bundle,
              _fieldName: fieldName,
              _fieldFormMode: new dg.FieldFormMode(entityFormMode[fieldName])
            };

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
      };

      // If we have an entity id, load the entity and place the id as an element onto the form. Then either way, build
      // the form.
      if (self.entityID) {
        dg.nodeLoad(self.entityID).then(function(entity) {
          self.entity = entity;
          self.bundle = entity.getBundle();
          form[entity.getEntityKey('id')] = {
            _type: 'entityID',
            _widgetType: 'FormWidget',
            _module: 'core',
            _value: self.entityID
          };
          buildEntityForm();
        });
      }
      else { buildEntityForm(); }

    });
  };

  this.submitForm = function(form, formState) {
    var self = this;
    return new Promise(function(ok, err) {
      // Save the entity, then redirect to the entity page view if no form action has been set.
      var values = formState.getValues();
      var entity = new jDrupal[jDrupal.ucfirst(form._entityType)](values);
      entity.save().then(function() {
        if (!form._action) { form._action = form._entityType + '/' + entity.id(); }
        ok();
      });
    });
  };

};
NodeEdit.prototype = new dg.Form('NodeEdit');
NodeEdit.constructor = NodeEdit;