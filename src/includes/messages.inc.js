/**
 * Show the jQueryMobile loading message.
 * @see http://stackoverflow.com/a/16277865/763010
 */
function drupalgap_loading_message_show() {
  try {
    // Backwards compatibility for versions prior to 7.x-1.6-alpha
    if (drupalgap.loading === 'undefined') { drupalgap.loading = false; }
    // Return if the loading message is already shown.
    if (drupalgap.loading || drupalgap_toast_is_shown()) { return; }
    var options = drupalgap_loader_options();
    if (arguments[0]) { options = arguments[0]; }
    // Show the loading message.
    //$.mobile.loading('show', options);
    //drupalgap.loading = true;
    setTimeout(function() {
      $.mobile.loading('show', options);
      drupalgap.loading = true;
    }, 1);
  }
  catch (error) { console.log('drupalgap_loading_message_show - ' + error); }
}

/**
 * Hide the jQueryMobile loading message.
 */
function drupalgap_loading_message_hide() {
  try {
    if (drupalgap_toast_is_shown()) { return; }
    setTimeout(function() {
      $.mobile.loading('hide');
      drupalgap.loading = false;
      drupalgap.loader = 'loading';
    }, 100);
  }
  catch (error) { console.log('drupalgap_loading_message_hide - ' + error); }
}

/**
 * Returns the jQM loader options based on the current mode and settings.js.
 * @return {Object}
 */
function drupalgap_loader_options() {
  try {
    var mode = drupalgap.loader;
    var text = t('Loading') + '...';
    var textVisible = true;
    if (mode == 'saving') { var text = t('Saving') + '...'; }
    var options = {
      text: text,
      textVisible: textVisible
    };
    if (drupalgap.settings.loader && drupalgap.settings.loader[mode]) {
      options = $.extend(true, options, drupalgap.settings.loader[mode]);
      if (options.text) { options.text = t(options.text); }
    }
    return options;
  }
  catch (error) { console.log('drupalgap_loader_options - ' + error); }
}

/**
 * Sets a message to display to the user. Optionally pass in a second argument
 * to specify the message type: status, warning, error
 * @param {String} message
 */
function drupalgap_set_message(message) {
  try {
    if (empty(message)) { return; }
    var type = 'status';
    if (arguments[1]) { type = arguments[1]; }
    var msg = {
      message: message,
      type: type
    };
    drupalgap.messages.push(msg);
  }
  catch (error) { console.log('drupalgap_set_message - ' + error); }
}

/**
 * Sets the current messages.
 * @param {Array} messages
 */
function drupalgap_set_messages(messages) {
  try {
    drupalgap.messages = messages;
  }
  catch (error) { console.log('drupalgap_set_messages - ' + error); }
}

/**
 * Returns the current messages.
 * @return {Array}
 */
function drupalgap_get_messages() {
  try {
    return drupalgap.messages;
  }
  catch (error) { console.log('drupalgap_get_messages - ' + error); }
}

/**
 * Clears the messages from the current page. Optionally pass in a page id to
 * clear messages from a particular page.
 */
function drupalgap_clear_messages() {
  try {
    var page_id = arguments[0];
    if (empty(page_id)) { page_id = drupalgap_get_page_id(); }
    $('#' + page_id + ' div.messages').remove();
  }
  catch (error) { console.log('drupalgap_clear_messages - ' + error); }
}

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
function drupalgap_alert(message) {
  try {
    var options = null;
    if (arguments[1]) { options = arguments[1]; }
    var alertCallback = function() { };
    var title = t('Alert');
    var buttonName = t('OK');
    if (options) {
      if (options.alertCallback) { alertCallback = options.alertCallback; }
      if (options.title) { title = options.title; }
      if (options.buttonName) { buttonName = options.buttonName; }
    }
    if (
      drupalgap.settings.mode != 'phonegap' ||
      typeof navigator.notification === 'undefined'
    ) {
      alert(message);
      alertCallback();
    }
    else {
      navigator.notification.alert(message, alertCallback, title, buttonName);
    }
  }
  catch (error) { console.log('drupalgap_alert - ' + error); }
}

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
 * @return {Boolean}
 */
function drupalgap_confirm(message) {
  try {
    var options = null;
    if (arguments[1]) { options = arguments[1]; }
    var confirmCallback = function(button) { };
    var title = t('Confirm');
    var buttonLabels = [t('OK'), t('Cancel')];
    if (options) {
      if (options.confirmCallback) {
        confirmCallback = options.confirmCallback;
      }
      if (options.title) { title = options.title; }
      if (options.buttonLabels) { buttonLabels = options.buttonLabels; }
    }
    // The phonegap confirm dialog doesn't seem to work in Ripple, so just use
    // the default one, and it definitely doesn't work in a web app, so
    // otherwise just use the default confirm.
    if (
      typeof parent.window.ripple === 'function' ||
      drupalgap.settings.mode == 'web-app'
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
    return false;
  }
  catch (error) { console.log('drupalgap_confirm - ' + error); }
}

/**
 * Show a non intrusive alert message. You may optionally pass in an
 * integer value as the second argument to specify how many milliseconds
 * to wait before closing the message. Likewise, you can pass in a
 * third argument to specify how long to wait before opening the
 * message.
 * @param {string} html - The html to display.
 */
function drupalgap_toast(html) {
  try {
    var open = arguments[2] ? arguments[2] : 750;
    var close = arguments[1] ? arguments[1] : 1500;
    setTimeout(function() {
      drupalgap.toast.shown = true;
      $.mobile.loading('show', {
        textVisible: true,
        html: html
      });
      var interval = setInterval(function () {
        $.mobile.loading('hide');
        drupalgap.toast.shown = false;
        clearInterval(interval);
      }, close);
    }, open);
  }
  catch (error) {
    console.log('drupalgap_toast - ' + error);
  }
}

/**
 * Returns true if the toast is currently shown, false otherwise.
 * @returns {Boolean}
 */
function drupalgap_toast_is_shown() {
  return drupalgap.toast.shown;
}
