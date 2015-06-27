dgApp.factory('hookFieldWidgetForm', function() {
    return {
        fields: {},
        setField: function (fieldName, fieldObject) {
            this.fields[fieldName] = fieldObject;
        },
        getField: function (fieldName) {
            return this.fields[fieldName];
        }
    };
});

/**
 *
 */
function dgFieldWidgetFormCompile($compile, $scope, $element) {
  try {
    // Merge element attributes into the variables object.
      /*dpm('merging elements');
      if (
        form.elements[field_name][language][delta].options &&
        form.elements[field_name][language][delta].options.attributes
      ) {
        variables.attributes = $.extend(
          true,
          variables.attributes,
          form.elements[field_name][language][delta].options.attributes
        );
      }
      //if (!item.type && element.type) { item.type = element.type; }
      console.log(form);*/
        
        // Render the element into the scope.  
        // Compile the template for Angular and append it to the directive's
        // html element.
        dpm('compiling - ' + $element.attr('field_name'));
        console.log(arguments);
        var linkFn = $compile(_drupalgap_form_render_element_item(
          $scope.form,
          $scope.form.elements[$scope.field.field_name], // form.elements[field_name]
          $scope.variables,
          $scope.form.elements[$scope.field.field_name][$scope.language][$scope.delta]
        ));
        var content = linkFn($scope);
        $element.append(content);
  }
  catch (error) { console.log('dgFieldWidgetFormCompile - ' + error); }
}

dgApp.controller('hook_field_formatter_view',
  [ '$scope', '$element', function($scope, $element) {
    try {

      dpm('hook_field_formatter_view');
      //console.log(arguments);
      
      var content = '';
      
      var entity_type = $scope.$parent.entity_type;
      var entity = $scope.$parent[entity_type];
      var bundle = drupalgap_get_bundle(entity_type, entity);
      var field_name = $element.attr('field_name');
      var field = drupalgap_field_info_instance(entity_type, field_name, bundle);
      var display = drupalgap_field_display(field);
      
      //console.log(entity_type);
      //console.log(entity);
      //console.log(field_name);
      //console.log(field);
      //console.log(display);
      
      // Determine module that implements the hook_field_formatter_view,
      // then determine the hook's function name, then render the field content.
      // If there wasn't a module specified in the display, look to the module
      // specified in the field widget. If we still don't find it, then just
      // return.
      var module = display['module'];
      if (!module) {
        if (!field.widget.module) {
          var msg = 'hook_field_formatter_view - ' +
            'unable to locate the module for the field (' + field_name + ')';
          console.log(msg);
          return content;
        }
        else { module = field.widget.module; }
      }
      var function_name = module + '_field_formatter_view';
      if (!drupalgap_function_exists(function_name)) {
        console.log(
          'WARNING: hook_field_formatter_view - ' + function_name + '() ' +
          'does not exist! (' + field_name + ')'
        );
        return;
      }
      
      // Grab the field formatter function, then grab the field items
      // from the entity, then call the formatter function and append its result
      // to the entity's content.
      var fn = window[function_name];
      var items = null;

      // Check to see if translated content based on app's language setting
      // is present or not. If yes, then use that language as per setting.
      // Determine the language code. Note, multi lingual sites may have a
      // language code on the entity, but still have 'und' on the field, so
      // fall back to 'und' if the field's language code doesn't match the
      // entity's language code.
      var default_lang = language_default();
      var language = entity.language;
      if (entity[field_name]) {
        if (entity[field_name][default_lang]) {
          items = entity[field_name][default_lang];
        }
        else if (entity[field_name][language]) {
          items = entity[field_name][language];
        }
        else if (entity[field_name]['und']) {
          items = entity[field_name]['und'];
          language = 'und';
        }
        else { items = entity[field_name]; }
      }

      // @TODO - We've been sending 'field' as the instance
      // (drupalgap_field_info_instance), and the 'instance' as the field
      // (drupalgap_field_info_field). This is backwards, and should be
      // reversed. All contrib modules with field support will need to be
      // udpated to reflect this. Lame.
      var elements = fn(
        entity_type,
        entity,
        field, /* This is actually the instance, doh! (I think) */
        drupalgap_field_info_field(field_name),
        language,
        items,
        display
      );
      for (var delta in elements) {
          if (!elements.hasOwnProperty(delta)) { continue; }
          var element = elements[delta];
          // If the element has markup, render it as is, if it is
          // themeable, then theme it.
          var element_content = '';
          if (element.markup) { element_content = element.markup; }
          else if (element.theme) {
            element_content = theme(element.theme, element);
          }
          content += element_content;
      }
      
      // Render the field label, if necessary.
      if (content != '' && display['label'] != 'hidden') {
        var label = '<h3>' + field.label + '</h3>';
        // Place the label above or below the field content.
        label = '<div>' + label + '</div>';
        switch (display['label']) {
          case 'below':
            content += label;
            break;
          case 'above':
          default:
            content = label + content;
            break;
        }
      }
      
      $scope[field_name] = content;

    }
    catch (error) { console.log('hook_field_formatter_view - ' + error); }
  } ]
);

// DEPRECATED
dgApp.directive("hookFieldWidgetForm", function($compile) {
    dpm('hookFieldWidgetForm');
    return {
      //transclude: true,
      link: function(scope, element) {
        
        dpm('hookFieldWidgetForm - link...');
        console.log(arguments);
        
        var entity_type = scope.$parent.entity_type;
      var entity = scope.$parent[entity_type];
      var bundle = drupalgap_get_bundle(entity_type, entity);
      var form = scope.$parent.form;
      console.log(form);
      var field_name = element.attr('field_name');
      var field_widget_form = element.attr('field_widget_form');
      var delta = element.attr('delta');
      var language = element.attr('language');
      var variables = scope.variables;
      
      //console.log(entity_type);
      //console.log(entity);
      //console.log(bundle);
      //console.log(form);
      //console.log(field_name);
      
      // Invoke hook_field_widget_form().
      dpm('invoking widget hook.');
      var fn = window[field_widget_form];
      fn.apply(
        null, [
          form,
          null,
          form.elements[field_name].field_info_field,
          form.elements[field_name].field_info_instance,
          language,
          form.elements[field_name][language],
          delta,
          form.elements[field_name]
      ]);
      console.log(form);
      
      

      }
    };
});

// DEPRECATED
dgApp.controller('hook_field_widget_form',
  [ '$scope', '$element', function($scope, $element) {
    try {

      dpm('hook_field_widget_form');
      console.log(arguments);
      
      /*$scope.init = function(variables) {
        $scope.variables = variables;
      }*/
      
      
      
      
      
      return;
      
      
      
      
      
      // Load the field instance.
      var field = drupalgap_field_info_instance(entity_type, field_name, bundle);
      console.log(field);
      
      // The user registration form is a special case, in that we only want
      // to place fields that are set to display on the user registration
      // form. Skip any fields not set to display.
      if (form.id == 'user_register_form' &&
        !field.settings.user_register_form) {
        return;
      }
      var field_info = drupalgap_field_info_field(name);
      if (field_info) {
        form.elements[name] = {
          type: field_info.type,
          title: field.label,
          required: field.required,
          description: field.description
        };
        if (!form.elements[name][language]) {
          form.elements[name][language] = {};
        }
        var default_value = field.default_value;
        var delta = 0;
        var cardinality = parseInt(field_info.cardinality);
        if (cardinality == -1) {
          cardinality = 1; // we'll just add one element for now, until we
                           // figure out how to handle the 'add another
                           // item' feature.
        }
        if (entity && entity[name] && entity[name].length != 0) {
          for (var delta = 0; delta < cardinality; delta++) {
            // @TODO - is this where we need to use the idea of the
            // value_callback property present in Drupal's FAPI? That way
            // each element knows how to map the entity data to its element
            // value property.
            if (
              entity[name][language][delta] &&
              typeof entity[name][language][delta].value !== 'undefined'
            ) { default_value = entity[name][language][delta].value; }
            // If the default_value is null, set it to an empty string.
            if (default_value == null) { default_value = ''; }
            // @todo - It appears not all fields have a language code to use
            // here, for example taxonomy term reference fields don't!
            form.elements[name][language][delta] = {
              value: default_value
            };
            // Place the field item onto the element.
            if (entity[name][language][delta]) {
              form.elements[name][language][delta].item =
                entity[name][language][delta];
            }
          }
        }

        // Give module's a chance to alter their own element during the form
        // build, that way element properties will be saved to local storage
        // and then available during hook_field_widget_form() and the form
        // submission process.
        var fn = field.widget.module + '_field_info_instance_add_to_form';
        if (drupalgap_function_exists(fn)) {
          window[fn](entity_type, bundle, form, entity, form.elements[name]);
        }

      }

    }
    catch (error) { console.log('hook_field_widget_form - ' + error); }
  } ]
);

/**
 * Given a field, this will return its display.
 * @param {Object} field
 * @return {Object}
 */
function drupalgap_field_display(field) {
  try {
    var display = field.display['default'];
    if (field.display['drupalgap']) {
      display = field.display['drupalgap'];
      // If a module isn't listed on the drupalgap display, use the default
      // display's module.
      if (
        typeof display.module === 'undefined' &&
        typeof field.display['default'].module !== 'undefined'
      ) { display.module = field.display['default'].module; }
    }
    return display;
  }
  catch (error) { console.log('drupalgap_field_display - ' + error); }
}

/**
 * Returns info on all fields.
 * @return {Object}
 */
function drupalgap_field_info_fields() {
  try {
    return drupalgap.field_info_fields;
  }
  catch (error) { console.log('drupalgap_field_info_fields - ' + error); }
}

/**
 * Given an entity type, field name, and bundle name this will return a JSON
 * object with data for the specified field name.
 * @param {String} entity_type
 * @param {String} field_name
 * @param {String} bundle_name
 * @return {Object}
 */
function drupalgap_field_info_instance(entity_type, field_name, bundle_name) {
  try {
    var instances = drupalgap_field_info_instances(entity_type, bundle_name);
    if (!instances) {
      var msg = 'WARNING: drupalgap_field_info_instance - instance was null ' +
      'for entity (' + entity_type + ') bundle (' + bundle_name + ') using ' +
      'field (' + field_name + ')';
      console.log(msg);
      return null;
    }
    if (!instances[field_name]) {
      var msg = 'WARNING: drupalgap_field_info_instance - ' +
        '"' + field_name + '" does not exist for entity (' + entity_type + ')' +
        ' bundle (' + bundle_name + ')';
      console.log(msg);
      return null;
    }
    return instances[field_name];
  }
  catch (error) { console.log('drupalgap_field_info_instance - ' + error); }
}

/**
 * Given an entity type, bundle, form and entity, this will add the
 * entity's fields to the given form.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} form
 * @param {Object} entity
 * @deprecated
 */
function drupalgap_field_info_instances_add_to_form(entity_type, bundle,
  form, entity) {
  try {
    
    dpm('drupalgap_field_info_instances_add_to_form');
    console.log(arguments);
    
    // Grab the field info instances for this entity type and bundle.
    var fields = drupalgap_field_info_instances(entity_type, bundle);
    // If there is no bundle, pull the fields out of the wrapper.
    //if (!bundle) { fields = fields[entity_type]; }
    // Use the default language, unless the entity has one specified.
    var language = language_default();
    if (entity && entity.language) { language = entity.language; }
    // Iterate over each field in the entity and add it to the form. If there is
    // a value present in the entity, then set the field's form element default
    // value equal to the field value.
    if (fields) {
      for (var name in fields) {
        if (!fields.hasOwnProperty(name)) { continue; }
        
        
        
        
        
        
        
        
        var field = fields[name];
        // The user registration form is a special case, in that we only want
        // to place fields that are set to display on the user registration
        // form. Skip any fields not set to display.
        if (form.id == 'user_register_form' &&
          !field.settings.user_register_form) {
          continue;
        }
        var field_info = drupalgap_field_info_field(name);
        if (field_info) {
          form.elements[name] = {
            type: field_info.type,
            title: field.label,
            required: field.required,
            description: field.description
          };
          if (!form.elements[name][language]) {
            form.elements[name][language] = {};
          }
          var default_value = field.default_value;
          var delta = 0;
          var cardinality = parseInt(field_info.cardinality);
          if (cardinality == -1) {
            cardinality = 1; // we'll just add one element for now, until we
                             // figure out how to handle the 'add another
                             // item' feature.
          }
          if (entity && entity[name] && entity[name].length != 0) {
            for (var delta = 0; delta < cardinality; delta++) {
              // @TODO - is this where we need to use the idea of the
              // value_callback property present in Drupal's FAPI? That way
              // each element knows how to map the entity data to its element
              // value property.
              if (
                entity[name][language][delta] &&
                typeof entity[name][language][delta].value !== 'undefined'
              ) { default_value = entity[name][language][delta].value; }
              // If the default_value is null, set it to an empty string.
              if (default_value == null) { default_value = ''; }
              // @todo - It appears not all fields have a language code to use
              // here, for example taxonomy term reference fields don't!
              form.elements[name][language][delta] = {
                value: default_value
              };
              // Place the field item onto the element.
              if (entity[name][language][delta]) {
                form.elements[name][language][delta].item =
                  entity[name][language][delta];
              }
            }
          }

          // Give module's a chance to alter their own element during the form
          // build, that way element properties will be saved to local storage
          // and then available during hook_field_widget_form() and the form
          // submission process.
          var fn = field.widget.module + '_field_info_instance_add_to_form';
          if (drupalgap_function_exists(fn)) {
            window[fn](entity_type, bundle, form, entity, form.elements[name]);
          }

        }
      }
    }
  }
  catch (error) {
    console.log('drupalgap_field_info_instances_add_to_form - ' + error);
  }
}

/**
 * Given a field name, this will return the key that should be used when
 * setting its value on an entity. If the field name is not a field, it returns
 * false.
 * @param {String} field_name
 * @return {String}
 */
function drupalgap_field_key(field_name) {
  try {
    // Determine the key to use for the value. By default, most fields
    // use 'value' as the key.
    var key = false;
    var field_info = drupalgap_field_info_field(field_name);
    if (field_info) {
      key = 'value';
      // Images use fid as the key.
      if (field_info.module == 'image' && field_info.type == 'image') {
        key = 'fid';
      }
      else if (
        field_info.module == 'taxonomy' &&
        field_info.type == 'taxonomy_term_reference'
      ) { key = 'tid'; }
    }
    return key;
  }
  catch (error) { console.log('drupalgap_field_key - ' + error); }
}

/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {*} display
 * @return {Object}
 */
function list_field_formatter_view(entity_type, entity, field, instance,
  langcode, items, display) {
  try {
    var element = {};
    if (!empty(items)) {
      for (var delta in items) {
          if (!items.hasOwnProperty(delta)) { continue; }
          var item = items[delta];
          var markup = '';
          // list_default or list_key
          if (display.type == 'list_default') {
            markup = instance.settings.allowed_values[item.value];
            // Single on/off checkboxes need an empty space as their markup so
            // just the label gets rendered.
            if (
              instance.type == 'list_boolean' &&
              field.widget.type == 'options_onoff'
            ) { markup = '&nbsp;'; }
          }
          else { markup = item.value; }
          element[delta] = { markup: markup };
      }
    }
    return element;
  }
  catch (error) { console.log('list_field_formatter_view - ' + error); }
}

/**
 * Implements hook_assemble_form_state_into_field().
 * @param {Object} entity_type
 * @param {String} bundle
 * @param {String} form_state_value
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Number} delta
 * @param {Object} field_key
 *
 * @return {*}
 */
function list_assemble_form_state_into_field(entity_type, bundle,
  form_state_value, field, instance, langcode, delta, field_key) {
  try {
    var result = form_state_value;
    switch (field.type) {
      case 'list_boolean':
        // For single on/off checkboxes, if the checkbox is unchecked, then we
        // send a null value on the language code. We know the checkbox is
        // unchecked if the form_state_value is equal to the first allowed value
        // on the field.
        if (instance.widget.type == 'options_onoff') {
          var index = 0;
          var on = true;
          for (var value in field.settings.allowed_values) {
              if (!field.settings.allowed_values.hasOwnProperty(value)) { continue; }
              var label = field.settings.allowed_values[value];
              if (form_state_value == value && index == 0) {
                on = false;
                break;
              }
              index++;
          }
          if (!on) {
            field_key.use_delta = false;
            field_key.use_wrapper = false;
            result = null;
          }
        }
        else {
          console.log(
            'WARNING: list_assemble_form_state_into_field - unknown widget (' +
              field.type +
            ') on list_boolean'
          );
        }
        break;
      case 'list_text':
        // For radio buttons on the user entity form, field values must be
        // "flattened", i.e. this field_foo: { und: [ { value: 123 }]}, should
        // be turned into field_foo: { und: 123 }
        if (
          entity_type == 'user' &&
          instance.widget.type == 'options_buttons'
        ) {
          field_key.use_delta = false;
          field_key.use_wrapper = false;
        }
        break;
      default:
        console.log(
          'WARNING: list_assemble_form_state_into_field - unknown type (' +
            field.type +
          ')'
        );
        break;
    }
    return result;
  }
  catch (error) {
    console.log('list_assemble_form_state_into_field - ' + error);
  }
}

/**
 * Implements hook_views_exposed_filter().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} element
 * @param {Object} filter
 * @param {Object} field
 */
function list_views_exposed_filter(form, form_state, element, filter, field) {
  try {
    //dpm('list_views_exposed_filter');
    //dpm(arguments);
    var widget = filter.options.group_info.widget;
    if (widget == 'select') {
      // Set the element value if we have one in the filter.
      if (!empty(filter.value)) { element.value = filter.value[0]; }
      // Set the options, then depending on whether or not it is required, set
      // the default value accordingly.
      element.options = filter.value_options;
      if (!element.required) {
        element.options['All'] = '- ' + t('Any') + ' -';
        if (typeof element.value === 'undefined') { element.value = 'All'; }
      }
    }
    else {
      dpm(
        'WARNING: list_views_exposed_filter - unsupported widget (' +
          widget +
        ')'
      );
    }
  }
  catch (error) { console.log('list_views_exposed_filter - ' + error); }
}

/**
 * Implements hook_field_formatter_view().
 * @param {String} entity_type
 * @param {Object} entity
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {*} display
 * @return {Object}
 */
function number_field_formatter_view(entity_type, entity, field, instance,
  langcode, items, display) {
  try {
    var element = {};
    // If items is a string, convert it into a single item JSON object.
    if (typeof items === 'string') {
      items = {0: {value: items}};
    }
    if (!empty(items)) {
      var prefix = '';
      if (!empty(field.settings.prefix)) { prefix = field.settings.prefix; }
      var suffix = '';
      if (!empty(field.settings.suffix)) { suffix = field.settings.suffix; }
      for (var delta in items) {
          if (!items.hasOwnProperty(delta)) { continue; }
          var item = items[delta];
          element[delta] = {
            markup: prefix + item.value + suffix
          };
      }
    }
    return element;
  }
  catch (error) { console.log('number_field_formatter_view - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function number_field_widget_form(form, form_state, field, instance, langcode,
  items, delta, element) {
  try {
    switch (element.type) {
      case 'number_integer':
      case 'number_float':
      case 'range':
        // Change the form element into a number, unless we're using a range
        // slider. Then set its min/max attributes along with the step.
        if (element.type != 'range') { items[delta].type = 'number'; }
        if (!empty(instance.settings.max)) {
          items[delta].options.attributes['min'] = instance.settings.min;
        }
        if (!empty(instance.settings.max)) {
          items[delta].options.attributes['max'] = instance.settings.max;
        }
        var step = 1;
        if (element.type == 'number_float') { step = 0.01; }
        items[delta].options.attributes['step'] = step;
        break;
      default:
        console.log(
          'number_field_widget_form - element type not supported (' +
            element.type +
          ')'
        );
        break;
    }
  }
  catch (error) { console.log('number_field_widget_form - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 * @return {*}
 */
function options_field_widget_form(form, form_state, field, instance, langcode,
  items, delta, element) {
  try {
    switch (element.type) {
      case 'checkbox':
        // If the checkbox has a default value of 1, check the box.
        if (items[delta].default_value == 1) { items[delta].checked = true; }
        break;
      case 'radios':
        break;
      case 'list_boolean':
        switch (instance.widget.type) {
          case 'options_onoff':
            // Switch an on/off boolean to a checkbox and place its on/off
            // values as attributes. Depending on the allowed values, we may
            // have to iterate over an array, or an object to get the on/off
            // values.
            items[delta].type = 'checkbox';
            var off = null;
            var on = null;
            if ($.isArray(field.settings.allowed_values)) {
              for (var key in field.settings.allowed_values) {
                if (off === null) { off = key; }
                else { on = key; }
              }
            }
            else {
              for (var value in field.settings.allowed_values) {
                  if (!field.settings.allowed_values.hasOwnProperty(value)) { continue; }
                  var label = field.settings.allowed_values[value];
                  if (off === null) { off = value; }
                  else { on = value; }
              }
            }
            items[delta].options.attributes['off'] = off;
            items[delta].options.attributes['on'] = on;
            // If the value equals the on value, then check the box.
            if (
              typeof items[delta] !== 'undefined' && items[delta].value == on
            ) { items[delta].options.attributes['checked'] = 'checked'; }
            break;
          default:
            console.log(
              'WARNING: options_field_widget_form list_boolean with ' +
              'unsupported type (' + instance.widget.type + ')'
            );
            break;
        }
        break;
      case 'select':
      case 'list_text':
      case 'list_float':
      case 'list_integer':
        if (instance) {
          switch (instance.widget.type) {
            case 'options_select':
              items[delta].type = 'select';
              // If the select list is required, add a 'Select' option and set
              // it as the default.  If it is optional, place a "none" option
              // for the user to choose from.
              var text = '- None -';
              if (items[delta].required) {
                text = '- ' + t('Select a value') + ' -';
              }
              items[delta].options[''] = text;
              if (empty(items[delta].value)) { items[delta].value = ''; }
              // If more than one value is allowed, turn it into a multiple
              // select list.
              if (field.cardinality != 1) {
                items[delta].options.attributes['data-native-menu'] = 'false';
                items[delta].options.attributes['multiple'] = 'multiple';
              }
              break;
            case 'options_buttons':
              // If there is one value allowed, we turn this into radio
              // button(s), otherwise they will become checkboxes.
              var type = 'checkboxes';
              if (field.cardinality == 1) { type = 'radios'; }
              items[delta].type = type;
              break;
            default:
              console.log(
                'WARNING: options_field_widget_form - unsupported widget (' +
                instance.widget.type + ')'
              );
              return false;
              break;
          }
          // If there are any allowed values, place them on the options
          // list. Then check for a default value, and set it if necessary.
          if (field && field.settings.allowed_values) {
            for (var key in field.settings.allowed_values) {
                if (!field.settings.allowed_values.hasOwnProperty(key)) { continue; }
                var value = field.settings.allowed_values[key];
                // Don't place values that are objects onto the options
                // (i.e. commerce taxonomy term reference fields).
                if (typeof value === 'object') { continue; }
                // If the value already exists in the options, then someone
                // else has populated the list (e.g. commerce), so don't do
                // any processing.
                if (typeof items[delta].options[key] !== 'undefined') {
                  break;
                }
                // Set the key and value for the option.
                items[delta].options[key] = value;
            }
            if (instance.default_value && instance.default_value[delta] &&
              typeof instance.default_value[delta].value !== 'undefined') {
                items[delta].value = instance.default_value[delta].value;
            }
          }
        }
        break;
      case 'taxonomy_term_reference':
          // Change the item type to a hidden input.
          items[delta].type = 'hidden';
          // What vocabulary are we using?
          var machine_name = field.settings.allowed_values[0].vocabulary;
          var taxonomy_vocabulary =
            taxonomy_vocabulary_machine_name_load(machine_name);

          var widget_type = false;
          if (instance.widget.type == 'options_select') {
            widget_type = 'select';
          }
          else {
            console.log(
              'WARNING: options_field_widget_form() - ' + instance.widget.type +
              ' not yet supported for ' + element.type + ' form elements!'
            );
            return false;
          }
          var widget_id = items[delta].id + '-' + widget_type;
          // If the select list is required, add a 'Select' option and set
          // it as the default.  If it is optional, place a "none" option
          // for the user to choose from.
          var text = '- ' + t('None') + ' -';
          if (items[delta].required) {
            text = '- ' + t('Select a value') + ' -';
          }
          items[delta].children.push({
              type: widget_type,
              attributes: {
                id: widget_id,
                onchange: "_theme_taxonomy_term_reference_onchange(this, '" +
                  items[delta].id +
                "');"
              },
              options: { '': text }
          });
          // Attach a pageshow handler to the current page that will load the
          // terms into the widget.
          var options = {
            'page_id': drupalgap_get_page_id(drupalgap_path_get()),
            'jqm_page_event': 'pageshow',
            'jqm_page_event_callback':
              '_theme_taxonomy_term_reference_load_items',
            'jqm_page_event_args': JSON.stringify({
                'taxonomy_vocabulary': taxonomy_vocabulary,
                'widget_id': widget_id
            })
          };
          // Pass the field name so the page event handler can be called for
          // each item.
          items[delta].children.push({
              markup: drupalgap_jqm_page_event_script_code(
                  options,
                  field.field_name
              )
          });
        break;
    }
  }
  catch (error) { console.log('options_field_widget_form - ' + error); }
}

dgApp.directive('textFieldWidgetForm', ['$compile', 'hookFieldWidgetForm', function($compile, hookFieldWidgetForm) {
      
      dpm('textFieldWidgetForm');
      console.log(arguments);
      
      return {
        link: function($scope, $element) {
          
          dpm('textFieldWidgetForm link');
          console.log(arguments);
          
          var field_name = $element.attr('field_name');
          var form_element = $scope.form.elements[field_name];
          //console.log(form_element);
          
          //var form
          //var form_state
          var field = hookFieldWidgetForm.getField('field_name');
          //var instance
          //var langcode
          //var items
          //var delta
          //var element

          // Determine the widget type, then set the delta item's type property.
          var type = null;
          switch (form_element.type) {
            case 'search': type = 'search'; break;
            case 'text': type = 'textfield'; break;
            case 'textarea':
            case 'text_long':
            case 'text_with_summary':
            case 'text_textarea':
              type = 'textarea';
          }
          $scope.items[$scope.delta].type = type;
          
          // Compile the widget.
          dgFieldWidgetFormCompile($compile, $scope, $element);

        }
      };
}]);

