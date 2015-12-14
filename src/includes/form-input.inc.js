function theme_actions(variables) {
  var html = '';
  for (prop in variables) {

    // Skip properties.
    if (
      !variables.hasOwnProperty(prop) ||
        prop.charAt(0) == '_'
    ) { continue; }

    console.log(prop);
    console.log(variables[prop]);
    html += dg.render(variables[prop]);

  }
  return html;
}
function theme_submit(variables) {
  variables._attributes.type = 'submit';
  if (!variables._attributes.value) { variables._attributes.value = 'Submit'; }
  return '<input ' + dg.attributes(variables._attributes) + '/>';
}
function theme_textfield(variables) {
  variables._attributes.type = 'text';
  return '<input ' + dg.attributes(variables._attributes) + '/>';
}