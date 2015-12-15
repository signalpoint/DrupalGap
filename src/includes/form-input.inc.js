function theme_actions(variables) {
  var html = '';
  for (prop in variables) {
    if (!dg.isFormElement(prop, variables)) { continue; }
    html += dg.render(variables[prop]);

  }
  return html;
}
function theme_password(variables) {
  variables._attributes.type = 'password';
  return '<input ' + dg.attributes(variables._attributes) + ' />';
}
function theme_submit(variables) {
  variables._attributes.type = 'submit';
  var value = 'Submit';
  if (!variables._attributes.value) {
    if (typeof variables._value !== 'undefined') {
      value = variables._value
    }
  }
  variables._attributes.value = value;
  return '<input ' + dg.attributes(variables._attributes) + '/>';
}
function theme_textfield(variables) {
  variables._attributes.type = 'text';
  return '<input ' + dg.attributes(variables._attributes) + '/>';
}