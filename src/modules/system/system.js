dg.modules.system = new dg.Module();

dg.modules.system.routing = function() {
  var routes = {};
  routes["system.dashboard"] = {
    "path": "/dg",
    "defaults": {
      "_title": "Getting started",
      _controller: function() {
        return new Promise(function(ok, err) {
          var content = {};
          var account = dg.currentUser();

          // Show welcome message.
          var msg = 'Welcome to DrupalGap, ';
          if (account.isAuthenticated()) { msg += account.getAccountName() + '!'; }
          else { msg += dg.l('click here', 'http://docs.drupalgap.org/8') + ' to view the documentation.'; }
          content['welcome'] = { _markup: '<p>' + msg + '</p>' };

          // Add getting started info.
          content['header'] = {
            _markup: '<h2>' + dg.t('Resources') + '</h2>'
          };
          content['resources'] = {
            _theme: 'item_list',
            _items: [
                dg.l(dg.t('Hello World'), 'http://docs.drupalgap.org/8/Hello_World'),
                dg.l(dg.t('Create a Module'), 'http://docs.drupalgap.org/8/Modules/Create_a_Custom_Module')
            ]
          };

          ok(content);
        });

      }
    }
  };
  routes["system.404"] = {
    "path": "/404",
    "defaults": {
      "_title": "404 - Page not found",
      _controller: function() {
        return new Promise(function(ok, err) {
          ok('Sorry, that page was not found...');
        });

      }
    }
  };
  return routes;
};

dg.modules.system.blocks = function() {
  var blocks = {};
  blocks.logo = {
    build: function () {
      return new Promise(function(ok, err) {
        ok(dg.config('logo'));
      });
    }
  };
  blocks.main = {
    build: function () {
      return new Promise(function(ok, err) {
        ok(dg.content);
      });
    }
  };
  blocks.main_menu = {
    build: function () {
      return new Promise(function(ok, err) {
        var content = {};
        var items = [ dg.l(dg.t('Home'), '') ];
        content['menu'] = {
          _theme: 'item_list',
          _items: items
        };
        ok(content);
      });
    }
  };
  blocks.primary_local_tasks = {
    build: function () {
      return new Promise(function(ok, err) {

        // @TODO this needs to be turned into a widget so it can be dropped anywhere, f'in awesome!

        var content = {};
        var items = [];
        var route = dg.router.getActiveRoute();

        // Figure out the base route and place it first on the items array.
        var childRoutes = null;
        var baseLinkText = null;
        var baseLinkPath = null;
        if (dg.router.hasBaseRoute(route)) {
          var baseRoute = dg.router.getBaseRoute(route);
          childRoutes = dg.router.getChildRoutes(baseRoute);
          baseLinkText = dg.router.getRouteTitle(baseRoute);
          baseLinkPath = dg.router.resolvePath(baseRoute);
        }
        else if (dg.router.hasChildRoutes(route)) {
          childRoutes = dg.router.getChildRoutes(route);
          baseLinkText = dg.router.getRouteTitle(route);
          baseLinkPath = dg.router.resolvePath(route);
        }
        if (!childRoutes) { err(); return; }
        items.push({
          _theme: 'list_item',
          _text: {
            _theme: 'link',
            _text: baseLinkText,
            _path: baseLinkPath
          },
          _attributes: { class: [] } // Leave these for easy alterations down the line.
        });

        // Iterate over the child routes and add list item links onto the items array.
        for (var i = 0; i < childRoutes.length; i++) {
          var childRoute = dg.router.loadRoute(childRoutes[i]);
          if (!childRoute) { continue; }
          items.push({
            _theme: 'list_item',
            _text: {
              _theme: 'link',
              _text: dg.router.getRouteTitle(childRoute),
              _path: dg.router.resolvePath(childRoute)
            },
            _attributes: { class: [] } // Leave these for easy alterations down the line.
          });

        }

        // Render an item list for the local tasks and resolve it.
        content.local_tasks = {
          _theme: 'item_list',
          _items: items
        };
        ok(content);

      });
    }
  };
  blocks.powered_by = {
    build: function () {
      return new Promise(function(ok, err) {
        var content = {};
        content['list'] = {
          _theme: 'item_list',
          _title: dg.t('Powered by'),
          _items: [dg.l('DrupalGap', 'http://drupalgap.org'), dg.l('Drupal', 'http://drupal.org')]
        };
        ok(content);
      });
    }
  };
  blocks.title = {
    build: function () {
      return new Promise(function(ok, err) {
        var title = dg.getTitle();
        if (typeof title === 'string') {
          var element = {
            _theme: 'title',
            _title: dg.t(title)
          };
          ok(element);
        }
        else { ok(title); }
      });
    }
  };
  blocks.messages = {
    build: function () {
      return new Promise(function(ok, err) {
        if (!dg.getMessageCount()) { ok(); return; }
        var element = {};
        var messages = dg.getMessages();
        for (var i = 0; i < messages.length; i++) {
          element['msg' + i] = messages[i];
        }
        dg.clearMessages();
        ok(element);
      });
    }
  };
  return blocks;
};
