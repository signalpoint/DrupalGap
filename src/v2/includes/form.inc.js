/**
 *
 */
function drupalgap_get_form(form_id) {
  try {
    // Set up form defaults.
    var form = {
      attributes: {
        id: form_id,
        'class': []
      }
    };
    // Set up a directive attribute to handle this form, then theme and return.
    form.attributes[form_id.replace(/_/g, '-')] = '';
    return theme('form', { form: form });
  }
  catch (error) { console.log('drupalgap_get_form - ' + error); }
}

/**
 *
 */
function dg_form_render(form) {
  try {
    return drupalgap_form_render_elements(form);
  }
  catch (error) { console.log('drupalgap_form_render - ' + error); }
}

/**
 * Given a form id, this will assemble and return the default form JSON object.
 * @param {String} form_id
 * @return {Object}
 */
function dg_form_defaults(form_id, $scope) {
  try {
    var form = {};
    
    // Set the form id, elements, buttons, options and attributes.
    form.id = form_id;
    form.elements = {};
    form.buttons = {};
    form.options = {
      attributes: {
        id: form_id,
        'class': ''
      }
    };
    
    // Create a prefix and suffix.
    form.prefix = '';
    form.suffix = '';
    
    // Create empty arrays for the form's validation and submission handlers.
    form.validate = [];
    form.submit = [];
    
    if (!$scope.form_state) { $scope.form_state = { values: { } } };
    
    // FORM SUBMIT HANDLER
    // @TODO - who is passing the form_id and form_state to this function? we
    // probably don't need to do that anymore, because that data should already
    // be available in the scope... I think.
    $scope.drupalgap_form_submit = function() {
      
      dpm('drupalgap_form_submit');
      console.log(arguments);
      
      // Extract the form and its id along with the form state, from the scope.
      // Remember the form state values are automatically assembled by Angular,
      // unlike DrupalGap 1.x where we assembled them manually.
      var form = $scope.form;
      var form_state = $scope.form_state;
      var form_id = form.id;
      //console.log(form);
      //console.log(form_state);
      //console.log(form_id);
  
      // Clear out previous form errors.
      drupalgap.form_errors = {};
  
      // Build the form validation wrapper function.
      var form_validation = function() {
        try {
  
          // Call the form's validate function(s), if any.
          for (var index in form.validate) {
              if (!form.validate.hasOwnProperty(index)) { continue; }
              var fn = form.validate[index];
              fn.apply(null, Array.prototype.slice.call([form, form_state]));
          }
  
          // Call drupalgap form's api validate.
          _drupalgap_form_validate(form, form_state);
  
          // If there were validation errors, show the form errors and stop the
          // form submission. Otherwise submit the form.
          if (!jQuery.isEmptyObject(drupalgap.form_errors)) {
            var html = '';
            for (var name in drupalgap.form_errors) {
                if (!drupalgap.form_errors.hasOwnProperty(name)) { continue; }
                var message = drupalgap.form_errors[name];
                html += message + '\n\n';
            }
            drupalgap_alert(html);
          }
          else { form_submission(); }

        }
        catch (error) {
          console.log('drupalgap_form_submit - form_validation - ' + error);
        }
      };
  
      // Build the form submission wrapper function.
      var form_submission = function() {
        try {
          // Call the form's submit function(s), if any.
          for (var index in form.submit) {
              if (!form.submit.hasOwnProperty(index)) { continue; }
              var fn = form.submit[index];
              fn.apply(null, Array.prototype.slice.call([form, form_state]));
          }
        }
        catch (error) {
          console.log('drupalgap_form_submit - form_submission - ' + error);
        }
      };
  
      // Get ready to validate and submit the form, but first...
  
      // If this is an entity form, and there is an image field on the form, we
      // need to asynchronously process the image field, then continue onward
      // with normal form validation and submission.
      /*if (form.entity_type &&
        image_fields_present_on_entity_type(form.entity_type, form.bundle)
      ) {
        _image_field_form_process(form, form_state, {
            success: form_validation
        });
      }
      else {*/
        // There were no image fields on the form, proceed normally with form
        // validation, which will in turn process the submission if there are no
        // validation errors.
        form_validation();
      /*}*/
      
      
      
    }

    // Finally, return the form.
    return form;
  }
  catch (error) { console.log('dg_form_defaults - ' + error); }
}

/**
 * @param {Object} $compile
 * @param {Object} $scope
 * @param {Object|Null} hookFieldWidgetForm
 */
function dg_ng_compile_form($compile, $scope) {
  try {
    //dpm('dg_ng_compile_form');
    //console.log(arguments);
    
    var drupalSettings = dg_ng_get('drupalSettings');
    
    // Pull out any optional arguments.
    var hookFieldWidgetForm = arguments[2] ? arguments[2] : null;
    
    // @TODO sometime between dg_ng_compile_form() and dgFormElement.link, we
    // are losing the form state.

    dg_form_element_set_empty_options_and_attributes($scope.form, drupalSettings.language);

    // Give modules an opportunity to alter the form.
    //module_invoke_all('form_alter', $scope.form, null, $scope.form.id);

    // Place the assembled form into local storage so _drupalgap_form_submit
    // will have access to the assembled form.
    //drupalgap_form_local_storage_save($scope.form);

    // For each form element...
    for (var name in $scope.form.elements) {
      if (!$scope.form.elements.hasOwnProperty(name)) { continue; }
      var element = $scope.form.elements[name];
      //dpm(name);
      //console.log(element);
      
      if (!element.is_field) {
        if (typeof element.options.attributes.name === 'undefined') {
          $scope.form.elements[name].options.attributes.name = element.name;
        }
        if (typeof element.default_value !== 'undefined') {
          // @TODO we shouldn't be dropping all these directly in scope, let's
          // put them in their own object instead. Although this may be possible
          // to deprecate now because of our ng-model usage, needs testing...
          $scope[element.name] = element.default_value;
        }
      }
      else {
        hookFieldWidgetForm.setField(element.name, element.field_info_field);
      }

      // Place any hidden input's value (if any) into the scope so it can be
      // properly bound to the form state values.
      if (element.type == 'hidden') {
        if (typeof element.default_value !== 'undefined') {
          // @TODO we should probably stick these values in their own object, so
          // they aren't polluting the scope with nonsense.
          $scope[element.name] = element.default_value;
        }
        var ng_model = typeof element.options.attributes['ng-model'] !== 'undefined' ?
          element.options.attributes['ng-model'] : dg_form_element_ng_model(element);
        $scope.form.elements[name].options.attributes['ng-init'] = ng_model + " = " + element.options.attributes.name;
      }

    }

    // Finally compile the rendered form.
    return dg_ng_compile($compile, $scope, dg_form_render($scope.form));
  }
  catch (error) { console.log('dg_ng_compile_form - ' + error); }
}

