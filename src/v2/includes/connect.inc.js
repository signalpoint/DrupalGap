/**
 *
 */
function drupalgap_json_load() {
  try {
    
  }
  catch (error) { console.log('drupalgap_json_load - ' + error); }
}


/**
 * Checks the devices connection and sets drupalgap.online to true if the
 * device has a connection, false otherwise.
 * @return {String}
 *   A string indicating the type of connection according to PhoneGap.
 */
function dg_check_connection() {
  try {
    
    // OFFLINE FIRST DUDE!
    return false;
    
    
    
    
    

    // If we're not in PhoneGap (i.e. a web app environment, or Ripple), we'll
    // assume we have a connection. Is this a terrible assumption? Anybody out
    // there know?
    // http://stackoverflow.com/q/15950382/763010
    if (
      drupalgap.settings.mode != 'phonegap' ||
      typeof parent.window.ripple === 'function'
    ) {
      drupalgap.online = true;
      return 'Ethernet connection';
    }

    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    if (states[networkState] == 'No network connection') {
      drupalgap.online = false;
    }
    else {
      drupalgap.online = true;
    }
    return states[networkState];
  }
  catch (error) { console.log('drupalgap_check_connection - ' + error); }
}

/**
 *
 */
function dg_session_get() {
  try {
    return {
      sessid: drupalgap.sessid,
      session_name: drupalgap.session_name,
      user: dg_user_get()
    };
  }
  catch (error) { console.log('dg_session_get - ' + error); }
}


/**
 *
 */
function dg_session_set(data) {
  try {
    drupalgap.sessid = data.sessid;
    drupalgap.session_name = data.session_name;
    dg_user_set(data.user);
  }
  catch (error) { console.log('dg_session_set - ' + error); }
}

