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
