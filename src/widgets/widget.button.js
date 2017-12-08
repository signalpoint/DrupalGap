/**
 * Themes a button.
 * @param {Object} variables
 * @returns {string}
 */
dg.theme_button = function(variables) {
  if (!variables._value) { variables._value = ''; }
  if (!variables._attributes.type) { variables._attributes.type = 'button'; }
  return '<button ' + dg.attributes(variables._attributes) + '>' + variables._value + '</button>';
};
