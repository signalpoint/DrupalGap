/**
 *
 * @constructor
 */
dg.Theme = function() {
  this.regions = null;
};
dg.Theme.prototype.get = function(property) {
  return typeof this[property] !== 'undefined' ? this[property] : null;
};
dg.Theme.prototype.getRegions = function() {
  return this.get('regions');
};

dg.themeLoad = function() {
  return new Promise(function(ok, err) {
    if (!dg.activeTheme) {
      var config = dg.config('theme');
      var class_name = jDrupal.ucfirst(dg.getCamelCase(config.name));
      dg.activeTheme = new window[class_name];
    }
    ok(dg.activeTheme);
  });
};

/**
 * Implementation of theme().
 * @param {String} hook
 * @param {Object} variables
 * @return {String}
 */
dg.theme = function(hook, variables) {
  try {

    // If there is HTML markup present, just return it as is. Otherwise, run
    // the theme hook and send along the variables.
    if (!variables) { variables = {}; }
    if (variables._markup) { return variables._markup; }
    var content = '';

    // First see if the current theme implements the hook, if it does use it, if
    // it doesn't fallback to the core theme implementation of the hook.
    //var theme_function = drupalgap.settings.theme + '_' + hook;
    //if (!function_exists(theme_function)) {
      var theme_function = 'theme_' + hook;
      if (!jDrupal.functionExists(dg[theme_function])) {
        var caller = null;
        if (arguments.callee.caller) {
          caller = arguments.callee.caller.name;
        }
        var msg = 'WARNING: ' + theme_function + '() does not exist.';
        if (caller) { msg += ' Called by: ' + caller + '().' }
        console.log(msg);
        return content;
      }
    //}

    // Set default attributes.
    if (!variables._attributes) { variables._attributes = {}; }

    // If there is no class name array, set an empty one.
    if (!variables._attributes['class']) { variables._attributes['class'] = []; }

    var html = dg[theme_function].call(null, variables);
    if (html instanceof Promise) {
      html.then(function(data) {
        document.getElementById(data.variables._attributes.id).innerHTML = dg.render(data.content);
      });
      return '<div ' + dg.attributes(variables._attributes) + '>hmmm...</div>';
    }
    return html;
  }
  catch (error) { console.log('dg.theme - ' + error); }
};