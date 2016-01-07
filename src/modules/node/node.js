dg.modules.node = new dg.Module();

dg.modules.node.routing = function() {
  var routes = {};
  routes["node.add"] = {
    "path": "/node\/add\/(.*)",
    "defaults": {
      "_form": 'NodeEdit',
      "_title": "Create content"
    }
  };
  routes["node"] = {
    "path": "/node\/(.*)",
    "defaults": {
      "_controller": function(nid) {
        return new Promise(function(ok, err) {

          dg.nodeLoad(nid).then(function(node) {
            dg.entityRenderContent(node).then(ok);
          });

        });
      },
      "_title": "Node"
    }
  };
  return routes;
};
