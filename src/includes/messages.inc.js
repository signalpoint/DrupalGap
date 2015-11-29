/**
 * Show the jQueryMobile loading message.
 * @see http://stackoverflow.com/a/16277865/763010
 */
function drupalgap_loading_message_show() {
  try {
    // Backwards compatability for versions prior to 7.x-1.6-alpha
    if (drupalgap.loading === 'undefined') { drupalgap.loading = false; }
    // Return if the loading message is already shown.
    if (drupalgap.loading) { return; }
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
    /*$.mobile.loading('hide');
     drupalgap.loading = false;
     drupalgap.loader = 'loading';*/
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
