/**
 * Alerts a message to the user using PhoneGap's alert. It is important to
 * understand this is an async function, so code will continue to execute while
 * the alert is displayed to the user.
 * You may optionally pass in a second argument as a JSON object with the
 * following properties:
 *   alertCallback - the function to call after the user presses OK
 *   title - the title to use on the alert box, defaults to 'Alert'
 *   buttonName - the text to place on the button, default to 'OK'
 * @param {String} message
 */
dg.alert = function(message) {
  var options = null;
  if (arguments[1]) { options = arguments[1]; }
  var alertCallback = function() { };
  var title = 'Alert';
  var buttonName = 'OK';
  if (options) {
    if (options.alertCallback) { alertCallback = options.alertCallback; }
    if (options.title) { title = options.title; }
    if (options.buttonName) { buttonName = options.buttonName; }
  }
  if (
    dg.config('mode') != 'phonegap' ||
    typeof navigator.notification === 'undefined'
  ) { alert(message); alertCallback(); }
  else {
    navigator.notification.alert(message, alertCallback, title, buttonName);
  }
};

/**
 * Themes a message box.
 * @param {Object} variables
 * @returns {string}
 */
dg.theme_message = function(variables) {
  var format = variables._format ? variables._format : 'div';
  var type = variables._type ? variables._type : null;
  if (!jDrupal.inArray('messages', variables._attributes.class)) { variables._attributes.class.push('messages'); }
  if (type && !jDrupal.inArray(type, variables._attributes.class)) { variables._attributes.class.push(type); }
  return '<' + format + ' ' + dg.attributes(variables._attributes) + '>' + variables._message + '</' + format + '>';
};
