/**
 * Queues a message for display on the next page load.
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

/**
 * Returns the number of messages in the queue.
 * @returns {Number}
 */
dg.getMessageCount = function() {
  return dg._messages.length;
};

/**
 * Gets all messages in the queue.
 * @returns {Array}
 */
dg.getMessages = function() {
  return dg._messages;
};

/**
 * Gets the latest message off of the queue.
 * @returns {*}
 */
dg.getMessage = function() {
  if (dg.getMessageCount()) { return dg._messages.pop(); }
  return null;
};

/**
 * Clears all messages in the queue.
 */
dg.clearMessages = function() {
  dg._messages = [];
};

/**
 * Shows a message without refreshing the current page.
 * @param message
 * @param type
 */
dg.showMessage = function(message, type) {
  console.log('showing');
  dg.setMessage(message, type);
  dg.showMessages();
};

/**
 * Shows all messages in the queue without refreshing the page.
 */
dg.showMessages = function() {
  dg.blockRefresh('messages');
};
