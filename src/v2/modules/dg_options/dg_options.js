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
      /*case 'taxonomy_term_reference':
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
        break;*/
    }
  }
  catch (error) { console.log('options_field_widget_form - ' + error); }
}
