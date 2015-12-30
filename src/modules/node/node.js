var dgNode = new dg.Module();

dgNode.routing = function() {
  var routes = {};
  routes["node"] = {
    "path": "/node\/(.*)",
    "defaults": {
      "_controller": function(nid) {
        return new Promise(function(ok, err) {

          dg.nodeLoad(nid).then(function(node) {
            var content = {};
            content['nid'] = {
              _markup: '<h2>' + node.getTitle() + '</h2>'
            };
            ok(content);
          });

        });
      },
      "_title": "Node"
    }
  };
  return routes;
};
