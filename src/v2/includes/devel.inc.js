/**
 * Given a JSON object or string, this will print it to the console. It accepts
 * an optional boolean as second argument, if it is false the output sent to the
 * console will not use pretty printing in a Chrome/Ripple environment.
 * @param {Object} data
 */
function dpm(data) {
  try {
    // Show the caller name.
    //var caller = arguments.callee.caller.name + '()';
    //console.log(caller);
    if (data) {
      if (typeof parent.window.ripple === 'function') {
        if (typeof arguments[1] !== 'undefined' && arguments[1] == false) {
          console.log(JSON.stringify(data));
        }
        else {
          console.log(data);
        }
      }
      else if (typeof data === 'object') { console.log(JSON.stringify(data)); }
      else { console.log(data); }
    }
    else {
      if (data == '') { console.log('<empty-string>'); }
      else { console.log('<null>'); }
    }
  }
  catch (error) { console.log('dpm - ' + error); }
}

