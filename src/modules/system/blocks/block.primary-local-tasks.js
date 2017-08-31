dg.modules.system.blockPrimaryLocalTasks = function() {
  return {
    build: function () {
      return new Promise(function(ok, err) {

        // @TODO this needs to be turned into a widget so it can be dropped anywhere, f'in awesome!

        var content = {};
        var items = [];
        var route = dg.router.getActiveRoute();

        // Figure out the base route depending on if the active route is a child, or
        // has children..
        var childRoutes = null;
        var baseLinkText = null;
        var baseLinkPath = null;
        if (dg.router.hasBaseRoute(route)) { // Is a child...
          var baseRoute = dg.router.getBaseRoute(route);
          childRoutes = dg.router.getChildRoutes(baseRoute);
          baseLinkText = dg.router.getRouteTitle(baseRoute);
          baseLinkPath = dg.router.resolvePath(baseRoute);
        }
        else if (dg.router.hasChildRoutes(route)) { // Has children...
          childRoutes = dg.router.getChildRoutes(route);
          baseLinkText = dg.router.getRouteTitle(route);
          baseLinkPath = dg.router.resolvePath(route);
        }

        // No base routes or child routes on this path, resolve nothing.
        if (!childRoutes) {
          ok('');
          return;
        }

        // Add the base link.
        items.push({
          _theme: 'list_item',
          _text: {
            _theme: 'link',
            _text: baseLinkText,
            _path: baseLinkPath,
            _key: dg.router.getRouteKey(baseRoute),
            _attributes: { class: [] } // Leave these for easy alterations down the line.
          },
          _attributes: { class: [] } // Leave these for easy alterations down the line.
        });

        // Iterate over the child routes and add list item links onto the items array.
        for (var i = 0; i < childRoutes.length; i++) {
          var childRoute = dg.router.loadRoute(childRoutes[i]);
          if (!childRoute || !dg.router.meetsRequirements(childRoute)) { continue; }
          items.push({
            _theme: 'list_item',
            _text: {
              _theme: 'link',
              _text: dg.router.getRouteTitle(childRoute),
              _path: dg.router.resolvePath(childRoute),
              _key: dg.router.getRouteKey(childRoute),
              _attributes: { class: [] } // Leave these for easy alterations down the line.
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
};