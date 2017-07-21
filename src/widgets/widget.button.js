/**
 * Themes a button.
 * @param {Object} variables
 * @returns {string}
 */
dg.theme_button = function(variables) {
  if (!variables._value) { variables._value = ''; }
  return '<button ' + dg.attributes(variables._attributes) + '>' + variables._value + '</button>';
};
