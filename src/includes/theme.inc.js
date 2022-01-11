dg._themeRegistry = {};

dg.getThemeRegistry = function() { return dg._themeRegistry; };
dg.themeHookRegistered = function(hook) {
  return typeof dg.getThemeRegistry()[hook] !== 'undefined';
};
dg.registerThemeHook = function(hook, module) {
  dg.getThemeRegistry()[hook] = module;
};
dg.getThemeHook = function(hook) {
  return dg.getThemeRegistry()[hook];
};

/**
 * Creates a theme (by extending the DrupalGap Theme prototype).
 * @see docs/
 * @param name {String} The theme's name.
 * @param theme {Function}
 */
dg.createTheme = function(name, theme) {
  dg.themes[name] = theme;
  dg.themes[name].prototype = new dg.Theme;
  dg.themes[name].prototype.constructor = dg.themes[name];
};

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
      var themeConfig = dg.config('theme');
      if (!themeConfig) {
        console.log('No theme config found in settings.js file');
        return;
      }
      var themeClassName = jDrupal.ucfirst(dg.getCamelCase(themeConfig.name));
      if (!dg.themes[themeClassName]) {
        var msg = 'Failed to load theme (' + themeClassName + ') - did you include its .js file in index.html?';
        err(msg);
        return;
      }
      dg.activeTheme = new dg.themes[themeClassName];

      // Also make a module instance for the theme so it can be part of hook invocations.
      dg.modules[name] = new dg.Module();
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
  //try {

    // @TODO add an `_access_callback` and `_access_arguments` properties, see Drupal's way before implementing

    // If there is HTML markup present, just return it as is. Otherwise, run
    // the theme hook and send along the variables.
    if (!variables) { variables = {}; }
    if (variables._markup) { return variables._markup; }
    var content = '';

      // Make sure there is a theme_*() function within the dg namespace for this hook.
      var theme_function = 'theme_' + hook;
      if (!dg[theme_function]) {
        var caller = null;
        if (arguments.callee.caller) { caller = arguments.callee.caller.name; }
        var msg = 'WARNING: dg.' + theme_function + '() does not exist.';
        if (caller) { msg += ' Called by: ' + caller + '().'; }
        console.log(msg);
        return content;
      }

    dg.setRenderElementDefaults(variables);

    // Utilizing the theme registry, determine if any module is implementing this theme hook.
    var module = null;
    if (dg.themeHookRegistered(hook)) { module = dg.getThemeHook(hook); }
    else {
      var modules = jDrupal.moduleImplements(hook);
      if (modules) { module = modules[0]; }
      dg.registerThemeHook(hook, module);
    }

    // If a module implements the theme hook, use that module's implementation of the theme
    // hook, otherwise use the implementation found within the dg namespace.
    var func = null;
    if (module) {
      theme_function = module + '_' + hook;
      func = window[theme_function];
    }
    else { func = dg[theme_function]; }

    // Invoke the theme function to get the html.
    var html = func.call(null, variables);

    // If a Promise came back, when it resolves, place its content within its element.
    if (html instanceof Promise) {
      html.then(function(data) {
        dg.qs('#' + data.variables._attributes.id).innerHTML = dg.render(data.content);
      });
      return '<div ' + dg.attributes(variables._attributes) + '></div>';
    }

    return html;

  //}
  //catch (error) { console.log('dg.theme - ' + error); }
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
