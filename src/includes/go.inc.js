// Holds onto any query string during the page go process.
var _drupalgap_goto_query_string = null;

/**
 * Given a path, this will change the current page in the app.
 * @param {String} path
 * @return {*}
 */
function drupalgap_goto(path) {
  try {

    // Extract any incoming options, set any defaults that weren't provided,
    // then populate the global page options variable.
    var options = {};
    if (arguments[1]) {
      options = arguments[1];
      if (typeof options.form_submission === 'undefined') {
        options.form_submission = false;
      }
    }
    drupalgap.page.options = options;

    // Prepare the path.
    path = _drupalgap_goto_prepare_path(path, true);
    if (!path) { return false; }

    // Invoke all implementations of hook_drupalgap_goto_preprocess().
    module_invoke_all('drupalgap_goto_preprocess', path);

    // Determine the router path.
    var router_path = drupalgap_get_menu_link_router_path(path);

    // Make sure we have a menu link item that can handle this router path,
    // otherwise we'll goto the 404 page.
    if (!drupalgap.menu_links[router_path]) {
      // Is anyone trying to handle this 404?
      var new_path = false;
      var invocation_results = module_invoke_all('404', router_path);
      if (invocation_results) {
        for (var index in invocation_results) {
            if (!invocation_results.hasOwnProperty(index)) { continue; }
            var result = invocation_results[index];
            if (result !== false) {
              new_path = result;
              break;
            }
        }
      }
      // If a 404 handler provided a new path use it, otherwise just use the
      // system 404 page. Either way, update the router path before continuing
      // with a normal page build.
      if (new_path) { path = new_path; }
      else { path = '404'; }
      router_path = drupalgap_get_menu_link_router_path(path);
    }

    // Make sure the user has access to this router path, if they don't send
    // them to the 401 page.
    // @TODO - for now we're going to skip access checks on local tasks, since
    // they are covered by menu_block_view(), but if someone were to navigate
    // directly to e.g. a node's edit page, they would be able to see the page.
    // Of course Drupal would actually prevent them from updating the node on
    // the live site, but nonetheless this needs to be fixed. It's a tough issue
    // though and related to https://github.com/signalpoint/DrupalGap/issues/257
    if (
      drupalgap.menu_links[router_path].type != 'MENU_DEFAULT_LOCAL_TASK' &&
      drupalgap.menu_links[router_path].type != 'MENU_LOCAL_TASK' &&
      !drupalgap_menu_access(router_path)
    ) {
      path = '401';
      router_path = drupalgap_get_menu_link_router_path(path);
    }

    // If the new router path is the same as the current router path and the new
    // path is the same as the current path, we may need to cancel the
    // navigation attempt (i.e. don't go anywhere), unless it is a
    // form submission, then continue.
    if (
      router_path == drupalgap_router_path_get() &&
      path == drupalgap_path_get()
    ) {
      // If it's a form submission, we'll continue onward...
      if (options.form_submission) { }

      // If we're reloading the current page, we need to set aside this path
      // and navigate to the system's _reload page, which will then handle the
      // actual reloading of the page.
      // @see system_drupalgap_goto_post_process()
      else if (options.reloadPage) {
        _system_reload_page = path;
        path = '_reload';
        router_path = drupalgap_get_menu_link_router_path(path);
      }

      // Otherwise, just stop the navigation attempt.
      else { return false; }

    }

    // Grab the page id.
    var page_id = drupalgap_get_page_id(path);

    // Return if we are trying to go to the path we are already on, unless this
    // was a form submission, then we'll let the page rebuild itself. For
    // accuracy we compare the jQM active page url with the destination page
    // id.
    // @todo - this boolean doesn't match the comment description of the code
    // block, i.e. the form_submission check is opposite of what it says
    if (drupalgap_jqm_active_page_url() == page_id && options.form_submission) {
      // Clear any messages from the page before returning.
      drupalgap_clear_messages();
      return false;
    }

    // @TODO when drupalgap_goto() is called during the bootstrap, we shouldn't
    // put the path onto the back_path array.

    // Save the back path.
    var back_paths_to_ignore = ['user/logout', '_reload'];
    if (!in_array(drupalgap_path_get())) {
      drupalgap.back_path.push(drupalgap_path_get());
    }

    // Set the current menu path to the path input.
    drupalgap_path_set(path);

    // Set the drupalgap router path.
    drupalgap_router_path_set(router_path);

    // If the page is already in the DOM and we're asked to reload it, then
    // remove the page and let it rebuild itself. If we're not reloading the
    // page and we're not in the middle of a form submission, prevent the page
    // from processing then change to it.
    if (drupalgap_page_in_dom(page_id)) {

      // If there are any hook_menu() item options for this router path, bring
      // them into the current options without overwriting any existing values.
      if (drupalgap.menu_links[router_path].options) {
        options = $.extend(
          {},
          drupalgap.menu_links[router_path].options,
          options
        );
      }

      // Reload the page? If so, remove the page from the DOM, delete the
      // reloadPage option, then set the reloadingPage option to true so others
      // down the line will know the page is reloading. We can't pass along the
      // actual reloadPage option since it may collide with jQM later on. We
      // have to use 'force' when removing the page from the DOM since DG won't
      // remove it since it thinks we are already on the page, so it won't
      // remove it.
      if (typeof options.reloadPage !== 'undefined' && options.reloadPage) {
        // @TODO we may need to leave the query ONLY if the above call to
        // _drupalgap_goto_prepare_path() yielded a query string, otherwise we
        // may be leaving unwanted queries in _GET()!
        var leaveQuery = _drupalgap_goto_query_string ? true : false;
        drupalgap_remove_page_from_dom(page_id, {
          force: true,
          leaveQuery: leaveQuery
        });
        delete options.reloadPage;
        options.reloadingPage = true;
      }
      else if (!options.form_submission) {
        drupalgap_clear_messages();
        _drupalgap_goto_query_string = null;
        drupalgap.page.process = false;
        // @TODO changePage has been deprecated as of jQM 1.4.0 and will be
        // removed in 1.50.
        // @see https://api.jquerymobile.com/jQuery.mobile.changePage/
        $.mobile.changePage('#' + page_id, options);
        module_invoke_all('drupalgap_goto_post_process', path);
        return;
      }
    }
    else if (typeof options.reloadPage !== 'undefined' && options.reloadPage) {
      // The page is not in the DOM, and we're being asked to reload it, so
      // we'll just delete the reloadPage option.
      delete options.reloadPage;
    }

    // Generate the page.
    drupalgap_goto_generate_page_and_go(path, page_id, options, drupalgap.menu_links[router_path]);
  }
  catch (error) { console.log('drupalgap_goto - ' + error); }
}

/**
 * Generate a JQM page by running it through the theme then attach the
 * page to the <body> of the document, then change to the page. Remember,
 * the rendering of the page does not take place here, that is covered by
 * the pagebeforechange event in theme.inc.js which happens after we change
 * the page here.
 * @param {String} path
 * @param {String} page_id
 * @param {Object} options
 * @param {Object} menu_link The menu link object from drupalgap.menu_links.
 */
function drupalgap_goto_generate_page_and_go(
  path, page_id, options, menu_link) {
  try {

    // @TODO using a page.tpl.html is pretty dumb, this makes a disc read on each page change, use render arrays only
    // be deprecating the page.tpl.html file, converting it to a render array and warning developers to upgrade their
    // themes.
    var page_template_path = path_to_theme() + '/page.tpl.html';
    if (!drupalgap_file_exists(page_template_path)) {
      console.log(
        'drupalgap_goto_generate_page_and_go - ' +
        'page template does not exist! (' + page_template_path + ')'
      );
    }
    else {

      // Reset the internal query string.
      _drupalgap_goto_query_string = null;

      // If options wasn't set, set it as an empty JSON object.
      if (typeof options === 'undefined') { options = {}; }

      // Load the page template html file. Determine if we are going to cache
      // the template file or not.
      // @TODO another disc read here, dumb, use render arrays and deprecate.
      var file_options = {};
      if (drupalgap.settings.cache &&
          drupalgap.settings.cache.theme_registry !== 'undefined' &&
          !drupalgap.settings.cache.theme_registry) {
          file_options.cache = false;
       }
      var html = drupalgap_file_get_contents(page_template_path, file_options);

      if (html) {

        // Add page to DOM.
        drupalgap_add_page_to_dom({
            page_id: page_id,
            html: html,
            menu_link: menu_link
        });

        // Setup change page options if necessary.
        if (drupalgap_path_get() == path && options.form_submission) {
          options.allowSamePageTransition = true;
        }

        // Let's change to the page. Web apps and the ripple emulator do not
        // seem to like the 'index.html' prefix, so we'll remove that.
        var destination = 'index.html#' + page_id;
        if (
          drupalgap.settings.mode != 'phonegap' ||
          typeof parent.window.ripple === 'function'
        ) { destination = '#' + page_id; }
        $.mobile.changePage(destination, options); // @see the pagebeforechange handler in page.inc.js

        // Invoke all implementations of hook_drupalgap_goto_post_process().
        module_invoke_all('drupalgap_goto_post_process', path);
      }
      else {
        drupalgap_alert(
          'drupalgap_goto_generate_page_and_go - ' +
          t('failed to load theme\'s page.tpl.html file')
        );
      }
    }
  }
  catch (error) {
    console.log('drupalgap_goto_generate_page_and_go - ' + error);
  }
}

/**
 * Prepares a drupalgap page path.
 * @deprecated Use _drupalgap_goto_prepare_path() instead.
 * @param {String} path
 * @return {String}
 */
function drupalgap_goto_prepare_path(path) {
  try {
    console.log('WARNING - drupalgap_goto_prepare_path() is deprecated, ' +
      'use _drupalgap_goto_prepare_path() instead!');
    return _drupalgap_goto_prepare_path(path);
  }
  catch (error) { console.log('drupalgap_goto_prepare_path - ' + error); }
}

/**
 * An internal function used to prepare the path for menu routing. An optional
 * second parameter (boolean) may be passed in, and if it is set to true it will
 * process any _GET query string parameters.
 * @param {String} path
 * @return {String}
 */
function _drupalgap_goto_prepare_path(path) {
  try {

    // Pull out any query string parameters and populate them into _GET, if we
    // were instructed to do so. Hold onto a global copy of the query string
    // for page go processing.
    if (typeof arguments[1] !== 'undefined' && arguments[1]) {
      var pos = path.indexOf('?');
      if (pos != -1 && pos != path.length - 1) {
        var query = path.substr(pos + 1, path.length - pos);
        _drupalgap_goto_query_string = query;
        path = path.substr(0, pos);
        var parts = query.split('&');
        for (var i = 0; i < parts.length; i++) {
          pos = parts[i].indexOf('=');
          if (pos == -1) { continue; }
          query = parts[i].split('=');
          if (query.length != 2) { continue; }
          _GET(
            decodeURIComponent(query[0]),
            decodeURIComponent(query[1]),
            path
          );
        }
      }
    }

    // If the path is an empty string, change it to the front page path.
    if (path == '') {
      if (!drupalgap.settings.front) {
        drupalgap_alert(
          'drupalgap_goto_prepare_path - ' +
          t('no front page specified in settings.js!')
        );
        return false;
      }
      else { path = drupalgap.settings.front; }
    }

    // Change 'user' to 'user/login' for anonymous users, or change it to e.g.
    // 'user/123' for authenticated users.
    else if (path == 'user') {
      if (Drupal.user.uid != 0) { path = 'user/' + Drupal.user.uid; }
      else { path = 'user/login'; }
    }

    // Finally return the path.
    return path;

  }
  catch (error) { console.log('drupalgap_goto_prepare_path - ' + error); }
}

/**
 * Change the page to the previous page.
 */
function drupalgap_back() {
  try {
    var active_page_id = $('.ui-page-active').attr('id');
    if (active_page_id == drupalgap.settings.front) {
      var msg = t('Exit') + ' ' + drupalgap.settings.title + '?';
      if (drupalgap.settings.exit_message) {
        msg = drupalgap.settings.exit_message;
      }
      drupalgap_confirm(msg, {
          confirmCallback: _drupalgap_back_exit
      });
    }
    else if (active_page_id == '_drupalgap_splash') { return; }
    else { _drupalgap_back(); }
  }
  catch (error) { console.log('drupalgap_back - ' + error); }
}

/**
 * An internal function used to change the page to the previous page.
 */
function _drupalgap_back() {
  try {
    // @WARNING - any changes here (except the history.back() call) need to be
    // reflected into the window "navigate" handler below
    drupalgap.back = true;

    // Properly handle iOS9 back button clicks, and default back button clicks.
    if (typeof device !== 'undefined' && device.platform === "iOS" && parseInt(device.version) === 9) {
      $.mobile.back();
    }
    else { history.back(); }

    // Update the path and router path.
    var from = drupalgap_path_get();
    drupalgap_path_set(drupalgap.back_path.pop());
    var to = drupalgap_path_get();
    drupalgap_router_path_set(drupalgap_get_menu_link_router_path(to));
    module_invoke_all('drupalgap_back', from, to);

  }
  catch (error) { console.log('_drupalgap_back - ' + error); }
}

/**
 * An internal function used to exit the app when the back button is clicked.
 * @param {Number} button Which button was pressed.
 */
function _drupalgap_back_exit(button) {
  try {
    button === 1 ? navigator.app.exitApp() : '';
  }
  catch (error) { console.log('_drupalgap_back_exit - ' + error); }
}

$(window).on('navigate', function(event, data) {

    // If we're already moving backwards (aka from a "soft" back button click),
    // then don't do anything.
    if (drupalgap.back) { return; }

    // In web-app mode, clicking the back button on your browser (or Android
    // device browser), does not actually fire drupalgap_back(), so we mimic
    // it here, but skip the history.back() call because that's already
    // happened via the hardware button.
    if (drupalgap.settings.mode == 'web-app') {
      // Grab the direction we're travelling.
      // back, forward (or undefined, aka moving from splash to front page)
      var direction = data.state.direction;
      if (direction == 'back' && drupalgap.back_path.length > 0) {
        // @WARNING - any changes here should be reflected into _drupalgap_back().
        drupalgap.back = true;
        // Update the path and router path.
        var from = drupalgap_path_get();
        drupalgap_path_set(drupalgap.back_path.pop());
        var to = drupalgap_path_get();
        drupalgap_router_path_set(drupalgap_get_menu_link_router_path(to));
        module_invoke_all('drupalgap_back', from, to);
      }
    }

});

