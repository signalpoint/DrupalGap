/**
 * Themes a message box.
 * @param {Object} variables
 *  _format {String} The html container element type to use, defaults to 'div'.
 *  _message {String} The message to display.
 *  _type {String} The message type can be 'status', 'warning' or 'error', defaults to 'status'.
 * @returns {string}
 */
dg.theme_message = function(variables) {
  var format = variables._format ? variables._format : 'div';
  var type = variables._type ? variables._type : null; // @TODO we should be defaulting to 'status' here, right?
  if (!jDrupal.inArray('messages', variables._attributes.class)) { variables._attributes.class.push('messages'); }
  if (type && !jDrupal.inArray(type, variables._attributes.class)) { variables._attributes.class.push(type); }
  return '<' + format + ' ' + dg.attributes(variables._attributes) + '>' + variables._message + '</' + format + '>';
};
