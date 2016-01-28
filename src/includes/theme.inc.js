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
dg.Theme.prototype.getRegionCount = function() {
  var count = 0;
  var regions = this.get('regions');
  for (var region in regions) {
    if (!regions.hasOwnProperty(region)) { continue; }
    count++;
  }
  return count;
};

dg.themeLoad = function() {
  return new Promise(function(ok, err) {
    if (!dg.activeTheme) {
      var themeClassName = jDrupal.ucfirst(dg.getCamelCase(dg.config('theme').name));
      if (!dg.themes[themeClassName]) {
        var msg = 'Failed to load theme (' + themeClassName + ') - did you include its .js file in the index.html file?';
        err(msg);
        return;
      }
      dg.activeTheme = new dg.themes[themeClassName];
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

    dg.setRenderElementDefaults(variables);

    var html = dg[theme_function].call(null, variables);
    if (html instanceof Promise) {
      html.then(function(data) {
        document.getElementById(data.variables._attributes.id).innerHTML = dg.render(data.content);
      });
      return '<div ' + dg.attributes(variables._attributes) + '></div>';
    }
    return html;
  }
  catch (error) { console.log('dg.theme - ' + error); }
};

/**
 * Given a render element, this will set any default values that haven't already been set.
 * @param {Object} element The render element.
 */
dg.setRenderElementDefaults = function(element) {
  //console.log(element);
  //if (typeof element._attributes === 'undefined') { element._attributes = {}; }
  //if (typeof element._attributes['class'] === 'undefined') { element._attributes['class'] = []; }

  if (typeof element === 'object') {
    if (typeof element._attributes === 'undefined') { element._attributes = {}; }
    if (typeof element._attributes['class'] === 'undefined') { element._attributes['class'] = []; }
    for (var piece in element) {
      if (!element.hasOwnProperty(piece) || dg.isProperty(piece, element)) { continue; }
      // @TODO we should be skipping dg properties here (e.g. anything with an underscore, probably causing the infinite loop)
      if (typeof element[piece] === 'object') {
        dg.setRenderElementDefaults(element[piece]);
      }
    }
  }

};
