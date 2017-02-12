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
 * Displays a confirmation message to the user using PhoneGap's confirm. It is
 * important to understand this is an async function, so code will continue to
 * execute while the confirmation is displayed to the user.
 * You may optionally pass in a second argument as a JSON object with the
 * following properties:
 *   confirmCallback - the function to call after the user presses a button, the
 *               button's label is passed to this function.
 *   title - the title to use on the alert box, defaults to 'Confirm'
 *   buttonLabels - the text to place on the OK, and Cancel buttons, separated
 *                  by comma.
 * @param {String} message
 */
dg.confirm = function(message) {
  var options = null;
  if (arguments[1]) { options = arguments[1]; }
  var confirmCallback = function(button) { };
  var title = dg.t('Confirm');
  var buttonLabels = [dg.t('OK'), dg.t('Cancel')];
  if (options) {
    if (options.confirmCallback) {
      confirmCallback = options.confirmCallback;
    }
    if (options.title) { title = options.title; }
    if (options.buttonLabels) { buttonLabels = options.buttonLabels; }
  }
  if (
      dg.config('mode') != 'phonegap' ||
      typeof navigator.notification === 'undefined'
  ) {
    var r = confirm(message);
    if (r == true) { confirmCallback(1); } // OK button.
    else { confirmCallback(2); } // Cancel button.
  }
  else {
    navigator.notification.confirm(
        message,
        confirmCallback,
        title,
        buttonLabels
    );
  }
};

/**
 * Themes a message box.
 * @param {Object} variables
 *  _message {String} The message to display.
 *  _type {String} The message type can be 'status', 'warning' or 'error', defaults to 'status'.
 * @returns {string}
 */
dg.theme_message = function(variables) {
  var format = variables._format ? variables._format : 'div';
  var type = variables._type ? variables._type : null;
  if (!jDrupal.inArray('messages', variables._attributes.class)) { variables._attributes.class.push('messages'); }
  if (type && !jDrupal.inArray(type, variables._attributes.class)) { variables._attributes.class.push(type); }
  return '<' + format + ' ' + dg.attributes(variables._attributes) + '>' + variables._message + '</' + format + '>';
};

/**
 * Queues a message for future display.
 * @param {String|Array} message A message string to display, or an array of message objects.
 * @param {String} type Available types are "success", "warning" and "error". Defaults to "success".
 */
dg.setMessage = function(message, type) {
  if (jDrupal.isArray(message)) {
    for (var i in message) {
      if (!message.hasOwnProperty(i) || i.indexOf('_') == 0) { continue; }
      if (!message[i]._message || message[i]._message == '') { continue; }
      if (!message[i]._type) { message[i]._type = 'status'; }
      dg.setMessage(message[i]._message, message[i]._type);
    }
    return;
  }
  if (!type) { type = 'status'; }
  dg._messages.push({
    _message: message,
    _type: type,
    _theme: 'message'
  });
};

dg.getMessageCount = function() {
  return dg._messages.length;
};

dg.getMessages = function() {
  return dg._messages;
};

dg.getMessage = function() {
  if (dg.getMessageCount()) { return dg._messages.pop(); }
  return null;
};

dg.clearMessages = function() {
  dg._messages = [];
};
