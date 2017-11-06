With page arguments, we can have one `_controller` handle many different paths.

A common use case is to be able to load and display a node within your app. Say for example you had a content type called `group`, here's a simple route you can add to your module's `routing` function.
```
dg.modules.example.routing = function() {
  var routes = {};

  routes['group'] = {
    path: "/group/(.*)",
    defaults: {
      _title: 'Group',
      _controller: function(nid) {
        return new Promise(function(ok, err) {

          // Load up the group node and show its title.
          dg.nodeLoad(nid).then(function(node) {

            // Update the page title with the group name.
            dg.setTitle(node.getTitle());

            // Build the element to render the group.
            var element = {};
            element.foo = {
              _markup: JSON.stringify(node)
            };

            // Send the element off to be rendered.
            ok(element);

          });

        });
      }
    }
  };  
  return routes;
};
```

