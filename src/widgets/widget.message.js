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
  var classes = variables._attributes.class;
  var className = 'messages';
  if (!dg.inArray(className, classes)) { classes.push(className); }
  if (type && !dg.inArray(type, classes)) { classes.push(type); }
  return '<' + format + ' ' + dg.attrs(variables) + '>' + variables._message + '</' + format + '>';
};
