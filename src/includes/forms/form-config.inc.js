/**
 *
 * @param form
 */
dg.configForm = function(form) {

  // Set local storage as the default if no type was provided.
  //if (!type) { type = 'local'; } // @TODO support 'session' and 'remote' here too
    // session: something saved only for the session
    // local: something saved in local storage
    // remote: something saved in drupal, security implications here

  // Add our custom submit handler.
  form._submit.push('system.configFormSubmit');

};
