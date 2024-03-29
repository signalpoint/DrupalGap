dg.theme_actions = function(variables) {
  var html = '';
  for (prop in variables) {
    if (!dg.isFormElement(prop, variables)) { continue; }
    html += dg.render(variables[prop]);
  }
  return html;
};

/**
 * Renders a checkbox.
 * @param variables
 *  _title {string} The title to use on the checkbox label.
 *  _label {Object} An optional label for theme_label().
 *  _prefix {string} HTML to place before the input.
 *  _suffix {string} HTML to place before the input (or label).
 *  _default_value {*} Optional
 * @returns {string}
 */
dg.theme_checkbox = function(vars) {
  vars._attributes.type = 'checkbox';
  if (!vars._attributes.id) { vars._attributes.id = 'checkbox-' + dg.salt(); }
  if (vars._default_value) { vars._attributes.checked = 'checked'; }
  var label = vars._label;
  if (!label) { label = { }; }
  dg.elementAttributesInit(label);
  if (!label._title) { label._title = vars._title; }
  var labelAttrs = label._attributes;
  if (!labelAttrs.for) { labelAttrs.for = vars._attributes.id; }
  var label = dg.theme('label', label);
  var prefix = vars._prefix ? vars._prefix : '';
  var suffix = vars._suffix ? vars._suffix : '';
  return prefix + '<input ' + dg.attributes(vars._attributes) + ' />' + label + suffix;
};

/**
 * Renders a set of checkboxes.
 * @param variables
 *   _options {object}
 *     123: 'foo',
 *     456: 'bar',
 *     789: {
 *       _title: 'baz',
 *       _prefix: '<div class="my-checkbox">',
 *       _suffix: '<div>',
 *     }
 * @returns {string}
 */
dg.theme_checkboxes = function(variables) {
  var html = '';
  for (var value in variables._options) {
    if (!variables._options.hasOwnProperty(value)) { continue; }
    var label = variables._options[value];
    var checkboxVariables = typeof label !== 'object' ? {
      _title: !jDrupal.isEmpty(label) ? label : value
    } : label;
    if (!checkboxVariables._attributes) { checkboxVariables._attributes = {}; }
    if (typeof checkboxVariables._attributes.value === 'undefined') {
      checkboxVariables._attributes.value = value;
    }
    if (variables._default_value && variables._default_value[value]) {
      checkboxVariables._default_value = variables._default_value[value];
    }
    html += dg.theme('checkbox', checkboxVariables) + '<br />';
  }
  return '<div ' + dg.attributes(variables._attributes) + '>' + html + '</div>';
};

/**
 * Renders a description for a form element.
 * @param {type} vars
 *  _description {String}
 * @returns {String}
 */
dg.theme_description = function(vars) {
  return '<small ' + dg.attrs(vars) + '>' + vars._description + '</small>';
};

dg.theme_email = function(variables) {
  variables._attributes.type = 'email';
  return '<input ' + dg.attributes(variables._attributes) + '/>';
};
dg.theme_hidden = function(variables) {
  variables._attributes.type = 'hidden';
  return '<input ' + dg.attributes(variables._attributes) + ' />';
};
dg.theme_label = function(vars) {
  return ' <label ' + dg.attrs(vars) + '>' + vars._title + '</label>';
};
dg.theme_number = function(variables) {
  variables._attributes.type = 'number';
  return '<input ' + dg.attributes(variables._attributes) + '/>';
};
dg.theme_password = function(variables) {
  variables._attributes.type = 'password';
  return '<input ' + dg.attributes(variables._attributes) + ' />';
};
dg.theme_radio = function(variables) {
  variables._attributes.type = 'radio';
  var title = variables._title ? variables._title : null;
  var titleAttributes = variables._title_attributes ? variables._title_attributes : {};
  if (!titleAttributes.for) { titleAttributes.for = variables._attributes.id; }
  var html = '<input ' + dg.attributes(variables._attributes) + '/>';
  if (title) { html += '<label ' + dg.attributes(titleAttributes) + '>' + title + '</label>'; }
  return html;
};
dg.theme_radios = function(variables) {
  var html = '';
  for (var value in variables._options) {
    if (!variables._options.hasOwnProperty(value)) { continue; }
    var label = variables._options[value];
    var radioVariables = {
      _title: !jDrupal.isEmpty(label) ? label : value,
      _attributes: {
        value: value,
        name: variables._attributes.name
      }
    };
    if (variables._default_value == value) { radioVariables._attributes.checked = 'checked'; }
    html += '<div>' + dg.theme('radio', radioVariables) + '</div>';
  }
  return '<div ' + dg.attributes(variables._attributes) + '>' + html + '</div>';
};
dg.theme_select = function(variables) {
  var options = '';
  if (variables._options) {
    for (var value in variables._options) {
      if (!variables._options.hasOwnProperty(value)) { continue; }
      var item = variables._options[value];
      if (typeof item === 'object') {
        if (typeof variables._value !== 'undefined' && variables._value == value) { item._attributes.selected = ''; }
        options += dg.render(item);
      }
      else {
        var selected = '';
        if (typeof variables._value !== 'undefined' && variables._value == value) { selected = ' selected '; }
        options += '<option value="' + value + '" ' + selected + '>' + item + '</option>';
      }
    }
  }
  return '<select ' + dg.attributes(variables._attributes) + '>' + options + '</select>';
};
dg.theme_submit = function(variables) {
  variables._attributes.type = 'submit';
  if (!variables._attributes.value && variables._value) {
    variables._attributes.value = variables._value;
  }
  return '<input ' + dg.attributes(variables._attributes) + '/>';
};
dg.theme_textarea = function(variables) {
  var value = variables._value ? variables._value : '';
  return '<textarea ' + dg.attributes(variables._attributes) + '>' + value + '</textarea>';
};
dg.theme_textfield = function(variables) {
  variables._attributes.type = 'text';
  return '<input ' + dg.attributes(variables._attributes) + '/>';
};
